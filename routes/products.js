const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  function getProducts() {
    return db.query(`
      SELECT products.name as product,
      products.id,
      products.photo_url as photo_url,
      products.price as price,
      products.description as description,
      products.date_added as date_added,
      admins.name as seller,
      admins.email as email,
      products.sold as sold
      FROM products JOIN admins
      ON admins.id = admin_id
      LIMIT 8;`);
  }

  router.get("/", (req, res) => {
    getProducts()
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
    console.log('options', options);
    let queryString =`SELECT products.name as product,
    products.photo_url as photo_url,
    products.price as price,
    products.id as id,
    products.description as description,
    products.date_added as date_added,
    products.sold as sold,
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
      queryParams.push(`%${options.keywords}%`);
      queryString += `AND (products.name ILIKE $${queryParams.length}
      OR products.description ILIKE $${queryParams.length}) `
    }
    if (options.seller) {
      queryParams.push(`${options.seller}`);
      queryString += `AND admins.name ILIKE $${queryParams.length} `;
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

    queryString += `ORDER BY products.price;`
    console.log(queryString);
    console.log(queryParams);
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

  router.post('/', (req, res) => {
    const userId = req.session.userId;
    return db.query(`
    INSERT INTO products (admin_id, name, photo_url, price, description, type, date_added)
    VALUES($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;`,
    [`${userId}`, `${req.body['product-name']}`, `${req.body['product-image']}`, `${req.body.price}`, `${req.body.description}`, `${req.body['product-type']}`, `9-30-20`])
    .then(res => res.rows);
  });




  router.post('/delete', (req, res) => {
    console.log('/delete', req.body)

    return db.query(`
      DELETE FROM messages
      WHERE messages.product_id = $1;` , [`${req.body.id}`])
    .then(()=> {
      db.query(`
      DELETE FROM favorites
      WHERE favorites.product_id = $1;` , [`${req.body.id}`])
    })
    .then(()=> {
      db.query(`
      DELETE FROM products
      WHERE products.id = $1;` , [`${req.body.id}`])
    })
    .then(() => {
      getProducts()
      .then(data => {
        const products = data.rows;
        res.json({ products });
      })
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ error: err.message });
    })
  });

  router.post('/sold', (req, res) => {
    return db.query(`
    UPDATE products
    SET sold = true
    WHERE products.id = $1
    RETURNING *;` , [`${req.body.id}`])
    .then(data => {
      const products = data.rows;
      console.log(products);
      res.json({ products });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  router.post('/favorites',(req, res) => {
    console.log('/favorites issahit');
    const name = req.body.name;
    const user = req.session.userId;
    console.log(name);
    console.log(user);
        return db.query(`
        INSERT INTO favorites(user_id, product_id)
        SELECT $1, id
        FROM products
        WHERE name = $2 RETURNING *;`, [`${user}`, `${name}`])
        .then(res => res.rows).catch(err => (err));
  })

  router.get('/favorites', (req, res) => {
    const user = req.session.userId;
    return db.query(`
    SELECT products.name as product,
    products.photo_url as photo_url,
    products.id as id,
    products.price as price,
    products.description as description,
    products.date_added as date_added,
    admins.name as seller,
    admins.email as email
    FROM favorites
    JOIN products ON product_id = products.id
    JOIN admins ON admins.id = admin_id
    JOIN users ON users.id = user_id
    WHERE user_id = $1;`, [`${user}`])
    .then(data => {
      const products = data.rows;
      console.log(products);
      res.json({ products });
    })
    .catch(err => (console.log('get/favorites', err)));
  })
  return router;
};
