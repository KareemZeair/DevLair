INSERT INTO product (sku, name, unit_price, active) VALUES
('GRPL-01', 'Grapple Line Mk I', 89.00, TRUE),
('SKY-03', 'Skyline Safety Harness', 145.00, TRUE),
('COMMS-02', 'Comms Beacon', 39.00, TRUE);
INSERT INTO inventory_item (sku, available_quantity, reserved_quantity) VALUES
('GRPL-01', 12, 0), ('SKY-03', 8, 0), ('COMMS-02', 30, 0);
