ALTER TABLE scenario_files ADD COLUMN file_role VARCHAR(20) NOT NULL DEFAULT 'CHANGED';

CREATE TABLE scenario_pr_descriptions (
    scenario_id UUID PRIMARY KEY REFERENCES scenarios(id),
    problem TEXT NOT NULL,
    solution TEXT NOT NULL,
    testing TEXT NOT NULL
);

CREATE TABLE scenario_hints (
    id UUID PRIMARY KEY,
    scenario_id UUID NOT NULL REFERENCES scenarios(id),
    hint_order INTEGER NOT NULL CHECK (hint_order > 0),
    title VARCHAR(160) NOT NULL,
    content TEXT NOT NULL,
    UNIQUE (scenario_id, hint_order)
);

INSERT INTO scenario_pr_descriptions (scenario_id, problem, solution, testing) VALUES
('10000000-0000-0000-0000-000000000001',
 $$Customers can reopen an order receipt from their account. The endpoint must preserve the ownership boundary for customer-facing order reads.$$, 
 $$Add an order-details service method and return an order summary through the existing customer request path. The lookup must include the authenticated customer.$$, 
 $$Add a focused service test for a valid customer-owned order and a negative test proving another customer cannot read it.$$),
('10000000-0000-0000-0000-000000000002',
 $$Support coordinators need to request replacement equipment after field damage. Invalid quantities must not reach inventory or create an order.$$, 
 $$Add a replacement-order service method that reserves stock and creates an order after validating request input.$$, 
 $$Cover a valid replacement request and prove that zero or negative quantities fail before either dependency is called.$$);

INSERT INTO scenario_hints (id, scenario_id, hint_order, title, content) VALUES
('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 1, 'Start with the request path', $$Read the ticket, then identify which changed code handles a customer-facing read. Ask what information must travel with that request.$$),
('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 2, 'Check the supporting code', $$Open the repository and request-context files. They show the intended ownership boundary without naming the finding for you.$$),
('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 3, 'Ask one precise question', $$Can a customer-specific request safely query an order by order ID alone? What should the test prove about a different customer?$$),
('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 1, 'Follow the side effects', $$Read the ticket, then find where the proposed method first changes another system. Consider what input must be true before that happens.$$),
('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 2, 'Check the boundary', $$Open the inventory gateway and the test file. They show which work must never happen for an invalid replacement request.$$),
('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 3, 'Ask one precise question', $$What happens when quantity is zero? Does the current test prove that inventory and order creation are untouched in that case?$$);

INSERT INTO scenario_files (id, scenario_id, path, original_content, proposed_content, file_role) VALUES
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'src/main/java/com/sidekicksupply/orders/OrderController.java', $$package com.sidekicksupply.orders;

class OrderController {
    private final OrderService orderService;
    private final CurrentCustomer currentCustomer;

    OrderSummary getOrderDetails(UUID orderId) {
        return orderService.getOrderDetails(currentCustomer.id(), orderId);
    }
}$$, $$package com.sidekicksupply.orders;

class OrderController {
    private final OrderService orderService;
    private final CurrentCustomer currentCustomer;

    OrderSummary getOrderDetails(UUID orderId) {
        return orderService.getOrderDetails(currentCustomer.id(), orderId);
    }
}$$, 'CONTEXT'),
('30000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'src/main/java/com/sidekicksupply/orders/OrderRepository.java', $$package com.sidekicksupply.orders;

interface OrderRepository {
    Optional<Order> findById(UUID orderId);
    Optional<Order> findByIdAndCustomerId(UUID orderId, UUID customerId);
}$$, $$package com.sidekicksupply.orders;

interface OrderRepository {
    Optional<Order> findById(UUID orderId);
    Optional<Order> findByIdAndCustomerId(UUID orderId, UUID customerId);
}$$, 'CONTEXT'),
('30000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'src/main/java/com/sidekicksupply/security/CurrentCustomer.java', $$package com.sidekicksupply.security;

interface CurrentCustomer {
    UUID id();
}$$, $$package com.sidekicksupply.security;

interface CurrentCustomer {
    UUID id();
}$$, 'CONTEXT'),
('30000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000002', 'src/main/java/com/sidekicksupply/orders/InventoryGateway.java', $$package com.sidekicksupply.orders;

interface InventoryGateway {
    void reserve(String equipmentSku, int quantity);
}$$, $$package com.sidekicksupply.orders;

interface InventoryGateway {
    void reserve(String equipmentSku, int quantity);
}$$, 'CONTEXT'),
('30000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000002', 'src/main/java/com/sidekicksupply/orders/ReplacementOrderRepository.java', $$package com.sidekicksupply.orders;

interface ReplacementOrderRepository {
    void create(UUID heroId, String equipmentSku, int quantity);
}$$, $$package com.sidekicksupply.orders;

interface ReplacementOrderRepository {
    void create(UUID heroId, String equipmentSku, int quantity);
}$$, 'CONTEXT'),
('30000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000002', 'src/main/java/com/sidekicksupply/orders/ReplacementRequest.java', $$package com.sidekicksupply.orders;

record ReplacementRequest(UUID heroId, String equipmentSku, int quantity) {
}$$, $$package com.sidekicksupply.orders;

record ReplacementRequest(UUID heroId, String equipmentSku, int quantity) {
}$$, 'CONTEXT');
