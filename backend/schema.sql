-- Military Asset Management Database Schema
-- This script creates all necessary tables for the military asset management system

-- Enable UUID extension (if using PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create bases table
CREATE TABLE IF NOT EXISTS bases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL,
    commander_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'base_commander', 'logistics_officer')),
    base_id INTEGER REFERENCES bases(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for base commander
ALTER TABLE bases ADD CONSTRAINT fk_commander 
    FOREIGN KEY (commander_id) REFERENCES users(id);

-- Create assets table
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    serial_number VARCHAR(255),
    base_id INTEGER NOT NULL REFERENCES bases(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'retired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(serial_number, base_id)
);

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    base_id INTEGER NOT NULL REFERENCES bases(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(12,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    purchase_date DATE NOT NULL,
    vendor VARCHAR(255),
    notes TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    from_base_id INTEGER NOT NULL REFERENCES bases(id),
    to_base_id INTEGER NOT NULL REFERENCES bases(id),
    quantity INTEGER NOT NULL,
    transfer_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    notes TEXT,
    initiated_by INTEGER NOT NULL REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (from_base_id != to_base_id)
);

-- Create assignments table
CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    assigned_to_user_id INTEGER NOT NULL REFERENCES users(id),
    assigned_by INTEGER NOT NULL REFERENCES users(id),
    quantity INTEGER NOT NULL,
    assignment_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'returned', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create expenditures table
CREATE TABLE IF NOT EXISTS expenditures (
    id SERIAL PRIMARY KEY,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    quantity INTEGER NOT NULL,
    expenditure_date DATE NOT NULL,
    reason VARCHAR(255) NOT NULL,
    recorded_by INTEGER NOT NULL REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create audit log table for tracking all activities
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assets_base_id ON assets(base_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_purchases_base_id ON purchases(base_id);
CREATE INDEX IF NOT EXISTS idx_purchases_date ON purchases(purchase_date);
CREATE INDEX IF NOT EXISTS idx_transfers_from_base ON transfers(from_base_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_base ON transfers(to_base_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(transfer_date);
CREATE INDEX IF NOT EXISTS idx_assignments_asset_id ON assignments(asset_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_asset_id ON expenditures(asset_id);
CREATE INDEX IF NOT EXISTS idx_expenditures_date ON expenditures(expenditure_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- Insert sample data for development
INSERT INTO bases (name, location) VALUES 
    ('Base Alpha', 'Northern Region'),
    ('Base Beta', 'Southern Region'),
    ('Base Gamma', 'Eastern Region'),
    ('Base Delta', 'Western Region')
ON CONFLICT (name) DO NOTHING;

-- Insert sample admin user (password: admin123)
INSERT INTO users (username, email, password, role, base_id) VALUES 
    ('admin', 'admin@military.gov', '$2b$10$8K7qXHdEp7Z9/IA4lJ2X6OtH8p9xE1pY6r.1z8c.0/QOvb2i0QJ6O', 'admin', 1)
ON CONFLICT (email) DO NOTHING;

-- Insert sample base commanders (password: commander123)
INSERT INTO users (username, email, password, role, base_id) VALUES 
    ('cmd_alpha', 'commander.alpha@military.gov', '$2b$10$rY8lI.ZhQpJX9o6F.rY8lI.ZhQpJX9o6F.rY8lI.ZhQpJX9o6F.rY8l', 'base_commander', 1),
    ('cmd_beta', 'commander.beta@military.gov', '$2b$10$rY8lI.ZhQpJX9o6F.rY8lI.ZhQpJX9o6F.rY8lI.ZhQpJX9o6F.rY8l', 'base_commander', 2)
ON CONFLICT (email) DO NOTHING;

-- Insert sample logistics officers (password: logistics123)
INSERT INTO users (username, email, password, role, base_id) VALUES 
    ('log_alpha', 'logistics.alpha@military.gov', '$2b$10$nR7fH.YgPpIW8n5E.nR7fH.YgPpIW8n5E.nR7fH.YgPpIW8n5E.nR7f', 'logistics_officer', 1),
    ('log_beta', 'logistics.beta@military.gov', '$2b$10$nR7fH.YgPpIW8n5E.nR7fH.YgPpIW8n5E.nR7fH.YgPpIW8n5E.nR7f', 'logistics_officer', 2)
ON CONFLICT (email) DO NOTHING;

-- Update bases with commander references
UPDATE bases SET commander_id = (SELECT id FROM users WHERE username = 'cmd_alpha') WHERE name = 'Base Alpha';
UPDATE bases SET commander_id = (SELECT id FROM users WHERE username = 'cmd_beta') WHERE name = 'Base Beta';

-- Insert sample assets
INSERT INTO assets (name, category, serial_number, base_id, quantity, status) VALUES 
    ('M4A1 Carbine', 'Weapons', 'W001-001', 1, 50, 'available'),
    ('M16A4 Rifle', 'Weapons', 'W002-001', 1, 30, 'available'),
    ('HMMWV', 'Vehicles', 'V001-001', 1, 5, 'available'),
    ('Bradley Fighting Vehicle', 'Vehicles', 'V002-001', 1, 2, 'available'),
    ('5.56mm Ammunition', 'Ammunition', 'A001-001', 1, 10000, 'available'),
    ('M4A1 Carbine', 'Weapons', 'W001-002', 2, 40, 'available'),
    ('HMMWV', 'Vehicles', 'V001-002', 2, 3, 'available'),
    ('5.56mm Ammunition', 'Ammunition', 'A001-002', 2, 8000, 'available')
ON CONFLICT (serial_number, base_id) DO NOTHING;
