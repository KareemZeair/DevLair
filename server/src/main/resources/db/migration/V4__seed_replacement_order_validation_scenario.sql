INSERT INTO scenarios (id, slug, title, summary)
VALUES ('10000000-0000-0000-0000-000000000002', 'replacement-order-validation', 'PR #211: Reject invalid replacement quantities', 'Review a replacement-order request before it can reserve impossible amounts of equipment.');

INSERT INTO scenario_documents (id, scenario_id, document_type, title, content) VALUES
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'TICKET', 'SID-211: Replacement gear requests', $$Support coordinators need to request replacement gear for B-tier heroes after field damage. Add a small service method that reserves inventory and creates the replacement order. Requests must reject a quantity of zero or less before anything reaches inventory.$$),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'ARCHITECTURE', 'Replacement order boundary', $$The service is the boundary between request data and inventory. A replacement quantity must be positive before the service reserves stock or creates an order. Tests must prove that invalid requests stop before either dependency is called.$$);

INSERT INTO scenario_files (id, scenario_id, path, original_content, proposed_content) VALUES
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'src/main/java/com/sidekicksupply/orders/ReplacementOrderService.java',
$$package com.sidekicksupply.orders;

import java.util.UUID;

public class ReplacementOrderService {
    private final InventoryGateway inventoryGateway;
    private final ReplacementOrderRepository orderRepository;

    public ReplacementOrderService(InventoryGateway inventoryGateway, ReplacementOrderRepository orderRepository) {
        this.inventoryGateway = inventoryGateway;
        this.orderRepository = orderRepository;
    }
}$$,
$$package com.sidekicksupply.orders;

import java.util.UUID;

public class ReplacementOrderService {
    private final InventoryGateway inventoryGateway;
    private final ReplacementOrderRepository orderRepository;

    public ReplacementOrderService(InventoryGateway inventoryGateway, ReplacementOrderRepository orderRepository) {
        this.inventoryGateway = inventoryGateway;
        this.orderRepository = orderRepository;
    }

    public void requestReplacement(UUID heroId, String equipmentSku, int quantity) {
        inventoryGateway.reserve(equipmentSku, quantity);
        orderRepository.create(heroId, equipmentSku, quantity);
    }
}$$),
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'src/test/java/com/sidekicksupply/orders/ReplacementOrderServiceTest.java',
$$package com.sidekicksupply.orders;

class ReplacementOrderServiceTest {
}$$,
$$package com.sidekicksupply.orders;

import static org.mockito.Mockito.verify;

import java.util.UUID;
import org.junit.jupiter.api.Test;

class ReplacementOrderServiceTest {
    @Test
    void reservesRequestedReplacementGear() {
        InventoryGateway inventoryGateway = mock(InventoryGateway.class);
        ReplacementOrderRepository orderRepository = mock(ReplacementOrderRepository.class);
        ReplacementOrderService service = new ReplacementOrderService(inventoryGateway, orderRepository);

        service.requestReplacement(UUID.randomUUID(), "GRAPPLE-LINE", 1);

        verify(inventoryGateway).reserve("GRAPPLE-LINE", 1);
    }
}$$);

INSERT INTO review_findings (id, scenario_id, file_path, start_line, end_line, severity, title, explanation, recommended_code) VALUES
('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'src/main/java/com/sidekicksupply/orders/ReplacementOrderService.java', 14, 16, 'HIGH', 'Replacement quantity is never validated', 'A quantity of zero or less reaches inventory and can create an impossible replacement order. Reject invalid input before either dependency is called.', $$public void requestReplacement(UUID heroId, String equipmentSku, int quantity) {
    if (quantity <= 0) {
        throw new InvalidReplacementQuantityException(quantity);
    }

    inventoryGateway.reserve(equipmentSku, quantity);
    orderRepository.create(heroId, equipmentSku, quantity);
}$$),
('40000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'src/test/java/com/sidekicksupply/orders/ReplacementOrderServiceTest.java', 9, 18, 'MEDIUM', 'The test does not prove invalid quantities are rejected', 'The happy-path test proves a valid request reserves inventory, but it never proves that zero or negative quantities stop before side effects occur.', $$@Test
void rejectsNonPositiveQuantityBeforeReservingInventory() {
    assertThatThrownBy(() -> service.requestReplacement(UUID.randomUUID(), "GRAPPLE-LINE", 0))
            .isInstanceOf(InvalidReplacementQuantityException.class);

    verifyNoInteractions(inventoryGateway, orderRepository);
}$$);
