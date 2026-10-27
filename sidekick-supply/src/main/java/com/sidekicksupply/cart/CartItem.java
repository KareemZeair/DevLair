package com.sidekicksupply.cart;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional = false) private ShoppingCart cart;
    private String sku;
    private int quantity;
    protected CartItem() { }
    CartItem(ShoppingCart cart, String sku, int quantity) { this.cart = cart; this.sku = sku; this.quantity = quantity; }
    void increaseBy(int quantity) { this.quantity += quantity; }
    public String getSku() { return sku; }
    public int getQuantity() { return quantity; }
}
