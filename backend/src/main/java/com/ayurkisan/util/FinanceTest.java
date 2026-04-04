package com.ayurkisan.util;

public class FinanceTest {
    public static void main(String[] args) {
        run(7210.0, 0.0);
        run(1000.0, 100.0);
    }

    private static void run(double sub, double promo) {
        FinanceCalculator.FinanceSummary s = FinanceCalculator.calculateFullOrder(sub, promo, 50.0);
        System.out.println("Sub:" + sub + " Pro:" + promo + " Taxable:" + s.taxableValue + " GST:" + s.gstAmount + " Total:" + s.totalPayable);
    }
}
