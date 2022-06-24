import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.create({
      name: 'Admin',
      email: 'adminlabyluby.com.br',
      password: 'admin',
      access_profile: 'admin',
    })
  }
}
