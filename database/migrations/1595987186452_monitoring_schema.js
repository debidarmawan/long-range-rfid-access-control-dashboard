'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MonitoringSchema extends Schema {
  up () {
    this.create('monitorings', (table) => {
      table.increments()
      table.datetime('time')
      table.string('guest_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('monitorings')
  }
}

module.exports = MonitoringSchema
