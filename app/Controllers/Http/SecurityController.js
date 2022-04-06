'use strict'

const Guest = use('App/Models/Guest')
const moment = require('moment')
const Axios = use('axios')
const Env = use('Env')
const QueryBuilder = require('./Helper/DatatableBuilder.js')

class SecurityController {
    async index({ request, response, view }) {
        return view.render('access-control.index')
    }

    async create({ request, response, view }) {
        try {
            return view.render('access-control.create')
        } catch (error) {
            return "Internal Server Error !"
        }
    }
}

module.exports = SecurityController
