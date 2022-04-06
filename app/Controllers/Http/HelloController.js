'use strict'

class HelloController {
    index({ request, response, view }) {
        let params = request.get('name');
        return view.render('hello', { text: params.name })
    }
}

module.exports = HelloController
