import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateuserValidator from 'App/Validators/CreateuserValidator'

export default class AdminsController {
  public async create({ request, auth, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password'])

    await request.validate(CreateuserValidator)

    const emailExists = await User.findBy('email', data.email)

    if (emailExists) {
      return response.status(409).json({ error: { message: 'Email is already registered' } })
    }

    const adminData = {
      name: data.name,
      email: data.email,
      password: data.password,
      access_profile: 'admin',
    }

    const admin = await User.create(adminData)

    const token = await auth
      .use('api')
      .attempt(admin.email, admin.password, { expiresIn: '3hours', name: admin.serialize().email })

    return response.created({ admin, token })
  }

  public async show({ response, auth }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()

    const admin = await User.findByOrFail('id', id)

    return response.ok(admin)
  }

  public async index({ response }: HttpContextContract) {
    const admins = await (await User.all()).filter((user) => user.access_profile === 'admin')

    return response.ok(admins)
  }

  public async update({ request, auth, response }: HttpContextContract) {
    const { id } = await auth.use('api').authenticate()
    const admin = await User.findByOrFail('id', id)

    const data = request.only(['name', 'email', 'password', 'access_profile'])

    await admin.merge(data)

    await admin.save()

    return response.ok(admin)
  }

  public async delete({ request, response }: HttpContextContract) {
    const { id } = request.params()

    const admin = await User.findByOrFail('id', id)

    if (!admin) {
      return response.notFound({ message: 'Admin not found' })
    }

    await admin.delete()

    return response.noContent()
  }
}
