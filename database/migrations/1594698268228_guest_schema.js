'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class GuestSchema extends Schema {
  up () {
    this.table('guests', (table) => {
      // alter table
      table.bigInteger('guest_id').after('rfid_id')
    })
  }

  down () {
    this.table('guests', (table) => {
      // reverse alternations
    })
  }
}

module.exports = GuestSchema
