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

const getUserWithEmail = function(email) {
  return db.query(`SELECT * FROM users WHERE email = $1`, [`${email.toLowerCase()}`])
  .then(res => {
      if (res.rows.length === 0) {
        res = null;
      } else {
        res = res.rows[0];
      }
      return res;
    }
  ).catch(err => console.error('query error', err.stack));
}
exports.getUserWithEmail = getUserWithEmail;
