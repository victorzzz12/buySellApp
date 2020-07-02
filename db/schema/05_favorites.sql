DROP TABLE IF EXISTS favorites CASCADE;
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY NOT NULL,
  product_id INTEGER REFERENCES products(id),
  user_id INTEGER REFERENCES users(id),
  UNIQUE(product_id, user_id)
);
