const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mw = require('../data/helpers/middleware');
const Users = require('../data/helpers/dbModel');

router.post('/register', async (req, res) => {
   const { password } = req.body;
   const hashed = bcrypt.hashSync(password, 14);
   req.body.password = hashed;
   try {
      const { id, username } = await Users.insertUser(req.body);
      res.status(201).json({ message: `Hooray! Welcome Aboard, ${username}!!`, id, username })
   }
   catch (error) {
      res.status(500).json('Oops! We missed that. Hang on, let\'s fix it together');
   };
});

router.post('/login', mw.validateLogin, (req, res) => {
   try {
      const token = req.token;
      res.status(200).json({ message: `Welcome ${req.user.username}!`, token });
   } catch (error) {
      res.status(500).json('Oops! We missed that. Hang on, let\'s fix it together');
   };
});

module.exports = router;