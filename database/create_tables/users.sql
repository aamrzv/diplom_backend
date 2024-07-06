CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_login TEXT NOT NULL UNIQUE,
    user_password_hash TEXT NOT NULL,
    user_role_id INTEGER NOT NULL,
    client_id INTEGER,
    employee_id INTEGER,
    is_active INTEGER NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(client_id)
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
    FOREIGN KEY (user_role_id) REFERENCES users_roles(user_role_id)
);
CREATE INDEX users_user_login_IDX ON users (user_login)