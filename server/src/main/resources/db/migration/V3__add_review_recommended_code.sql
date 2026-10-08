ALTER TABLE review_findings ADD COLUMN recommended_code TEXT;

UPDATE review_findings
SET recommended_code = $$public OrderSummary getOrderDetails(UUID customerId, UUID orderId) {
    return orderRepository.findByIdAndCustomerId(orderId, customerId)
            .map(OrderSummary::from)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
}$$
WHERE id = '40000000-0000-0000-0000-000000000001';

UPDATE review_findings
SET recommended_code = $$@Test
void rejectsOrderOwnedByAnotherCustomer() {
    UUID requestingCustomerId = UUID.randomUUID();
    when(repository.findByIdAndCustomerId(orderId, requestingCustomerId))
            .thenReturn(Optional.empty());

    assertThatThrownBy(() -> service.getOrderDetails(requestingCustomerId, orderId))
            .isInstanceOf(OrderNotFoundException.class);
}$$
WHERE id = '40000000-0000-0000-0000-000000000002';
