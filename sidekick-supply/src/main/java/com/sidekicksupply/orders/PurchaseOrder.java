package com.sidekicksupply.orders;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
public class PurchaseOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, unique = true) private String orderNumber;
    @Column(nullable = false) private String customerId;
    @Column(nullable = false) private Instant createdAt;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal total;
    @Column(nullable = false) private String paymentReference;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true) private List<OrderLine> lines = new ArrayList<>();
    protected PurchaseOrder() { }
    public PurchaseOrder(String orderNumber, String customerId, String paymentReference) {
        this.orderNumber = orderNumber; this.customerId = customerId; this.paymentReference = paymentReference;
        this.createdAt = Instant.now(); this.total = BigDecimal.ZERO;
    }
    public void addLine(String sku, String productName, int quantity, BigDecimal unitPrice) {
        lines.add(new OrderLine(this, sku, productName, quantity, unitPrice));
        total = total.add(unitPrice.multiply(BigDecimal.valueOf(quantity)));
    }
    public Long getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public BigDecimal getTotal() { return total; }
    public List<OrderLine> getLines() { return List.copyOf(lines); }
}
