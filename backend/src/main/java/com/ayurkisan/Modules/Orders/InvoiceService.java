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
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;
import java.util.Base64;
import org.apache.commons.io.IOUtils;
import java.util.Arrays;



@Service
public class InvoiceService {

    @Autowired
    private SpringTemplateEngine templateEngine;

    public byte[] generateInvoice(Order order, String invoiceType) throws Exception {
        Context context = new Context();
        context.setVariable("order", order);
        context.setVariable("invoiceType", invoiceType != null ? invoiceType : order.getRole());

        // Fallback calculations for older orders or missing data
        if (order.getBaseSubtotal() <= 0) {
            double calcSub = order.getItems().stream()
                .mapToDouble(item -> item.getDiscountedPrice() * item.getQuantity())
                .sum();
            order.setBaseSubtotal(FinanceCalculator.round(calcSub));
        }
        
        if (order.getGstAmount() <= 0) {
            // Default 18% GST if the stored value is missing
            order.setGstAmount(FinanceCalculator.round(order.getBaseSubtotal() * 0.18));
        }

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
            ClassPathResource imgFile = new ClassPathResource("static/images/logo.png");
            if (imgFile.exists()) {
                try (InputStream is = imgFile.getInputStream()) {
                    byte[] bytes = IOUtils.toByteArray(is);
                    String base64Logo = Base64.getEncoder().encodeToString(bytes);
                    context.setVariable("logoBase64", base64Logo);
                }
            }
        } catch(Exception e) {
            System.err.println("Failed to bind logo from classpath: " + e.getMessage());
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

        List<String> validStatuses = Arrays.asList("CONFIRMED", "SHIPPED", "DELIVERED");
        List<Order> filteredOrders = orders.stream()
            .filter(o -> validStatuses.contains(o.getOrderStatus().toUpperCase()))
            .collect(java.util.stream.Collectors.toList());
            
        if (filteredOrders.isEmpty()) {
            return new byte[0];
        }

        Context context = new Context();
        context.setVariable("orders", filteredOrders);

        context.setVariable("invoiceType", invoiceType != null ? invoiceType : "ALL");
        context.setVariable("exportDate", java.time.LocalDateTime.now());
        context.setVariable("startDate", start);
        context.setVariable("endDate", end);
        
        // Ensure subtotal and GST are accurately calculated for the report
        filteredOrders.forEach(order -> {

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

        double totalSales = filteredOrders.stream().mapToDouble(Order::getTotalDiscountedPrice).sum();
        double totalGst = filteredOrders.stream().mapToDouble(Order::getGstAmount).sum();
        double totalSub = filteredOrders.stream().mapToDouble(Order::getBaseSubtotal).sum();

        
        context.setVariable("totalSales", FinanceCalculator.round(totalSales));
        context.setVariable("totalGst", FinanceCalculator.round(totalGst));
        context.setVariable("totalSub", FinanceCalculator.round(totalSub));
        
        try {
            ClassPathResource imgFile = new ClassPathResource("static/images/logo.png");
            if (imgFile.exists()) {
                try (InputStream is = imgFile.getInputStream()) {
                    byte[] bytes = IOUtils.toByteArray(is);
                    String base64Logo = Base64.getEncoder().encodeToString(bytes);
                    context.setVariable("logoBase64", base64Logo);
                }
            }
        } catch(Exception e) {
            System.err.println("Failed to bind logo from classpath (bulk): " + e.getMessage());
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
