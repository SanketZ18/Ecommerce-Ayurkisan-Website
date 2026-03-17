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

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

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
}
