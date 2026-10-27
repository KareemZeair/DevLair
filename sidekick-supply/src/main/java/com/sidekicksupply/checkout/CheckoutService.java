package com.sidekicksupply.checkout;

import com.sidekicksupply.cart.CartItem;
import com.sidekicksupply.cart.ShoppingCart;
import com.sidekicksupply.cart.ShoppingCartRepository;
import com.sidekicksupply.catalog.Product;
import com.sidekicksupply.catalog.ProductRepository;
import com.sidekicksupply.inventory.InventoryItem;
import com.sidekicksupply.inventory.InventoryItemRepository;
import com.sidekicksupply.orders.PurchaseOrder;
import com.sidekicksupply.orders.PurchaseOrderRepository;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CheckoutService {
    private final ShoppingCartRepository cartRepository;
    private final ProductRepository productRepository;
    private final InventoryItemRepository inventoryRepository;
    private final PurchaseOrderRepository orderRepository;
    private final SimulatedPaymentProcessor paymentProcessor;

    public CheckoutService(ShoppingCartRepository cartRepository, ProductRepository productRepository,
            InventoryItemRepository inventoryRepository, PurchaseOrderRepository orderRepository,
            SimulatedPaymentProcessor paymentProcessor) {
        this.cartRepository = cartRepository; this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository; this.orderRepository = orderRepository;
        this.paymentProcessor = paymentProcessor;
    }

    @Transactional
    public PurchaseOrder checkout(String customerId, String paymentReference) {
        ShoppingCart cart = cartRepository.findByCustomerId(customerId).orElseThrow(() -> new CartNotFoundException(customerId));
        if (cart.getItems().isEmpty()) throw new EmptyCartException();
        PurchaseOrder order = new PurchaseOrder("SS-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(), customerId, paymentReference);
        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findBySkuAndActiveTrue(item.getSku()).orElseThrow(() -> new ProductNotFoundException(item.getSku()));
            InventoryItem inventory = inventoryRepository.findBySku(item.getSku()).orElseThrow(() -> new ProductNotFoundException(item.getSku()));
            inventory.reserve(item.getQuantity());
            order.addLine(product.getSku(), product.getName(), item.getQuantity(), product.getUnitPrice());
        }
        paymentProcessor.charge(paymentReference);
        PurchaseOrder saved = orderRepository.save(order);
        cart.clear();
        return saved;
    }
}
