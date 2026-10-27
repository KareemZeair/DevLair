package com.sidekicksupply.inventory;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class InventoryItem {
    @Id private String sku;
    @Column(nullable = false) private int availableQuantity;
    @Column(nullable = false) private int reservedQuantity;

    protected InventoryItem() { }
    public InventoryItem(String sku, int availableQuantity) { this.sku = sku; this.availableQuantity = availableQuantity; }
    public void reserve(int quantity) {
        if (quantity > availableQuantity) throw new InsufficientInventoryException(sku);
        availableQuantity -= quantity;
        reservedQuantity += quantity;
    }
    public int getAvailableQuantity() { return availableQuantity; }
    public int getReservedQuantity() { return reservedQuantity; }
}
