'use strict'

const Monitoring = use('App/Models/Monitoring')
const Monitor = use('App/Models/Monitor')
const moment = require('moment')

class MainController {
    async index({ request, response, view, session }) {
        try {
            let monitor = await Monitor.query().orderBy('id', 'DESC').fetch()
            let data = monitor.toJSON()
            for (let d of data) {
                monitor.created_at = moment(d.created_at).format('DD-MM-YYYY hh:mm:ss')
            }
            return view.render('index', { data: data })
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = MainController
