package com.ayurkisan.Modules.Orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.ByteArrayResource;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    private InvoiceService invoiceService;

    @Async
    public void sendOrderConfirmation(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart message
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Order Confirmation - Ayurkisan");
            
            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(order.getUserName()).append(",\n\n");
            body.append("Thank you for your order! Your order has been placed successfully.\n\n");
            body.append("Order ID: ").append(order.getId()).append("\n");
            body.append("Total Amount: ₹").append(order.getTotalDiscountedPrice()).append("\n\n");
            
            body.append("Shipping Address:\n").append(order.getShippingAddress()).append("\n\n");
            body.append("We have received your order and are processing it.\n");
            body.append("You will receive your official Tax Invoice once the order is delivered.\n\n");
            body.append("Best Regards,\nAyurkisan Team");

            helper.setText(body.toString());
            mailSender.send(message);

        } catch (Exception e) {
            // Log error but don't stop the order placement flow
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendOrderCancellation(String toEmail, Order order, String reason) {
        if (toEmail == null || toEmail.isEmpty()) {
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
            System.err.println("Failed to send cancellation email to " + toEmail + ": " + e.getMessage());
        }
    }

    @Async
    public void sendOrderDelivered(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) {
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Order Delivered and Tax Invoice - Ayurkisan");
            
            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(order.getUserName()).append(",\n\n");
            body.append("Great news! Your order (ID: ").append(order.getId()).append(") has been successfully delivered.\n\n");
            body.append("Thank you for shopping with us! Please find your official Tax Invoice attached to this email.\n\n");
            body.append("If you have any issues with your products, you have up to 5 days to initiate a return request through your dashboard.\n\n");
            body.append("Best Regards,\nAyurkisan Team");

            helper.setText(body.toString());

            // Generate and attach PDF now that it's delivered
            try {
                byte[] pdfBytes = invoiceService.generateInvoice(order, order.getRole());
                helper.addAttachment("Invoice_" + order.getId() + ".pdf", new ByteArrayResource(pdfBytes));
            } catch (Exception e) {
                System.err.println("Failed to generate PDF for delivered order " + order.getId() + ": " + e.getMessage());
            }

            mailSender.send(message);

        } catch (Exception e) {
            System.err.println("Failed to send delivery email to " + toEmail + ": " + e.getMessage());
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
        } catch (Exception e) {}
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
        } catch (Exception e) {}
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
        } catch (Exception e) {}
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
        } catch (Exception e) {}
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
        } catch (Exception e) {}
    }
}
