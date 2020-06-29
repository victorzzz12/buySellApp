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

  router.get('/userStatus', (req, res) => {
    const status = {isLoggedIn: false}
    if (req.session.userId) {
      status.isLoggedIn = true;
    } else {
      status.isLoggedIn = false;
    }
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
          isLoggedIn: true };
        res.json({user: {name: user.name, email: user.email, id: user.id}}) // maybe change to res.json
      })
    }
    login(email, password);
  });
  return router;
};




    // db.query(`SELECT * FROM users WHERE email = $1`, [`${email.toLowerCase()}`])


    // })
  // }

  // router.post('/login', (req, res) => {
  //   const {email, password} = req.body;
  //   const login =  function(email, password) {
  //     const getUserWithEmail = function(email) {
  //       db.query(`SELECT * FROM users WHERE email = $1`, [`${email.toLowerCase()}`])
  //       .then(res =>
  //         console.log(res))
  //       //     if (res.rows.length === 0) {
  //       //       res = null;
  //       //     } else {
  //       //       res = res.rows[0];
  //       //     }
  //       //     console.log(res);
  //       //     return res;
  //       //   }
  //       // ).catch(err => console.error('query error', err.stack));
  //     }
  //     // return getUserWithEmail(email)
  //     // .then(user => {
  //     //   if (user.password = password) {
  //     //     return user;
  //     //   }
  //     //   return null;
  //     // });
  //   }

  //   // login(email, password)
  //   //   .then(user => {
  //   //     if (!user) {
  //   //       res.send({error: "error"});
  //   //       return;
  //   //     }
  //   //     req.session.userId = user.id;
  //   //     res.send({user: {name: user.name, email: user.email, id: user.id}});
  //   //   })
  //   //   .catch(e => res.send(e));
  // // });

// };
