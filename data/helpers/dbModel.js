const db = require('../../config/dbConfig');

module.exports = {
   get: function () {
      return db('users')
         .select('id', 'username', 'department'); // returns only the id and username fields. not cool to show the password hashes
   },

   getUserById: function (id) {
      return db('users')
         .select('id', 'username', 'department')
         .where({ id })
         .first();
   },

   getBy: function (filter) {
      return db('users')
         .where(filter);
   },

   getByDept: function (dept) {
      return db('users')
         .select('id', 'username', 'department')
         .where('department', dept);
   },

   insertUser: function (user) {
      return db('users')
         .insert(user)
         .then(([id]) => {
            return this.getUserById(id);
         });
   }
}