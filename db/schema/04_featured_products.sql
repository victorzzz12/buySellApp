DROP TABLE IF EXISTS featured_products CASCADE;
CREATE TABLE featured_products (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER REFERENCES products(id),
);
