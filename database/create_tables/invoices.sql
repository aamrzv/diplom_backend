CREATE TABLE invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL,
    invoice_date TEXT NOT NULL,
    contract_id INTEGER NOT NULL,
    contractor_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    is_payid INTEGER,
    FOREIGN KEY (contract_id) REFERENCES contracts(contract_id),
    FOREIGN KEY (contractor_id) REFERENCES contractors(contractor_id)
);