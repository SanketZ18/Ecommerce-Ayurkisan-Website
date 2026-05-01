package com.ayurkisan.Modules.Orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.beans.factory.annotation.Value;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private InvoiceService invoiceService;

    @jakarta.annotation.PostConstruct
    public void init() {
        if (mailSender instanceof org.springframework.mail.javamail.JavaMailSenderImpl) {
            org.springframework.mail.javamail.JavaMailSenderImpl impl = (org.springframework.mail.javamail.JavaMailSenderImpl) mailSender;
            if (impl.getUsername() != null) impl.setUsername(impl.getUsername().replace(" ", ""));
            if (impl.getPassword() != null) impl.setPassword(impl.getPassword().replace(" ", ""));
        }
    }

    @Async
    public void sendOrderConfirmation(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) {
            System.err.println(">>> [EmailService] Aborted: recipient email is null or empty");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, "Ayurkisan");
            helper.setTo(toEmail);
            helper.setSubject("Order Confirmation - Ayurkisan");
            
            StringBuilder html = new StringBuilder();
            html.append("<div style='font-family: Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; line-height: 1.6;'>");
            
            // Header - Clean & Simple
            html.append("<div style='padding: 20px; border-bottom: 2px solid #16a34a; margin-bottom: 20px;'>");
            html.append("<h1 style='margin: 0; color: #16a34a; font-size: 28px;'>Order Confirmation</h1>");
            html.append("<p style='margin: 5px 0 0 0; color: #666;'>Thank you for your order with Ayurkisan</p>");
            html.append("</div>");
            
            // Body Content
            html.append("<div style='padding: 0 20px;'>");
            html.append("<p style='font-size: 16px;'>Hello <strong>").append(order.getUserName()).append("</strong>,</p>");
            html.append("<p>We've received your order and it's being processed. Here are your order details:</p>");
            
            // Order Info Box
            html.append("<div style='background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;'>");
            html.append("<p style='margin: 0; font-size: 14px;'><strong>Order ID:</strong> #").append(order.getId()).append("</p>");
            html.append("<p style='margin: 5px 0 0 0; font-size: 14px;'><strong>Date:</strong> ").append(new SimpleDateFormat("dd MMM yyyy, HH:mm").format(new Date())).append("</p>");
            html.append("</div>");

            // Products Table
            html.append("<h3 style='font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 30px;'>Order Summary</h3>");
            html.append("<table style='width: 100%; border-collapse: collapse; margin-top: 10px;'>");
            html.append("<thead>");
            html.append("<tr style='border-bottom: 2px solid #eee;'>");
            html.append("<th style='text-align: left; padding: 10px 5px; font-size: 14px;'>Item</th>");
            html.append("<th style='text-align: center; padding: 10px 5px; font-size: 14px;'>Qty</th>");
            html.append("<th style='text-align: right; padding: 10px 5px; font-size: 14px;'>Price</th>");
            html.append("<th style='text-align: right; padding: 10px 5px; font-size: 14px;'>Total</th>");
            html.append("</tr>");
            html.append("</thead>");
            html.append("<tbody>");

            for (OrderItem item : order.getItems()) {
                html.append("<tr style='border-bottom: 1px solid #eee;'>");
                html.append("<td style='padding: 12px 5px;'>");
                html.append("<div style='font-weight: bold;'>").append(item.getProductName()).append("</div>");
                if (item.getWeight() != null) {
                    html.append("<div style='font-size: 12px; color: #777;'>").append(item.getWeight()).append("</div>");
                }
                html.append("</td>");
                html.append("<td style='padding: 12px 5px; text-align: center;'>").append(item.getQuantity()).append("</td>");
                html.append("<td style='padding: 12px 5px; text-align: right;'>₹").append(formatPrice(item.getDiscountedPrice())).append("</td>");
                html.append("<td style='padding: 12px 5px; text-align: right; font-weight: bold;'>₹").append(formatPrice(item.getTotalItemPrice())).append("</td>");
                html.append("</tr>");
            }

            html.append("</tbody>");
            html.append("</table>");

            // Totals
            html.append("<div style='margin-top: 20px; border-top: 2px solid #eee; padding-top: 10px;'>");
            html.append("<table style='width: 100%;'>");
            html.append("<tr>");
            html.append("<td style='padding: 5px 0;'>Subtotal:</td>");
            html.append("<td style='padding: 5px 0; text-align: right;'>₹").append(formatPrice(order.getTotalDiscountedPrice() - order.getDeliveryCharge())).append("</td>");
            html.append("</tr>");
            if (order.getDeliveryCharge() > 0) {
                html.append("<tr>");
                html.append("<td style='padding: 5px 0;'>Delivery Charge:</td>");
                html.append("<td style='padding: 5px 0; text-align: right;'>₹").append(formatPrice(order.getDeliveryCharge())).append("</td>");
                html.append("</tr>");
            }
            html.append("<tr style='font-size: 20px; font-weight: bold; color: #16a34a;'>");
            html.append("<td style='padding: 10px 0;'>Grand Total:</td>");
            html.append("<td style='padding: 10px 0; text-align: right;'>₹").append(formatPrice(order.getTotalDiscountedPrice())).append("</td>");
            html.append("</tr>");
            html.append("</table>");
            html.append("</div>");

            // Shipping Address
            html.append("<div style='margin-top: 30px; padding: 15px; border: 1px solid #eee; border-radius: 8px;'>");
            html.append("<h4 style='margin: 0 0 10px 0; font-size: 14px; color: #555;'>SHIPPING ADDRESS</h4>");
            html.append("<p style='margin: 0; font-size: 14px; color: #1a1a1a;'>").append(order.getShippingAddress()).append("</p>");
            html.append("</div>");

            html.append("<p style='margin-top: 30px; font-size: 13px; color: #777;'>Note: You will receive the official tax invoice once the order is delivered.</p>");
            html.append("<p style='margin-top: 20px;'>Best Regards,<br><strong>Ayurkisan Team</strong></p>");
            html.append("</div>");
            
            // Footer
            html.append("<div style='background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; margin-top: 40px;'>");
            html.append("<p style='margin: 0;'>&copy; 2026 Ayurkisan India. All rights reserved.</p>");
            html.append("</div>");
            html.append("</div>");

            helper.setText(html.toString(), true);
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendOrderCancellation(String toEmail, Order order, String reason) {
        if (toEmail == null || toEmail.isEmpty()) {
            System.err.println(">>> [EmailService] Aborted: recipient email is null or empty");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Order Cancelled - Ayurkisan");
            
            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(order.getUserName()).append(",\n\n");
            body.append("Your order (ID: ").append(order.getId()).append(") has been cancelled by the Ayurkisan Team.\n");
            
            if (reason != null && !reason.isEmpty()) {
                body.append("\nReason for cancellation: ").append(reason).append("\n");
            }

            body.append("\nIf you have already paid online, the refund process will be initiated shortly.\n\n");
            body.append("Best Regards,\nAyurkisan Team");

            message.setText(body.toString());
            mailSender.send(message);

        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send cancellation email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendOrderDelivered(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) {
            System.err.println(">>> [EmailService] Aborted: recipient email is null or empty");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail, "Ayurkisan");
            helper.setTo(toEmail);
            helper.setSubject("Order Delivered and Tax Invoice - Ayurkisan");
               StringBuilder html = new StringBuilder();
            html.append("<div style='font-family: Helvetica, Arial, sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; line-height: 1.6;'>");
            
            // Header
            html.append("<div style='padding: 20px; border-bottom: 2px solid #16a34a; margin-bottom: 20px;'>");
            html.append("<h1 style='margin: 0; color: #16a34a; font-size: 28px;'>Order Delivered!</h1>");
            html.append("<p style='margin: 5px 0 0 0; color: #666;'>We hope you enjoy your purchase</p>");
            html.append("</div>");
            
            // Body Content
            html.append("<div style='padding: 0 20px;'>");
            html.append("<p style='font-size: 16px;'>Hello <strong>").append(order.getUserName()).append("</strong>,</p>");
            html.append("<p>Your order <strong>#").append(order.getId()).append("</strong> has been successfully delivered. Please find your official Tax Invoice attached as a PDF.</p>");
            
            html.append("<div style='margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 8px;'>");
            html.append("<p style='margin: 0;'>If you have any questions or feedback, feel free to contact us.</p>");
            html.append("</div>");

            html.append("<p style='margin-top: 30px;'>Thank you for choosing Ayurkisan!</p>");
            html.append("<p style='margin-top: 20px;'>Best Regards,<br><strong>Ayurkisan Team</strong></p>");
            html.append("</div>");
            
            // Footer
            html.append("<div style='background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #999; margin-top: 40px;'>");
            html.append("<p style='margin: 0;'>&copy; 2026 Ayurkisan India. All rights reserved.</p>");
            html.append("</div>");
            html.append("</div>");
            helper.setText(html.toString(), true);

            // Generate and attach PDF now that it's delivered
            try {
                byte[] pdfBytes = invoiceService.generateInvoice(order, order.getRole());
                helper.addAttachment("Invoice_" + order.getId() + ".pdf", new ByteArrayResource(pdfBytes));
            } catch (Exception e) {
                System.err.println("Failed to generate PDF for delivered order " + order.getId() + ": " + e.getMessage());
            }

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send delivery email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendReturnRequested(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Return Requested - Ayurkisan");
            message.setText("Dear " + order.getUserName() + ",\n\nWe have received your return request for Order ID: " + order.getId() + ".\nOur team is reviewing it and will update you shortly.\n\nBest Regards,\nAyurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send return requested email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendReturnAccepted(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Return Accepted - Ayurkisan");
            message.setText("Dear " + order.getUserName() + ",\n\nYour return request for Order ID: " + order.getId() + " has been accepted.\nOur delivery agent will contact you for pickup.\n\nBest Regards,\nAyurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send return accepted email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendReturnRejected(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Return Rejected - Ayurkisan");
            message.setText("Dear " + order.getUserName() + ",\n\nUnfortunately, your return request for Order ID: " + order.getId() + " has been rejected after review.\nIf you have questions, please contact our support team.\n\nBest Regards,\nAyurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send return rejected email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendReturnRefunded(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Return Refunded - Ayurkisan");
            message.setText("Dear " + order.getUserName() + ",\n\nYour return for Order ID: " + order.getId() + " is complete.\nA cash refund has been issued during the pickup process.\n\nThank you for choosing Ayurkisan.\n\nBest Regards,\nAyurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send return refunded email to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendContactReply(String toEmail, String subject, String replyBody) {
        if (toEmail == null || toEmail.isEmpty()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Re: " + subject);
            message.setText(replyBody + "\n\nBest Regards,\nAyurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send contact reply to: " + toEmail);
            e.printStackTrace();
        }
    }

    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        if (toEmail == null || toEmail.isEmpty()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset OTP - Ayurkisan");
            message.setText("Dear User,\n\n" +
                    "You requested a password reset for your Ayurkisan account. " +
                    "Your One-Time Password (OTP) is:\n\n" +
                    otp + "\n\n" +
                    "This OTP is valid for 5 minutes. If you did not request this, please ignore this email.\n\n" +
                    "Best Regards,\n" +
                    "Ayurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println(">>> [EmailService] Failed to send OTP email to: " + toEmail);
            e.printStackTrace();
        }
    }

    private String formatPrice(double price) {
        try {
            return new java.math.BigDecimal(String.valueOf(price))
                    .setScale(1, java.math.RoundingMode.FLOOR)
                    .toPlainString();
        } catch (Exception e) {
            return String.format("%.1f", price);
        }
    }
}
