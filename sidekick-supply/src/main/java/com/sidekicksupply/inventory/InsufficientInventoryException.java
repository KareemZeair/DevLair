package com.sidekicksupply.inventory;

public class InsufficientInventoryException extends RuntimeException {
    public InsufficientInventoryException(String sku) { super("Not enough inventory is available for " + sku + "."); }
}
