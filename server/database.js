const addProduct = function(product) {
  return db.query(`
  INSERT INTO products (admin_id, name, photo_url, price, description, date_added)
  VALUES($1, $2, $3, $4, $5, $6)
  RETURNING *;`,
  [product.admin_id, product.name, product.photo_url, product.price, product.description, Date.now()])
  .then(res => res.rows);
}

exports.addProduct = addProduct;
