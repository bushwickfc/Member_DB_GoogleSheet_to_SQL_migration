

exports.up = function(knex, Promise) {

  return knex.schema.createTable('user', function (t) {
  t.uuid('userId').primary()
  t.string('sevenShiftsId').nullable()
  t.string('posId').nullable()
  t.string('firstName').notNullable()
  t.string('lastName').notNullable()
  t.string('email').notNullable()
  t.string('mobilePhone').nullable()
  t.timestamps(false, true)
})
};

exports.down = function(knex, Promise) {

  return knex.schema.dropTableIfExists('user')
};
