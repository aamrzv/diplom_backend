CREATE TABLE contracts (
    contract_id INTEGER PRIMARY KEY,
    contract_number TEXT NOT NULL,
    signing_date  TEXT NOT NULL,
    contractor_id INTEGER NOT NULL,
    price_group_id INTEGER NOT NULL,
    is_active INTEGER NOT NULL,
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id),
    FOREIGN KEY (price_group_id) REFERENCES price_groups(price_group_id)
);