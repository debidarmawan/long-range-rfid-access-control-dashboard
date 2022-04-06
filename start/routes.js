'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')
// Route.get('/hello', 'HelloController.index').as('hello.index')
Route.get('/', 'MainController.index').as('Main.index')
Route.get('/second', 'TodoController.page2').as('Todo.page2')
// Route.resource('/', 'MainController')

//Guest
Route.get('/guest/add', 'GuestController.addGuest')
Route.post('/guest/create', 'GuestController.createGuest')
Route.post('/guest/datatable', 'GuestController.datatable')
Route.get('guest/delete/:id', 'GuestController.delete')
Route.resource('guest', 'GuestController')

//Monitoring
Route.get('/monitor', 'MonitorController.index').as('Monitor.index')

//Acces Control
Route.resource('accescontrol', 'SecurityController')

//API
Route.post('/api/access', 'Api/SecurityController.access')