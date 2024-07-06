CREATE TABLE acts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    act_number TEXT NOT NULL,
    act_date TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    contract_id INTEGER NOT NULL,
    contractor_id INTEGER NOT NULL,
    invoice_id INTEGER NOT NULL,
    FOREIGN KEY (contract_id) REFERENCES contracts(contract_id),
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id),
    FOREIGN KEY (invoice_id) REFERENCES contracts(invoice_id)
);