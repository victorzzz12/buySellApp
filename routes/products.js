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

  router.post('/', (req, res) => {
    const userId = req.session.userId;
    db.addProduct({...req.body, admin_id: userId})
      .then(product => {
        res.send(product);
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
  });
  return router;
};
