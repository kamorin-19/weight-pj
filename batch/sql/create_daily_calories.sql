CREATE TABLE IF NOT EXISTS daily_calories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calory INT NOT NULL,
    record_date DATE NOT NULL,
    user_id INT NOT NULL,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
