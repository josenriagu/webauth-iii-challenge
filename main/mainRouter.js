const router = require('express').Router();
const mw = require('../data/helpers/middleware')
const Users = require('../data/helpers/dbModel');

router.get('/sales', mw.checkSales, async (req, res) => {
   try {
      const users = await Users.getByDept('sales');
      res.status(200).json(users);
   } catch (error) {
      res.status(500).json('Oops! We missed that. Hang on, let\'s fix it together');
   };
})

router.get('/finance', mw.checkFinance, async (req, res) => {
   try {
      const users = await Users.getByDept('finance');
      res.status(200).json(users);
   } catch (error) {
      console.log(error)
      res.status(500).json('Oops! We missed that. Hang on, let\'s fix it together');
   };
})
module.exports = router;