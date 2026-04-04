package com.ayurkisan.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Centralized utility for GST and Order Finance calculations.
 * Ensures consistent rounding and formula application across the system.
 */
public class FinanceCalculator {

    public static final double GST_RATE = 0.18; // 18% GST Standard for Herbal Products
    public static final double FLAT_DELIVERY_CHARGE = 50.0;

    /**
     * Rounds a double to 2 decimal places using HALF_UP rounding.
     */
    public static double round(double value) {
        return new BigDecimal(Double.toString(value))
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    /**
     * Calculates GST amount for a given taxable value.
     */
    public static double calculateGst(double taxableValue) {
        return round(taxableValue * GST_RATE);
    }

    /**
     * Container for comprehensive order calculations.
     */
    public static class FinanceSummary {
        public double baseSubtotal;      // Sum of (qty * discounted price)
        public double promoDiscount;     // Order-level promo code discount
        public double taxableValue;      // baseSubtotal - promoDiscount
        public double gstAmount;         // 18% of taxableValue
        public double cgst;              // 9%
        public double sgst;              // 9%
        public double deliveryCharge;    // Flat 50
        public double totalPayable;      // taxableValue + gstAmount + deliveryCharge

        @Override
        public String toString() {
            return String.format("Summary: Base=%.2f, Promo=%.2f, Taxable=%.2f, GST=%.2f (9+9), Delivery=%.2f, TOTAL=%.2f",
                    baseSubtotal, promoDiscount, taxableValue, gstAmount, deliveryCharge, totalPayable);
        }
    }

    /**
     * Performs full order finance simulation.
     * Discount is applied BEFORE tax to comply with standard industry practice.
     */
    public static FinanceSummary calculateFullOrder(double baseSubtotal, double promoDiscount, double requestedDelivery) {
        FinanceSummary summary = new FinanceSummary();
        
        summary.baseSubtotal = round(baseSubtotal);
        summary.promoDiscount = round(promoDiscount);
        
        // Taxable value is the net amount after all discounts
        summary.taxableValue = round(Math.max(0, summary.baseSubtotal - summary.promoDiscount));
        
        summary.gstAmount = calculateGst(summary.taxableValue);
        summary.cgst = round(summary.gstAmount / 2.0);
        summary.sgst = round(summary.gstAmount / 2.0);
        
        summary.deliveryCharge = round(requestedDelivery);
        
        summary.totalPayable = round(summary.taxableValue + summary.gstAmount + summary.deliveryCharge);
        
        return summary;
    }
}
