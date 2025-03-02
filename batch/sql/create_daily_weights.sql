CREATE TABLE IF NOT EXISTS daily_weights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    weight DECIMAL(5,1) NOT NULL,
    record_date DATE NOT NULL,
    user_id INT NOT NULL,
    deleted_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
