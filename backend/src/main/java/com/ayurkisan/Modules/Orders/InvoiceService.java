package com.ayurkisan.Modules.Orders;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.ayurkisan.util.FinanceCalculator;


@Service
public class InvoiceService {

    @Autowired
    private SpringTemplateEngine templateEngine;

    public byte[] generateInvoice(Order order, String invoiceType) throws Exception {
        Context context = new Context();
        context.setVariable("order", order);
        context.setVariable("invoiceType", invoiceType != null ? invoiceType : order.getRole());

        double gst = order.getGstAmount();
        
        context.setVariable("cgstAmount", FinanceCalculator.round(gst / 2.0));
        context.setVariable("sgstAmount", FinanceCalculator.round(gst / 2.0));
        context.setVariable("cgstRate", 9.0);
        context.setVariable("sgstRate", 9.0);
        context.setVariable("totalTax", gst);
        context.setVariable("amountInWords", convertToIndianCurrency(order.getTotalDiscountedPrice()));
        context.setVariable("youSaved", FinanceCalculator.round(order.getTotalOriginalPrice() - order.getTotalDiscountedPrice()));
        context.setVariable("receivedAmount", order.getTotalDiscountedPrice());
        context.setVariable("balanceAmount", 0.0);
        context.setVariable("placeOfSupply", "27-Maharashtra");




        try {
            java.io.File logoFile = new java.io.File("D:\\MCA SEM-4\\Sem 4 Project\\My Work\\Ecommerce-Ayurkisan-Website\\frontend\\src\\assets\\Company Logos (1024 × 1024 px).png");
            if(logoFile.exists()) {
                byte[] logoBytes = java.nio.file.Files.readAllBytes(logoFile.toPath());
                String base64Logo = java.util.Base64.getEncoder().encodeToString(logoBytes);
                context.setVariable("logoBase64", base64Logo);
            }
        } catch(Exception e) {
            System.err.println("Failed to bind logo: " + e.getMessage());
        }

        String html = templateEngine.process("invoice-template", context);

        ByteArrayOutputStream target = new ByteArrayOutputStream();
        ConverterProperties converterProperties = new ConverterProperties();
        
        HtmlConverter.convertToPdf(html, target, converterProperties);

        return target.toByteArray();
    }

    public byte[] generateBulkInvoices(List<Order> orders, String invoiceType, java.time.LocalDateTime start, java.time.LocalDateTime end) throws Exception {
        if (orders == null || orders.isEmpty()) {
            return new byte[0];
        }

        List<Order> deliveredOrders = orders.stream()
            .filter(o -> "DELIVERED".equalsIgnoreCase(o.getOrderStatus()))
            .collect(java.util.stream.Collectors.toList());
            
        if (deliveredOrders.isEmpty()) {
            return new byte[0];
        }

        Context context = new Context();
        context.setVariable("orders", deliveredOrders);
        context.setVariable("invoiceType", invoiceType != null ? invoiceType : "ALL");
        context.setVariable("exportDate", java.time.LocalDateTime.now());
        context.setVariable("startDate", start);
        context.setVariable("endDate", end);
        
        // Ensure subtotal and GST are accurately calculated for the report
        deliveredOrders.forEach(order -> {
            boolean updated = false;
            if (order.getBaseSubtotal() <= 0) {
                double calcSub = order.getItems().stream()
                    .mapToDouble(item -> item.getDiscountedPrice() * item.getQuantity())
                    .sum();
                order.setBaseSubtotal(FinanceCalculator.round(calcSub));
                updated = true;
            }
            // Fallback for missing GST calculation (18% of base subtotal)
            if (order.getGstAmount() <= 0) {
                order.setGstAmount(FinanceCalculator.round(order.getBaseSubtotal() * 0.18));
                updated = true;
            }
            // If the record was old and we recalculated values, ensure the final total reflects the sum
            // This is ONLY for report display consistency
            if (updated) {
                order.setTotalDiscountedPrice(FinanceCalculator.round(order.getBaseSubtotal() + order.getGstAmount() + order.getDeliveryCharge()));
            }
        });

        double totalSales = deliveredOrders.stream().mapToDouble(Order::getTotalDiscountedPrice).sum();
        double totalGst = deliveredOrders.stream().mapToDouble(Order::getGstAmount).sum();
        double totalSub = deliveredOrders.stream().mapToDouble(Order::getBaseSubtotal).sum();
        
        context.setVariable("totalSales", FinanceCalculator.round(totalSales));
        context.setVariable("totalGst", FinanceCalculator.round(totalGst));
        context.setVariable("totalSub", FinanceCalculator.round(totalSub));
        
        try {
            java.io.File logoFile = new java.io.File("D:\\MCA SEM-4\\Sem 4 Project\\My Work\\Ecommerce-Ayurkisan-Website\\frontend\\src\\assets\\Company Logos (1024 × 1024 px).png");
            if(logoFile.exists()) {
                byte[] logoBytes = java.nio.file.Files.readAllBytes(logoFile.toPath());
                String base64Logo = java.util.Base64.getEncoder().encodeToString(logoBytes);
                context.setVariable("logoBase64", base64Logo);
            }
        } catch(Exception e) {
            System.err.println("Failed to bind logo: " + e.getMessage());
        }

        String html = templateEngine.process("bulk-invoice-template", context);

        ByteArrayOutputStream target = new ByteArrayOutputStream();
        ConverterProperties converterProperties = new ConverterProperties();
        
        HtmlConverter.convertToPdf(html, target, converterProperties);

        return target.toByteArray();
    }

    private String convertToIndianCurrency(double num) {
        long amount = (long) num;
        long paisa = Math.round((num - amount) * 100);
        if (amount == 0) return "Zero Rupees only";
        String words = convertNumberToWords(amount) + " Rupees";
        if (paisa > 0) {
            words += " and " + convertNumberToWords(paisa) + " Paisa";
        }
        return words + " only";
    }

    private static final String[] units = { "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
    private static final String[] tens = { "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

    private String convertNumberToWords(long i) {
        if (i < 20) return units[(int) i];
        if (i < 100) return tens[(int) i / 10] + ((i % 10 != 0) ? " " + units[(int) i % 10] : "");
        if (i < 1000) return units[(int) i / 100] + " Hundred" + ((i % 100 != 0) ? " and " + convertNumberToWords(i % 100) : "");
        if (i < 100000) return convertNumberToWords(i / 1000) + " Thousand" + ((i % 1000 != 0) ? " " + convertNumberToWords(i % 1000) : "");
        if (i < 10000000) return convertNumberToWords(i / 100000) + " Lakh" + ((i % 100000 != 0) ? " " + convertNumberToWords(i % 100000) : "");
        return convertNumberToWords(i / 10000000) + " Crore" + ((i % 10000000 != 0) ? " " + convertNumberToWords(i % 10000000) : "");
    }
}
