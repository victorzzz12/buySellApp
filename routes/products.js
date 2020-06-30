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
  //this route is the destination for product search
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

    if (options.sold === false) {
      queryString += `WHERE products.sold = false `
    } else {
      queryString += 'WHERE products.sold IN (true, false) '
    }

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

    db.query(queryString, queryParams)
      .then(data => {
        const products = data.rows;
        console.log(products);
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
