package com.sidekicksupply.checkout;

public class PaymentDeclinedException extends RuntimeException {
    public PaymentDeclinedException() { super("The payment provider declined this payment."); }
}
