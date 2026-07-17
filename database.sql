-- 1. Buat database baru
CREATE DATABASE IF NOT EXISTS portfolio_db;

-- 2. Gunakan database tersebut
USE portfolio_db;

-- 3. Buat tabel contacts
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
