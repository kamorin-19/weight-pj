CREATE TABLE IF NOT EXISTS daily_workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_date DATE NOT NULL,
    exercise_id INT NOT NULL,
    set_weight INT NOT NULL,
    first_rep INT NOT NULL,
    second_rep INT,
    third_rep INT,
    fourth_rep INT,
    fifth_rep INT,
    user_id INT NOT NULL,
    deleted_at DATETIME,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
