import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/send', 'PixesController.create')
})
  .middleware('auth')
  .prefix('/pix')
