import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/register', 'ClientsController.create')
  Route.get('/extract/:cpf_number', 'ClientsController.extract')
  Route.group(() => {
    Route.get('/list-clients', 'ClientsController.index')
    Route.put('/update/:cpf_number', 'ClientsController.update')
    Route.delete('/delete/:cpf_number', 'ClientsController.delete')
  })
    .middleware('auth')
    .middleware('accessProfileVerify')
}).prefix('/client')
