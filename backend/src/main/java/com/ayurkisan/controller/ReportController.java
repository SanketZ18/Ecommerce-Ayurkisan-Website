package com.ayurkisan.controller;

import com.ayurkisan.dto.reports.*;
import com.ayurkisan.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.ayurkisan.Modules.Orders.Order;
import com.ayurkisan.Modules.Orders.OrderService;
import com.ayurkisan.Modules.Orders.InvoiceService;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping("/sales")
    public ResponseEntity<SalesReportDTO> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(reportService.generateOrderSalesReport(start, end));
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductSalesReportDTO>> getProductSalesReport() {
        return ResponseEntity.ok(reportService.generateProductSalesReport());
    }

    @GetMapping("/packages")
    public ResponseEntity<List<PackageReportDTO>> getPackageSalesReport() {
        return ResponseEntity.ok(reportService.generatePackageSalesReport());
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(reportService.getDashboardStats());
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductSalesHistoryDTO> getProductHistory(@PathVariable String productId) {
        return ResponseEntity.ok(reportService.generateDetailedProductHistory(productId));
    }

    @GetMapping("/export/products/csv")
    public ResponseEntity<byte[]> exportProductsCSV() {
        List<ProductSalesReportDTO> data = reportService.generateProductSalesReport();
        byte[] csv = reportService.exportProductReportToCSV(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=product_sales_report.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/export/products/excel")
    public ResponseEntity<byte[]> exportProductsExcel() throws Exception {
        List<ProductSalesReportDTO> data = reportService.generateProductSalesReport();
        byte[] excel = reportService.exportProductReportToExcel(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=product_sales_report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }

    @GetMapping("/export/products/pdf")
    public ResponseEntity<byte[]> exportProductsPDF() throws Exception {
        List<ProductSalesReportDTO> data = reportService.generateProductSalesReport();
        byte[] pdf = reportService.exportProductReportToPDF(data);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=product_sales_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/export/bulk-invoices")
    public ResponseEntity<byte[]> exportBulkInvoices(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) throws Exception {

        List<Order> allOrders = orderService.getAllOrders();

        if (role != null && !role.isEmpty()) {
            allOrders = allOrders.stream()
                .filter(o -> role.equalsIgnoreCase(o.getRole()))
                .collect(Collectors.toList());
        }

        if (start != null && end != null) {
            allOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && !o.getCreatedAt().isBefore(start) && !o.getCreatedAt().isAfter(end))
                .collect(Collectors.toList());
        }

        // Only include completed/delivered orders logically? The prompt didn't specify exactly, 
        // but typically invoices are for confirmed/delivered orders. We'll export matched orders.

        byte[] pdf = invoiceService.generateBulkInvoices(allOrders, role);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=bulk_invoices_" + (role != null ? role : "all") + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
