const Users = require('../helpers/dbModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('./secrets');

module.exports = {
   validateUser,
   validateLogin,
   restrict,
   checkSales,
   checkFinance
}

function validateUser(req, res, next) {
   if (Object.keys(req.body).length !== 0 && req.body.constructor === Object) {
      if (req.body.username && req.body.password && req.body.department && req.path === "/register") {
         next();
      } else if (req.body.username && req.body.password && req.path === "/login") {
         next();
      } else {
         res.status(400).json({ message: 'Nahhhhh! You missed the required username and/or password and/or department fields' })
      }
   } else {
      res.status(400).json({ message: 'You must be kidding! Where is the user data?' })
   };
};

function validateLogin(req, res, next) {
   let { username, password } = req.body
   Users.getBy({ username })
      .first()
      .then(user => {
         if (user && bcrypt.compareSync(password, user.password)) {
            const token = generateToken(user);
            req.user = user;
            req.token = token;
            next();
         } else {
            res.status(401).json({ message: 'Oops! Invalid Credentials' });
         }
      })
      .catch((error) => {
         console.log(error)
         res.status(401).json({ message: 'Oops! Invalid Credentials' });
      });
};

function generateToken(user) {
   const payload = {
      sub: user.id,
      username: user.username,
      department: user.department
      // You can add more keys and useful pieces of info beyond this line
   }
   const options = {
      expiresIn: '1d'
   }
   return jwt.sign(payload, secret.jwtSecret, options);
};

function restrict(req, res, next) {
   const token = req.headers.authorization;
   if (token) {
      jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
         if (err) {
            res.status(401).json({ message: 'Oops! Bad kitty!! No access allowed!' })
         } else {
            req.decodedToken = decodedToken;
            next();
         }
      })
   } else {
      res.status(400).json({ message: 'Oops! Bad kitty!! Did you forget your token??' })
   }
};

function checkSales(req, res, next) {
   if (req.decodedToken.department === 'sales') {
      next();
   } else {
      res.status(403).json({ message: 'Oops! This is not your department, mate!' })
   }
};

function checkFinance(req, res, next) {
   if (req.decodedToken.department === 'finance') {
      next();
   } else {
      res.status(403).json({ message: 'Oops! This is not your department, mate!' })
   }
}