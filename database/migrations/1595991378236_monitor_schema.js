'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MonitorSchema extends Schema {
  up () {
    this.table('monitors', (table) => {
      // alter table
      table.integer('access').after('room')
    })
  }

  down () {
    this.table('monitors', (table) => {
      // reverse alternations
    })
  }
}

module.exports = MonitorSchema
