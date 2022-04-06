'use strict'

const Guest = use('App/Models/Guest')
const Monitoring = use('App/Models/Monitoring')
const Monitor = use('App/Models/Monitor')
const moment = require('moment')
const Axios = use('axios')
const Env = use('Env')

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

    async access({request, response}) {
        try {
            let response
            let data = {}
            let req = request.all()
            console.log(req)
            let guest = await Guest.query().where('rfid_id', req.rfid).where('destination', req.room).where('is_active', 1).first()
            if (guest) {
                data = {rfid_id : req.rfid, guest_id : guest.id, name : guest.name, room : req.room, access : 1}
                await Monitor.create(data)
                console.log(JSON.stringify(guest))
                response = {
                    code: 200,
                    data: guest
                }
            } else {
                data = {rfid_id : req.rfid, guest_id : null, name : null, room : req.room, access : 0}
                await Monitor.create(data)
                response = {
                    code: 400
                }
            }
            return response
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = SecurityController
