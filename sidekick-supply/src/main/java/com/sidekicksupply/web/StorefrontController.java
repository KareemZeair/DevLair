package com.sidekicksupply.web;

import com.sidekicksupply.cart.ShoppingCart;
import com.sidekicksupply.cart.ShoppingCartRepository;
import com.sidekicksupply.catalog.Product;
import com.sidekicksupply.catalog.ProductRepository;
import com.sidekicksupply.checkout.CheckoutService;
import com.sidekicksupply.orders.OrderLine;
import com.sidekicksupply.orders.PurchaseOrder;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StorefrontController {
    private final ProductRepository products;
    private final ShoppingCartRepository carts;
    private final CheckoutService checkoutService;
    public StorefrontController(ProductRepository products, ShoppingCartRepository carts, CheckoutService checkoutService) {
        this.products = products; this.carts = carts; this.checkoutService = checkoutService;
    }
    @GetMapping("/products") List<ProductResponse> products() { return products.findByActiveTrueOrderByNameAsc().stream().map(ProductResponse::from).toList(); }
    @GetMapping("/carts/{customerId}") CartResponse cart(@PathVariable String customerId) {
        return carts.findByCustomerId(customerId).map(CartResponse::from).orElse(new CartResponse(customerId, List.of()));
    }
    @PostMapping("/carts/{customerId}/items") @ResponseStatus(HttpStatus.CREATED)
    CartResponse addToCart(@PathVariable String customerId, @Valid @RequestBody AddItemRequest request) {
        products.findBySkuAndActiveTrue(request.sku()).orElseThrow(() -> new IllegalArgumentException("That product is not available."));
        ShoppingCart cart = carts.findByCustomerId(customerId).orElseGet(() -> new ShoppingCart(customerId));
        cart.add(request.sku(), request.quantity());
        return CartResponse.from(carts.save(cart));
    }
    @PostMapping("/checkout") OrderResponse checkout(@Valid @RequestBody CheckoutRequest request) { return OrderResponse.from(checkoutService.checkout(request.customerId(), request.paymentReference())); }

    record AddItemRequest(@NotBlank String sku, @Min(1) int quantity) { }
    record CheckoutRequest(@NotBlank String customerId, @NotBlank String paymentReference) { }
    record ProductResponse(String sku, String name, BigDecimal unitPrice) { static ProductResponse from(Product product) { return new ProductResponse(product.getSku(), product.getName(), product.getUnitPrice()); } }
    record CartLineResponse(String sku, int quantity) { }
    record CartResponse(String customerId, List<CartLineResponse> items) { static CartResponse from(ShoppingCart cart) { return new CartResponse(cart.getCustomerId(), cart.getItems().stream().map(item -> new CartLineResponse(item.getSku(), item.getQuantity())).toList()); } }
    record OrderLineResponse(String sku, String productName, int quantity, BigDecimal unitPrice) { static OrderLineResponse from(OrderLine line) { return new OrderLineResponse(line.getSku(), line.getProductName(), line.getQuantity(), line.getUnitPrice()); } }
    record OrderResponse(Long id, String orderNumber, BigDecimal total, List<OrderLineResponse> lines) { static OrderResponse from(PurchaseOrder order) { return new OrderResponse(order.getId(), order.getOrderNumber(), order.getTotal(), order.getLines().stream().map(OrderLineResponse::from).toList()); } }
}
