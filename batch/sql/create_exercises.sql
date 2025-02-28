CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ponderation DECIMAL(2,1) NOT NULL,
    muscle_group_id INT NOT NULL,
    FOREIGN KEY (muscle_group_id) REFERENCES muscle_groups(id)
);
