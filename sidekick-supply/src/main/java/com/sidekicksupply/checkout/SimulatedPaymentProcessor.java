package com.sidekicksupply.checkout;

import org.springframework.stereotype.Component;

@Component
class SimulatedPaymentProcessor {
    void charge(String paymentReference) {
        if ("declined".equalsIgnoreCase(paymentReference)) throw new PaymentDeclinedException();
    }
}
