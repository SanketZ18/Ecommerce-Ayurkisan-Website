package com.ayurkisan.Modules.Orders;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendOrderConfirmation(String toEmail, Order order) {
        if (toEmail == null || toEmail.isEmpty()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Order Confirmation - Ayurkisan");
            
            StringBuilder body = new StringBuilder();
            body.append("Dear ").append(order.getUserName()).append(",\n\n");
            body.append("Thank you for your order! Your order has been placed successfully.\n\n");
            body.append("Order ID: ").append(order.getId()).append("\n");
            body.append("Payment Method: ").append(order.getPaymentMethod()).append("\n");
            body.append("Total Amount: ₹").append(order.getTotalDiscountedPrice()).append("\n\n");
            
            body.append("Items Ordered:\n");
            for (OrderItem item : order.getItems()) {
                body.append("- ").append(item.getProductName())
                    .append(" (Qty: ").append(item.getQuantity()).append(")")
                    .append(" - ₹").append(item.getTotalItemPrice()).append("\n");
            }

            body.append("\nShipping Address:\n").append(order.getShippingAddress()).append("\n\n");
            body.append("We will notify you once your order is shipped.\n\n");
            body.append("Best Regards,\nAyurkisan Team");

            message.setText(body.toString());
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
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Order Delivered - Ayurkisan");
            
            String body = "Dear " + order.getUserName() + ",\n\n" +
                          "Your order (ID: " + order.getId() + ") has been successfully delivered.\n" +
                          "If you have any issues with your products, you have up to 5 days to initiate a return request.\n\n" +
                          "Thank you for shopping with us!\n\n" +
                          "Best Regards,\nAyurkisan Team";

            message.setText(body);
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
            message.setTo(toEmail);
            message.setSubject("Re: " + subject);
            message.setText(replyBody + "\n\nBest Regards,\nAyurkisan Team");
            mailSender.send(message);
        } catch (Exception e) {}
    }
}
