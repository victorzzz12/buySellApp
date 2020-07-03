const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //returns object that shows if user is logged in or is admin
  //switches isAdmin to true if admin check succeeds
  router.get('/userStatus', (req, res) => {
    const status = { isLoggedIn: false, isAdmin: false}

    if (req.session.userId) {
      status.isLoggedIn = true;
    } else {
      status.isLoggedIn = false;
    }

    const adminCheck = function(email) {
      return db.query(`SELECT id FROM admins
      WHERE email = $1`,
      [`${email}`])
      .then(res =>res.rows[0])
    }

    adminCheck(req.session.userEmail)
    .then(user => {
      if (user) {
        req.session.isAdmin = true;
        status.isAdmin = true;
      }
      console.log(status);
      res.send(status);
    });

  });

  router.post('/login', (req, res) => {
    console.log(req.body);
    const {email, password} = req.body;
    const login = function(email, password) {
      db.query(`SELECT * FROM admins
      WHERE admins.email = $1
      UNION SELECT * FROM users
      WHERE users.email = $1;
      `, [`${email}`])
      .then(res => {
        if (res.rows.length === 0) {
          res = null;
        } else {
          res = res.rows[0];
        }
        return res;
      })
      .then(user => {
        if (user.password = password) {
          return user;
        }
        return null;
      })
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session = { userId: user.id,
          userEmail: user.email,
          isLoggedIn: true,
          isAdmin: false };
        res.json({user: {name: user.name, email: user.email, id: user.id}}) // maybe change to res.json
      }).catch(err => console.error('query error', err.stack))
    }
    login(email, password);
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.send(null);
  });

  //messaging routes

  router.get('/messages/admin', (req, res) => {
    const recipient = req.session.userId;
    const query = `
    SELECT messages.user_id, users.name as sender, messages.content, products.name, messages.admin_id, admins.name as seller
    FROM messages
    JOIN users ON users.id = user_id
    JOIN products ON products.id = product_id
    JOIN admins ON admins.id = messages.admin_id
    WHERE products.admin_id = ${recipient}`;
    return db.query(query)
    .then(data => {
      const messages = data.rows
      res.json(messages)
    })
    .catch(err => console.log('/messages/admin', err));
  })

  router.post("/messages", (req, res) => {
    console.log(req.body);
    const fromId = req.session.userId;
    const productName = req.body['product-name']
    const toName = req.body['product-seller'];
    const message = req.body.message;
    console.log({fromId,productName, toName, message});
    const customerSendQuery = `
    INSERT INTO messages (user_id, admin_id, content, from_user, product_id)
    SELECT $1, admins.id, $3, TRUE, products.id
    FROM admins, products
    WHERE admins.name = $2 AND products.name = $4;`
    const params = [`${fromId}`, `${toName}`, `${message}`, `${productName}`]
    const sellerSendQuery = `
    INSERT INTO messages (user_id, admin_id, content, from_user, product_id)
    SELECT users.id, $1, $3, FALSE, products.id
    FROM users, products
    WHERE users.name = $2 AND products.name = $4;`;
    let query = "";
    console.log(req.body);
    console.log(req.body.fromCustomer);
    if (req.body.fromCustomer === 'true') {
      query = customerSendQuery;
      console.log(query);
    } else {
      query = sellerSendQuery;
      console.log(query);
    }
    return db.query(query, params)
    .then((res) => console.log(res.rows))
  });

  return router;
};
