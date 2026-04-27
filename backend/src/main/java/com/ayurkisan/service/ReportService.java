package com.ayurkisan.service;

import com.ayurkisan.dto.reports.*;
import com.ayurkisan.model.Product;
import com.ayurkisan.Modules.Packages.ProductPackageRepository;
import com.ayurkisan.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class ReportService {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductPackageRepository packageRepository;

    public SalesReportDTO generateOrderSalesReport(LocalDateTime start, LocalDateTime end) {
        try {
            Criteria dateCriteria = Criteria.where("createdAt").gte(start).lte(end);
            Criteria statusCriteria = Criteria.where("orderStatus").nin("CANCELLED", "RETURNED");
            
            // General Stats
            Aggregation agg = newAggregation(
                match(new Criteria().andOperator(dateCriteria, statusCriteria)),
                group()
                    .count().as("totalOrders")
                    .sum("totalDiscountedPrice").as("totalSalesAmount")
                    .sum("items.quantity").as("totalProductsSold")
            );
            
            AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(agg, "Orders", getMapClass());
            Map<String, Object> generalStats = results.getUniqueMappedResult();
            
            SalesReportDTO dto = new SalesReportDTO();
            if (generalStats != null) {
                dto.setTotalOrders(((Number) generalStats.getOrDefault("totalOrders", 0)).longValue());
                dto.setTotalSalesAmount(((Number) generalStats.getOrDefault("totalSalesAmount", 0.0)).doubleValue());
                dto.setTotalProductsSold(((Number) generalStats.getOrDefault("totalProductsSold", 0)).longValue());
            } else {
                dto.setTotalOrders(0L);
                dto.setTotalSalesAmount(0.0);
                dto.setTotalProductsSold(0L);
            }

            // Stats by Role
            dto.setCustomerStats(getRoleStats(dateCriteria, "CUSTOMER"));
            dto.setRetailerStats(getRoleStats(dateCriteria, "RETAILER"));

            // Status Breakdown
            dto.setStatusBreakdown(getStatusBreakdown(dateCriteria));
            
            // Sales by Region
            dto.setRegionBreakdown(getRegionBreakdown(dateCriteria));

            return dto;
        } catch (Exception e) {
            System.err.println("Error generating sales report: " + e.getMessage());
            return new SalesReportDTO();
        }
    }

    private SalesReportDTO.RoleStats getRoleStats(Criteria dateCriteria, String role) {
        try {
            // Case-insensitive role match
            Criteria roleCriteria = Criteria.where("role").regex("^" + role + "$", "i");
            Criteria statusCriteria = Criteria.where("orderStatus").nin("CANCELLED", "RETURNED");
            Aggregation agg = newAggregation(
                match(new Criteria().andOperator(dateCriteria, roleCriteria, statusCriteria)),
                group()
                    .count().as("orderCount")
                    .sum("totalDiscountedPrice").as("salesAmount")
            );
            AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(agg, "Orders", getMapClass());
            Map<String, Object> stats = results.getUniqueMappedResult();
            
            SalesReportDTO.RoleStats roleStats = new SalesReportDTO.RoleStats();
            if (stats != null) {
                roleStats.setOrderCount(((Number) stats.getOrDefault("orderCount", 0)).longValue());
                roleStats.setSalesAmount(((Number) stats.getOrDefault("salesAmount", 0.0)).doubleValue());
            } else {
                roleStats.setOrderCount(0L);
                roleStats.setSalesAmount(0.0);
            }
            return roleStats;
        } catch (Exception e) {
            System.err.println("Error getting role stats for " + role + ": " + e.getMessage());
            return new SalesReportDTO.RoleStats();
        }
    }

    private Map<String, Long> getStatusBreakdown(Criteria dateCriteria) {
        try {
            Aggregation agg = newAggregation(
                match(dateCriteria),
                group("orderStatus").count().as("count")
            );
            AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(agg, "Orders", getMapClass());
            return results.getMappedResults().stream()
                .collect(Collectors.toMap(
                    m -> m.get("_id") != null ? (String) m.get("_id") : "UNKNOWN",
                    m -> m.get("count") != null ? ((Number) m.get("count")).longValue() : 0L
                ));
        } catch (Exception e) {
            System.err.println("Error getting status breakdown: " + e.getMessage());
            return new HashMap<>();
        }
    }

    private Map<String, Double> getRegionBreakdown(Criteria dateCriteria) {
        try {
            Criteria statusCriteria = Criteria.where("orderStatus").nin("CANCELLED", "RETURNED");
            
            Aggregation agg = newAggregation(
                match(new Criteria().andOperator(dateCriteria, statusCriteria)),
                // Project a 'regionName' field that falls back through available address fields
                project("totalDiscountedPrice")
                    .and(ConditionalOperators.ifNull("shippingTaluka")
                        .then(ConditionalOperators.ifNull("shippingDistrict")
                            .then(ConditionalOperators.ifNull("shippingAddress")
                                .then("Other"))))
                    .as("regionName"),
                group("regionName").sum("totalDiscountedPrice").as("sales")
            );
            
            AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(agg, "Orders", getMapClass());
            
            return results.getMappedResults().stream()
                .collect(Collectors.toMap(
                    m -> {
                        Object id = m.get("_id");
                        if (id == null || id.toString().trim().isEmpty()) return "Other";
                        return id.toString();
                    },
                    m -> m.get("sales") != null ? ((Number) m.get("sales")).doubleValue() : 0.0,
                    (v1, v2) -> v1 + v2
                ));
        } catch (Exception e) {
            System.err.println("Error getting region breakdown: " + e.getMessage());
            return new HashMap<>();
        }
    }

    public List<ProductSalesReportDTO> generateProductSalesReport() {
        try {
            Aggregation agg = newAggregation(
                match(Criteria.where("orderStatus").nin("CANCELLED", "RETURNED")),
                unwind("items"),
                match(Criteria.where("items.itemType").regex("^PRODUCT$", "i")),
                group("items.productId")
                    .first("items.productName").as("productName")
                    .sum("items.quantity").as("totalQuantitySold")
                    .sum("items.totalItemPrice").as("totalRevenueGenerated")
                    .count().as("orderCount"),
                project("productName", "totalQuantitySold", "totalRevenueGenerated", "orderCount")
                    .and("_id").as("productId"),
                sort(org.springframework.data.domain.Sort.Direction.DESC, "totalQuantitySold")
            );

            AggregationResults<ProductSalesReportDTO> results = mongoTemplate.aggregate(agg, "Orders", ProductSalesReportDTO.class);
            List<ProductSalesReportDTO> list = results.getMappedResults();
            
            // Map to store grouped results by modern ID to merge duplicates (e.g. from outdated IDs)
            Map<String, ProductSalesReportDTO> groupedMap = new HashMap<>();

            for (ProductSalesReportDTO dto : list) {
                // Try to find the "active" product in DB
                Optional<Product> productOpt = productRepository.findById(dto.getProductId());
                if (productOpt.isEmpty() && dto.getProductName() != null) {
                    productOpt = productRepository.findByProductNameIgnoreCase(dto.getProductName());
                }

                if (productOpt.isPresent()) {
                    Product p = productOpt.get();
                    String modernId = p.getId();
                    
                    if (groupedMap.containsKey(modernId)) {
                        ProductSalesReportDTO existing = groupedMap.get(modernId);
                        existing.setTotalQuantitySold(existing.getTotalQuantitySold() + dto.getTotalQuantitySold());
                        existing.setTotalRevenueGenerated(existing.getTotalRevenueGenerated() + dto.getTotalRevenueGenerated());
                        existing.setOrderCount(existing.getOrderCount() + dto.getOrderCount());
                    } else {
                        // Initialize with modern info
                        dto.setProductId(modernId);
                        dto.setProductName(p.getProductName());
                        dto.setCurrentStockLevel(p.getStockQuantity());
                        groupedMap.put(modernId, dto);
                    }
                }
            }

            List<ProductSalesReportDTO> finalResult = new ArrayList<>(groupedMap.values());
            // Re-sort by volume after merging
            finalResult.sort((a, b) -> Integer.compare(b.getTotalQuantitySold(), a.getTotalQuantitySold()));

            return finalResult;
        } catch (Exception e) {
            System.err.println("Error generating product sales report: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public List<PackageReportDTO> generatePackageSalesReport() {
        try {
            Aggregation agg = newAggregation(
                match(Criteria.where("orderStatus").nin("CANCELLED", "RETURNED")),
                unwind("items"),
                match(Criteria.where("items.itemType").regex("^PACKAGE$", "i")),
                group("items.productId")
                    .first("items.productName").as("packageName")
                    .sum("items.quantity").as("totalPackagesSold")
                    .sum("items.totalItemPrice").as("totalRevenueGenerated"),
                org.springframework.data.mongodb.core.aggregation.Aggregation.project()
                    .and("_id").as("packageId")
                    .and("packageName").as("packageName")
                    .and("totalPackagesSold").as("totalPackagesSold")
                    .and("totalRevenueGenerated").as("totalRevenueGenerated"),
                sort(org.springframework.data.domain.Sort.Direction.DESC, "totalPackagesSold")
            );

            AggregationResults<PackageReportDTO> results = mongoTemplate.aggregate(agg, "Orders", PackageReportDTO.class);
            List<PackageReportDTO> list = results.getMappedResults();

            // Map to merge duplicates
            Map<String, PackageReportDTO> groupedMap = new HashMap<>();

            for (PackageReportDTO dto : list) {
                Optional<com.ayurkisan.Modules.Packages.ProductPackage> pkgOpt = packageRepository.findById(dto.getPackageId() != null ? dto.getPackageId() : "");
                if (pkgOpt.isEmpty() && dto.getPackageName() != null) {
                    pkgOpt = packageRepository.findByNameIgnoreCase(dto.getPackageName());
                }

                if (pkgOpt.isPresent()) {
                    com.ayurkisan.Modules.Packages.ProductPackage p = pkgOpt.get();
                    String modernId = p.getId();
                    
                    if (groupedMap.containsKey(modernId)) {
                        PackageReportDTO existing = groupedMap.get(modernId);
                        existing.setTotalPackagesSold(existing.getTotalPackagesSold() + dto.getTotalPackagesSold());
                        existing.setTotalRevenueGenerated(existing.getTotalRevenueGenerated() + dto.getTotalRevenueGenerated());
                    } else {
                        dto.setPackageId(modernId);
                        dto.setPackageName(p.getName()); // ProductPackage has getName()
                        groupedMap.put(modernId, dto);
                    }
                }
            }

            List<PackageReportDTO> finalResult = new ArrayList<>(groupedMap.values());
            finalResult.sort((a, b) -> Integer.compare(b.getTotalPackagesSold(), a.getTotalPackagesSold()));
            return finalResult;
        } catch (Exception e) {
            System.err.println("Error generating package sales report: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public ProductSalesHistoryDTO generateDetailedProductHistory(String productId) {
        try {
            // Find canonical name to catch historical entries with different IDs
            Optional<Product> pOpt = productRepository.findById(productId);
            String canonicalName = pOpt.map(Product::getProductName).orElse(null);

            Criteria itemCriteria;
            if (canonicalName != null) {
                itemCriteria = new Criteria().orOperator(
                    Criteria.where("items.productId").is(productId),
                    Criteria.where("items.productName").regex("^" + Pattern.quote(canonicalName) + "$", "i")
                );
            } else {
                itemCriteria = Criteria.where("items.productId").is(productId);
            }

            Aggregation agg = newAggregation(
                match(Criteria.where("orderStatus").nin("CANCELLED", "RETURNED")),
                unwind("items"),
                match(itemCriteria),
                // Projection stage 1: Ensure fields are available and mapped
                project("createdAt")
                    .and("items.quantity").as("quantity")
                    .and("items.totalItemPrice").as("revenue"),
                // Projection stage 2: Format the date
                project("quantity", "revenue")
                    .and("createdAt").dateAsFormattedString("%Y-%m-%d").as("day"),
                // Group by formatted day
                group("day")
                    .sum("quantity").as("totalQty")
                    .sum("revenue").as("totalRev"),
                sort(org.springframework.data.domain.Sort.Direction.ASC, "_id")
            );

            AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(agg, "Orders", getMapClass());
            
            ProductSalesHistoryDTO historyDTO = new ProductSalesHistoryDTO();
            historyDTO.setProductId(productId);
            pOpt.ifPresent(p -> historyDTO.setProductName(p.getProductName()));

            List<ProductSalesHistoryDTO.DailySales> list = results.getMappedResults().stream().map(m -> {
                ProductSalesHistoryDTO.DailySales ds = new ProductSalesHistoryDTO.DailySales();
                ds.setDate((String) m.get("_id"));
                ds.setQuantity(m.get("totalQty") != null ? ((Number) m.get("totalQty")).intValue() : 0);
                ds.setRevenue(m.get("totalRev") != null ? ((Number) m.get("totalRev")).doubleValue() : 0.0);
                return ds;
            }).collect(Collectors.toList());

            historyDTO.setHistory(list);
            return historyDTO;
        } catch (Exception e) {
            System.err.println("Error generating detailed product history for ID " + productId + ": " + e.getMessage());
            return new ProductSalesHistoryDTO();
        }
    }

    public DashboardStatsDTO getDashboardStats() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime todayStart = now.with(LocalTime.MIN);
            LocalDateTime weekStart = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
            LocalDateTime monthStart = now.withDayOfMonth(1).with(LocalTime.MIN);

            DashboardStatsDTO dto = new DashboardStatsDTO();
            dto.setSalesToday(getTotalSalesInPeriod(todayStart, now));
            dto.setSalesThisWeek(getTotalSalesInPeriod(weekStart, now));
            dto.setSalesThisMonth(getTotalSalesInPeriod(monthStart, now));
            
            dto.setTotalOrders(mongoTemplate.count(new Query(), "Orders"));

            // Best selling product
            try {
                List<ProductSalesReportDTO> products = generateProductSalesReport();
                if (!products.isEmpty()) dto.setBestSellingProduct(products.get(0).getProductName());
            } catch (Exception e) {
                System.err.println("Error getting best selling product: " + e.getMessage());
            }

            // Best selling package
            try {
                List<PackageReportDTO> packages = generatePackageSalesReport();
                if (!packages.isEmpty()) dto.setBestSellingPackage(packages.get(0).getPackageName());
            } catch (Exception e) {
                System.err.println("Error getting best selling package: " + e.getMessage());
            }

            return dto;
        } catch (Exception e) {
            System.err.println("Error generating dashboard stats: " + e.getMessage());
            return new DashboardStatsDTO();
        }
    }

    private double getTotalSalesInPeriod(LocalDateTime start, LocalDateTime end) {
        try {
            Aggregation agg = newAggregation(
                match(Criteria.where("createdAt").gte(start).lte(end)
                    .and("orderStatus").nin("CANCELLED", "RETURNED")),
                group().sum("totalDiscountedPrice").as("total")
            );
            AggregationResults<Map<String, Object>> results = mongoTemplate.aggregate(agg, "Orders", getMapClass());
            Map<String, Object> res = results.getUniqueMappedResult();
            return res != null && res.get("total") != null ? ((Number) res.get("total")).doubleValue() : 0.0;
        } catch (Exception e) {
            System.err.println("Error getting total sales in period: " + e.getMessage());
            return 0.0;
        }
    }

    public byte[] exportProductReportToCSV(List<ProductSalesReportDTO> data) {
        StringBuilder csv = new StringBuilder();
        csv.append("Product Name,Quantity Sold,Revenue,Order Count,Stock Level\n");
        for (ProductSalesReportDTO item : data) {
            csv.append(item.getProductName()).append(",")
               .append(item.getTotalQuantitySold()).append(",")
               .append(item.getTotalRevenueGenerated()).append(",")
               .append(item.getOrderCount()).append(",")
               .append(item.getCurrentStockLevel()).append("\n");
        }
        return csv.toString().getBytes();
    }

    public byte[] exportProductReportToExcel(List<ProductSalesReportDTO> data) throws Exception {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Product Sales Report");
            org.apache.poi.ss.usermodel.Row header = sheet.createRow(0);
            String[] columns = {"Product Name", "Quantity Sold", "Revenue", "Order Count", "Stock Level"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            int rowIdx = 1;
            for (ProductSalesReportDTO item : data) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.getProductName());
                row.createCell(1).setCellValue(item.getTotalQuantitySold());
                row.createCell(2).setCellValue(item.getTotalRevenueGenerated());
                row.createCell(3).setCellValue(item.getOrderCount());
                row.createCell(4).setCellValue(item.getCurrentStockLevel());
            }

            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportProductReportToPDF(List<ProductSalesReportDTO> data) throws Exception {
        java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
        com.itextpdf.kernel.pdf.PdfWriter writer = new com.itextpdf.kernel.pdf.PdfWriter(out);
        com.itextpdf.kernel.pdf.PdfDocument pdf = new com.itextpdf.kernel.pdf.PdfDocument(writer);
        com.itextpdf.layout.Document document = new com.itextpdf.layout.Document(pdf);

        document.add(new com.itextpdf.layout.element.Paragraph("Product Sales Report")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
        document.add(new com.itextpdf.layout.element.Paragraph("Generated on: " + LocalDateTime.now()));

        com.itextpdf.layout.element.Table table = new com.itextpdf.layout.element.Table(5);
        table.addHeaderCell("Product Name");
        table.addHeaderCell("Qty Sold");
        table.addHeaderCell("Revenue");
        table.addHeaderCell("Orders");
        table.addHeaderCell("Stock");

        for (ProductSalesReportDTO item : data) {
            table.addCell(item.getProductName() != null ? item.getProductName() : "N/A");
            table.addCell(String.valueOf(item.getTotalQuantitySold()));
            table.addCell("Rs. " + item.getTotalRevenueGenerated());
            table.addCell(String.valueOf(item.getOrderCount()));
            table.addCell(String.valueOf(item.getCurrentStockLevel()));
        }

        document.add(table);
        document.close();
        return out.toByteArray();
    }

    @SuppressWarnings("unchecked")
    private Class<Map<String, Object>> getMapClass() {
        return (Class<Map<String, Object>>) (Class<?>) Map.class;
    }
}
