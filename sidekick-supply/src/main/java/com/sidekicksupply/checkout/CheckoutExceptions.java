package com.sidekicksupply.checkout;

class CartNotFoundException extends RuntimeException { CartNotFoundException(String customerId) { super("No cart exists for customer " + customerId + "."); } }
class EmptyCartException extends RuntimeException { EmptyCartException() { super("A cart must contain at least one item before checkout."); } }
class ProductNotFoundException extends RuntimeException { ProductNotFoundException(String sku) { super("Unknown or inactive product " + sku + "."); } }
