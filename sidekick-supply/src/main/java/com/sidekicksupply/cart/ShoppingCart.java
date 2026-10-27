package com.sidekicksupply.cart;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
public class ShoppingCart {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String customerId;
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();
    protected ShoppingCart() { }
    public ShoppingCart(String customerId) { this.customerId = customerId; }
    public void add(String sku, int quantity) {
        items.stream().filter(item -> item.getSku().equals(sku)).findFirst()
                .ifPresentOrElse(item -> item.increaseBy(quantity), () -> items.add(new CartItem(this, sku, quantity)));
    }
    public void clear() { items.clear(); }
    public String getCustomerId() { return customerId; }
    public List<CartItem> getItems() { return List.copyOf(items); }
}
