CREATE DATABASE IF NOT EXISTS support_ticket_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE support_ticket_db;

-- Support agents
CREATE TABLE IF NOT EXISTS agents (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  department VARCHAR(100) NOT NULL DEFAULT 'Technical',
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id INT NOT NULL AUTO_INCREMENT,
  customer_id INT NOT NULL,
  agent_id INT DEFAULT NULL,
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    NOT NULL DEFAULT 'MEDIUM',
  category VARCHAR(100) NOT NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')
    NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ticket_status (status),
  KEY idx_ticket_priority (priority),
  KEY idx_ticket_category (category),
  KEY idx_ticket_agent (agent_id),
  KEY idx_ticket_customer (customer_id),
  CONSTRAINT fk_ticket_agent
    FOREIGN KEY (agent_id) REFERENCES agents (id)
    ON DELETE SET NULL,
  CONSTRAINT fk_ticket_customer
    FOREIGN KEY (customer_id) REFERENCES customers (id)
    ON DELETE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_0900_ai_ci;

-- Seed five support agents.
-- Existing agents with matching email addresses will not be duplicated.
INSERT INTO agents (name, email, department, status)
VALUES
  ('Arun Kumar', 'arun.kumar@example.com', 'Technical', 'ACTIVE'),
  ('Priya Sharma', 'priya.sharma@example.com', 'Billing', 'ACTIVE'),
  ('Rahul Kumar', 'rahul.kumar@example.com', 'Technical', 'ACTIVE'),
  ('Divya Raj', 'divya.raj@example.com', 'Account', 'ACTIVE'),
  ('Karthik S', 'karthik.s@example.com', 'General', 'ACTIVE')
ON DUPLICATE KEY UPDATE email = VALUES(email);