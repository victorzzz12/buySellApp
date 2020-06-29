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
