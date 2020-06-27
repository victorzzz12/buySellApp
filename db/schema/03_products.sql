-- Drop and recreate Widgets table (Example)

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  admin_id INTEGER REFERENCES admins(id),

  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  type VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  date_added DATE NOT NULL,
  sold BOOLEAN NOT NULL DEFAULT FALSE
);
