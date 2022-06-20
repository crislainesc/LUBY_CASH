import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'AdminsController.create')
  Route.get('/list-admins', 'AdminsController.index')
  Route.put('/update', 'AdminsController.update')
  Route.delete('/delete/:id', 'AdminsController.delete')
  Route.get('/my-account', 'AdminsController.show')
})
  .prefix('/admin')
  .middleware('auth')
  .middleware('accessProfileVerify')
