'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccessControlSchema extends Schema {
  up () {
    this.create('access_controls', (table) => {
      table.increments()
      table.string('host')
      table.string('reader_id')
      table.string('door_lock_id')
      table.string('location')
      table.timestamps()
    })
  }

  down () {
    this.drop('access_controls')
  }
}

module.exports = AccessControlSchema
