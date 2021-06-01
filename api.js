const express = require('express');

function createRouter(db) {
  const router = express.Router();

  //getUsers
  router.get('/user', function (req, res, next) {
    db.query(
      'SELECT id, name, surname, email, username FROM user',// WHERE owner=? ORDER BY date LIMIT 10 OFFSET ?',
      //[owner, 10*(req.params.page || 0)],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  });

  //createUser
  router.post('/user', (req, res, next) => {
    db.query(
      'INSERT INTO user (name, surname, email, username, password) VALUES (?,?,?,?,?)',
      [req.body.name, req.body.surname, req.body.email, req.body.username, req.body.password],//new Date(req.body.date)],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  //updateUser
  router.put('/user/:id', function (req, res, next) {
    db.query(
      'UPDATE user SET name=?, surname=?, email=?, password=? WHERE id=?',
      [req.body.name, req.body.surname, req.body.email, req.body.password, req.params.id],
      (error) => {
        if (error) {
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json({status: 'ok'});
        }
      }
    );
  });

  return router;
}

module.exports = createRouter;