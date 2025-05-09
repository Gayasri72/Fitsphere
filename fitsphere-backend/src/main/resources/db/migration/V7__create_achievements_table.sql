CREATE TABLE achievements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    exercise_type VARCHAR(100),
    days_completed INT,
    user_reflection TEXT,
    created_at TIMESTAMP,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);