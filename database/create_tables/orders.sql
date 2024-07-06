CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY,
    order_date TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    order_change_date TEXT NULL,
    editor_id INTEGER NULL,
    employee_id INTEGER,
    contract_id INTEGER,
    client_id INTEGER,
    car_id INTEGER,
    order_amount NUMERIC NOT NULL,
    discount_id INTEGER,
    act_number INTEGER,
    comment TEXT,
    invoice_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id),
    FOREIGN KEY (contract_id) REFERENCES contracts(contract_id),
    FOREIGN KEY (car_id) REFERENCES cars(car_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id),
    CONSTRAINT orders_FK FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE SET NULL
);

CREATE TABLE orders_detail (
    id INTEGER PRIMARY KEY,
    order_id INTEGER,
    selector_id TEXT,
    price_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    CONSTRAINT orders_detail_FK FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (price_id) REFERENCES prices(price_id)
);
CREATE INDEX orders_order_id_IDX ON orders_detail (order_id)




