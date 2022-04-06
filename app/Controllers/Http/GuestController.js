'use strict'

const Guest = use('App/Models/Guest')
const moment = require('moment')
const Axios = use('axios')
const Env = use('Env')
const QueryBuilder = require('./Helper/DatatableBuilder.js')

class GuestController {
    async index({ request, response, view }) {
        let guest = await Guest.query().orderBy('id','DESC').fetch()
        let data = guest.toJSON()
        for (let d of data) {
            d.date = moment(d.date).format('DD MMM YYYY')
        }
        return view.render('guest.index', { guest: data })
    }

    async datatable({ request, response, auth, view, session }) {
        const formData = request.post()
        let tableDefinition = {
            sTableName: 'guests',
            sSelectSql: ['id', 'rfid_id', 'guest_id', 'name', 'gender', 'address', 'destination', 'date', 'is_active'],
            aSearchColumns: ['rfid_id', 'guest_id', 'name', 'destination'],
        }

        let queryBuilder = new QueryBuilder(tableDefinition)

        let requestQuery = {
            draw: formData.draw,
            columns: formData.columns,
            order: formData.order,
            start: formData.start,
            length: formData.length,
            search: formData.search
        }

        let queries = queryBuilder.buildQuery(JSON.parse(JSON.stringify(requestQuery)))

        let select = await Database.raw(queries.select)
        let recordsTotal = await Database.raw(queries.recordsTotal)
        let recordsFiltered = await Database.raw(queries.recordsFiltered)

        let fdata = []
        let no = 0
        for (let x in select[0]) {
            fdata.push([
                "<div class='text-center'><input type='checkbox' id='titleCheckdel' /><input type='hidden' class='deldata' name='item[]' value='" + select[0][x]['id'] + "' disabled /></div>\n",
                select[0][x]['id'],
                select[0][x]['rfid_id'],
                select[0][x]['guest_id'],
                select[0][x]['name'],
                select[0][x]['gender'],
                select[0][x]['address'],
                select[0][x]['destination'],
                select[0][x]['date'],
                select[0][x]['is_active'],

                "<div class='text-center'><div class='btn-group btn-group-sm'><a href='./" + select[0][x]['id'] + "/edit' class='btn btn-sm btn-info' id='" + select[0][x]['id'] + "' data-toggle='tooltip' title='Edit'><i class='fa fa-pencil'></i> Edit</a><a class='btn btn-sm btn-danger alertdel' id='" + select[0][x]['id'] + "' data-toggle='tooltip' title='Delete'><i class='fa fa-times'></i> Delete</a></div></div>\n"
            ])
            no++
        }

        let data = {
            draw: formData.draw,
            recordsTotal: JSON.stringify(recordsTotal[0][0]['COUNT(*)']),
            recordsFiltered: (queries.recordsFiltered) ? JSON.stringify(recordsFiltered[0][0]['COUNT(*)']) : JSON.stringify(recordsTotal[0][0]['COUNT(*)']),
            data: fdata
        }

        return data
    }

    async create({ request, response, view }) {
        let raspi_host = Env.get('RASPI_HOST')
        let url = raspi_host + '/add'
        try {
            let response = await Axios.get(url)
            let rfid = response.data
            // let rfid = 2694881440
            return view.render('guest.add', { rfid })
        } catch (error) {
            console.log(error)
            return "Can't Connect to the rfid server please contact superuser"
        }
    }

    async store({ request, response, view, session }) {
        try {
            let req = request.body
            let dates = moment().format("YYYY-MM-DD")
            if (req.rfid === null || req.rfid === '') {
                return "Please Scan RFID"
            } else if (req.nik === null || req.nik === '') {
                return "Guest ID can't be blank"
            } else if (req.name === null || req.name === '') {
                return "Guest Name can't be blank"
            } else if (req.destination === null || req.destination === '') {
                return "Guest Destination can't be blank"
            }
            let d = await Guest.query().where('rfid_id', req.rfid).where('date', dates).where('is_active', 1).first()
            if (d) {
                return "RFID " + req.rfid + " has been used for guest " + d.name
            }
            let gender = ''
            if (req.gender === "1") {
                gender = 'Laki-Laki'
            } else if (req.gender === "2") {
                gender = 'Perempuan'
            } else {
                gender = 'undefind'
            }
            let guest = {rfid_id: req.rfid, guest_id: req.nik, name: req.name, gender: gender, address: req.address, origin: req.origin, destination: req.destination, purpose: req.purpose, date: dates, is_active: 1}
            await Guest.create(guest)
            session.flash({ notification: 'Data Berhasil Ditambahkan!' })
            return response.redirect('/guest')
        } catch (error) {
            console.log(error)
        }
    }

    async multidelete({ request, response, auth, view, session }) {
        console.log("OK")
        return view.render('guest.index')
    }

    async edit({ params, response, view }) {
        try {
            let guest = await Guest.find(params.id)
            if (guest) {
                return view.render('guest.edit', { guest: guest })
            } else {
                return response.redirect('/guest')
            }
        } catch (error) {
            console.log(error)
            return response.redirect('/guest')
        }
    }

    async update({ request, response, view, params, session }) {
        let guest = await Guest.find(params.id)
        try {
            const { rfid, nik, name, address, gender, destination, purpose, status } = request.only(['rfid', 'nik', 'name', 'address', 'gender', 'destination', 'purpose', 'status'])
            let guestData = await Guest.find(params.id)
            let formData = {
                rfid_id: rfid,
                guest_id: nik,
                name: name,
                gender: gender,
                address: address,
                destination: destination,
                purpose: purpose,
                is_active: status,
                updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            await Guest.query().where('id', params.id).update(formData)
            session.flash({ notification: 'Data Berhasil Diupdate!' })
            return response.redirect('/guest')
        } catch (error) {
            session.flash({ notification: 'Error!' })
            return response.redirect('/guest')
        }
    }

    async delete({ request, response, view, params, session }) {
        try {
            let guestData = await Guest.find(params.id)
            if (guestData) {
                await guestData.delete()
                session.flash({ notification: 'Data Berhasil Dihapus!' })
                return response.redirect('/guest')
            } else {
                session.flash({ notification: 'Data Tidak Ditemukan!' })
                return response.redirect('/guest')
            }
        } catch (error) {
            session.flash({ danger: 'ERROR!' })
            return response.redirect('/guest')
        }
    }
}

module.exports = GuestController
