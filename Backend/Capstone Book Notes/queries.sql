CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    isbn VARCHAR(20),
    rating INTEGER CHECK (rating >= 1 AND rating <= 10),
    review TEXT,
    date_read DATE DEFAULT CURRENT_DATE
);

-- Sample Data (Replace with your actual notes if you want to test immediately)
INSERT INTO books (title, author, isbn, rating, review, date_read) 
VALUES ('Atomic Habits', 'James Clear', '0735211299', 10, 'A fantastic book on tiny changes and how they compound over time.', '2023-01-15');
