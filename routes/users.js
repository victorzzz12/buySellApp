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

  const login =  function(email, password) {
    return db.getUserWithEmail(email)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
  }

  exports.login = login;

  router.post('/login', (req, res) => {

    const {email, password} = req.body;

    const login =  function(email, password) {
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
      return getUserWithEmail(email)
      .then(user => {
        if (user.password = password) {
          return user;
        }
        return null;
      });
    }

    login(email, password)
      .then(user => {
        if (!user) {
          res.send({error: "error"});
          return;
        }
        req.session.userId = user.id;
        res.send({user: {name: user.name, email: user.email, id: user.id}});
      })
      .catch(e => res.send(e));
  });
  return router;
};
