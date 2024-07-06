CREATE TABLE sessions (
    session_id  INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    session_key  TEXT NOT NULL,
    expiration_time   TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
