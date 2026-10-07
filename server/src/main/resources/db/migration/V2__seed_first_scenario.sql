INSERT INTO scenarios (id, slug, title, summary)
VALUES ('10000000-0000-0000-0000-000000000001', 'order-details-access', 'PR #184: Add order details for customers', 'Review a customer order-details endpoint before it ships.');

INSERT INTO scenario_documents (id, scenario_id, document_type, title, content) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'TICKET', 'SID-184: Order receipt details', $$Customers want to reopen their Sidekick Supply Co. order receipt from order history. Add an endpoint that returns an order summary by order ID. Keep the change small; the mobile team needs it this sprint.$$),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'ARCHITECTURE', 'Order service boundary', $$The API authenticates a customer before reaching OrderService. Customer-owned order queries must always include the authenticated customer ID. Repository methods that query only by order ID are intended for internal fulfilment jobs, not customer-facing requests.$$);

INSERT INTO scenario_files (id, scenario_id, path, original_content, proposed_content) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'src/main/java/com/sidekicksupply/orders/OrderService.java',
$$package com.sidekicksupply.orders;

import java.util.UUID;

public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }
}$$,
$$package com.sidekicksupply.orders;

import java.util.UUID;

public class OrderService {
    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public OrderSummary getOrderDetails(UUID orderId) {
        return orderRepository.findById(orderId)
                .map(OrderSummary::from)
                .orElseThrow(() -> new OrderNotFoundException(orderId));
    }
}$$),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'src/test/java/com/sidekicksupply/orders/OrderServiceTest.java',
$$package com.sidekicksupply.orders;

class OrderServiceTest {
}$$,
$$package com.sidekicksupply.orders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.UUID;
import org.junit.jupiter.api.Test;

class OrderServiceTest {
    @Test
    void returnsOrderDetails() {
        UUID orderId = UUID.randomUUID();
        Order order = Order.forCustomer(UUID.randomUUID());
        OrderRepository repository = mock(OrderRepository.class);
        when(repository.findById(orderId)).thenReturn(Optional.of(order));

        OrderSummary result = new OrderService(repository).getOrderDetails(orderId);

        assertThat(result.id()).isEqualTo(orderId);
    }
}$$);

INSERT INTO review_findings (id, scenario_id, file_path, start_line, end_line, severity, title, explanation) VALUES
('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'src/main/java/com/sidekicksupply/orders/OrderService.java', 13, 15, 'HIGH', 'Order lookup is not scoped to the authenticated customer', 'The customer-facing lookup uses only orderId. An authenticated customer who learns another order ID can read that order. Pass the authenticated customer ID through the service and query by both order ID and customer ID.'),
('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'src/test/java/com/sidekicksupply/orders/OrderServiceTest.java', 10, 19, 'MEDIUM', 'The test does not prove customer ownership is enforced', 'The happy-path test creates an order for an arbitrary customer, but never supplies or verifies the authenticated customer. Add a test showing that a different customer cannot retrieve the order.');
