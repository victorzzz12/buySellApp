const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT products.name as product,
    products.photo_url as photo_url,
    products.price as price,
    products.description as description,
    products.date_added as date_added,
    admins.name as seller,
    admins.email as email
    FROM products JOIN admins
    ON admins.id = admin_id;`)
      .then(data => {
        const products = data.rows;
        res.json({ products });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/search", (req, res) => {
    const options = req.body;
    console.log(options);
    let queryString =`SELECT products.name as product,
    products.photo_url as photo_url,
    products.price as price,
    products.description as description,
    products.date_added as date_added,
    admins.name as seller,
    admins.email as email
    FROM products JOIN admins
    ON admins.id = admin_id `;

    const queryParams = [];
    queryString += `WHERE products.sold = ${options.sold} `
    if (options.keywords) {
      queryParams.push(`%${options.keywords.toLowerCase()}%`);
      queryString += `AND LOWER(products.name) LIKE $${queryParams.length}
      OR LOWER(products.description) LIKE $${queryParams.length} `
    }
    if (options.seller) {
      queryParams.push(`%${options.seller.toLowerCase()}%`);
      queryString += `AND LOWER(admins.name) LIKE $${queryParams.length} `;
    }
    if (options.type) {
      let optionsArray = options.type
      if (!Array.isArray(options.type)) {
        optionsArray = Array(options.type);
      }
      const arrayLength = optionsArray.length;
      for (let i = 0; i < arrayLength; i++) {
        queryParams.push(`${optionsArray[i]}`);
        if (i === 0) {
          queryString += `AND products.type IN ($${queryParams.length}`;
        } else {
          queryString += `, $${queryParams.length}`;
        }
      }
      queryString += ') ';
    }
    if (options.minimum_price) {
      queryParams.push(`${options.minimum_price}`);
      queryString += `AND products.price >= $${queryParams.length} `;
    }
    if (options.maximum_price) {
      queryParams.push(`${options.maximum_price}`);
      queryString += `AND products.price <= $${queryParams.length} `;
    }
    queryString = queryString.trim() + `;`
    console.log(queryString);
    console.log(queryParams);
    db.query(queryString, queryParams)
      .then(data => {
        // console.log(queryString);
        // console.log(queryParams);
        console.log(data.rows);
        const products = data.rows;
        res.json({ products });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
