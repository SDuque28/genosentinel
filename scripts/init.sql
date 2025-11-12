-- GenoSentinel Database Initialization Script
-- This script runs automatically when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS genosentinel
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- Use the database
USE genosentinel;

-- Create user for remote connections
CREATE USER 'genosentinel_user'@'%' IDENTIFIED BY '<PASSWORD_PLACEHOLDER>';

-- Create user for localhost connections
CREATE USER 'genosentinel_user'@'localhost' IDENTIFIED BY '<PASSWORD_PLACEHOLDER>';

-- Grant all privileges on the genosentinel database
GRANT ALL PRIVILEGES ON genosentinel.* TO 'genosentinel_user'@'%';
GRANT ALL PRIVILEGES ON genosentinel.* TO 'genosentinel_user'@'localhost';

-- Apply privilege changes
FLUSH PRIVILEGES;

-- Verify setup
SELECT 'Database and user created successfully!' AS status;
-- End of script