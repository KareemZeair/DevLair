package com.sidekicksupply.checkout;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.sidekicksupply.cart.ShoppingCart;
import com.sidekicksupply.cart.ShoppingCartRepository;
import com.sidekicksupply.catalog.Product;
import com.sidekicksupply.catalog.ProductRepository;
import com.sidekicksupply.inventory.InventoryItem;
import com.sidekicksupply.inventory.InventoryItemRepository;
import com.sidekicksupply.orders.PurchaseOrder;
import com.sidekicksupply.orders.PurchaseOrderRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class CheckoutServiceTest {
    @Autowired private CheckoutService checkoutService;
    @Autowired private ProductRepository products;
    @Autowired private InventoryItemRepository inventory;
    @Autowired private ShoppingCartRepository carts;
    @Autowired private PurchaseOrderRepository orders;

    @BeforeEach
    void setUp() {
        orders.deleteAll(); carts.deleteAll(); inventory.deleteAll(); products.deleteAll();
        products.save(new Product("GRPL-01", "Grapple Line Mk I", new BigDecimal("89.00")));
        inventory.save(new InventoryItem("GRPL-01", 2));
        ShoppingCart cart = new ShoppingCart("hero-42");
        cart.add("GRPL-01", 2);
        carts.save(cart);
    }

    @Test
    void checkoutCreatesAnOrderReservesInventoryAndClearsTheCart() {
        PurchaseOrder order = checkoutService.checkout("hero-42", "test-card");
        assertThat(order.getOrderNumber()).startsWith("SS-");
        assertThat(order.getTotal()).isEqualByComparingTo("178.00");
        assertThat(orders.count()).isEqualTo(1);
        assertThat(inventory.findById("GRPL-01").orElseThrow().getAvailableQuantity()).isZero();
        assertThat(inventory.findById("GRPL-01").orElseThrow().getReservedQuantity()).isEqualTo(2);
        assertThat(carts.findByCustomerId("hero-42").orElseThrow().getItems()).isEmpty();
    }

    @Test
    void declinedPaymentRollsBackInventoryAndOrderCreation() {
        assertThatThrownBy(() -> checkoutService.checkout("hero-42", "declined")).isInstanceOf(PaymentDeclinedException.class);
        assertThat(orders.count()).isZero();
        assertThat(inventory.findById("GRPL-01").orElseThrow().getAvailableQuantity()).isEqualTo(2);
        assertThat(carts.findByCustomerId("hero-42").orElseThrow().getItems()).hasSize(1);
    }
}
