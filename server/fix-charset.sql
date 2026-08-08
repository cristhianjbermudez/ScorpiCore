-- Fix: Re-create site_settings table with correct UTF-8 charset
-- This fixes "Tecnolog??a", "Cotizaci??n", etc.

USE scorpicore;

-- Drop corrupted table
DROP TABLE IF EXISTS site_settings;

-- Recreate with utf8mb4
CREATE TABLE site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-seed data (run seed-settings.sql after this, or use the INSERT below)
-- After running this script, run: mysql -u root -p scorpicore < seed-settings.sql
