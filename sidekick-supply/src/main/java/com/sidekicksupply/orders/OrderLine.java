package com.sidekicksupply.orders;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import java.math.BigDecimal;

@Entity
public class OrderLine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private PurchaseOrder order;
    private String sku; private String productName; private int quantity; private BigDecimal unitPrice;
    protected OrderLine() { }
    OrderLine(PurchaseOrder order, String sku, String productName, int quantity, BigDecimal unitPrice) {
        this.order = order; this.sku = sku; this.productName = productName; this.quantity = quantity; this.unitPrice = unitPrice;
    }
    public String getSku() { return sku; } public String getProductName() { return productName; }
    public int getQuantity() { return quantity; } public BigDecimal getUnitPrice() { return unitPrice; }
}
