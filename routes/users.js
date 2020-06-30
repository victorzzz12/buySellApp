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
    console.log(req.session);
    const status = { isLoggedIn: false, isAdmin: false}
    if (req.session.userId) {
      status.isLoggedIn = true;
    } else {
      status.isLoggedIn = false;
    }

    const adminCheck = function(email, callback) {
      return db.query(`SELECT id FROM admins
      WHERE email = $1`,
      [`${email}`])
      .then(res => {
        if (res.rows[0]) {
          callback();
        }
      })
    }

    const adminSwitch = function() {
      req.session.isAdmin = true;
    }

    adminCheck(req.session.userEmail, adminSwitch);

    res.send(status);
  });

  router.post('/login', (req, res) => {
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
  return router;
};
