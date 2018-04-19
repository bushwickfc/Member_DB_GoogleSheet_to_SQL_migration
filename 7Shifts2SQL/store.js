const knex = require('knex')(require('./knexfile'))
const uuid = require('uuid/v4')
module.exports = {
  // rows: [{firstName: ..., email:...}]
  users (rows) {
    console.log(`Add users`)

    rows = rows.map((row) => Object.assign({userId: uuid()}, row))
    knex.batchInsert('user', rows)

  }
}



//({ userId, sevenShiftsId, posId, firstName, lastName, email, mobilePhone }
