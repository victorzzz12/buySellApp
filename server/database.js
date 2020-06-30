const getFeaturedProducts = function(options, limit) {
  limit = 10;

  let queryString = `
  SELECT products.*,
  FROM products;`

  queryParams.push(limit);
  queryString += `
  ORDER BY id
  LIMIT $${queryParams.length};`

  console.log(queryString, queryParams);

  return db.query(queryString, queryParams)
  .then(res => res.rows)
  .catch(err => console.error('query error', err.stack))
}

exports.getFeaturedProducts = getFeaturedProducts;

const addProduct = function(product) {
  return db.query(`
  INSERT INTO products (id, admin_id, name, photo_url, price, description, date_added)
  VALUES($1, $2, $3, $4, $5, $6, $7)
  RETURNING *;`,
  [product.id, product.admin_id, product.name, product.photo_url, product.price, product.description, Date.now()])
  .then(res => res.rows);
}

exports.addProduct = addProduct;
