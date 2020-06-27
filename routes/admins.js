const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM admins`;
    console.log(query);
    db.query(query)
      .then(data => {
        const admins = data.rows;
        res.json({ admins });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
