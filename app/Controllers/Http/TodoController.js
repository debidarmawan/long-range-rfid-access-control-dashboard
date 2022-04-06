'use strict'

class TodoController {
    index({request, response, view}) {
        return view.render('crud.index')
    }

    page2({request, response, view}) {
        return view.render('crud.page2')
    }
}

module.exports = TodoController
