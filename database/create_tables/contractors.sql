CREATE TABLE contractors (
    contractor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    contractor TEXT NOT NULL,
    contractor_name TEXT NOT NULL,
    contractor_iin TEXT NOT NULL,
    contractors_address TEXT NOT NULL,
    is_active INTEGER NOT NULL
);
