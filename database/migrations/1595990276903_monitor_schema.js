'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MonitorSchema extends Schema {
  up () {
    this.table('monitors', (table) => {
      table.bigInteger('rfid_id').after('id')
      table.bigInteger('guest_id').after('rfid_id')
      // alter table
    })
  }

  down () {
    this.table('monitors', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MonitorSchema
