import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

import User from 'App/Models/User'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
})

export default class AuthController {
  public async loginAdmin({ auth, request, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    const user = await User.findBy('email', email)

    try {
      const token = await auth
        .use('api')
        .attempt(email, password, { expiresIn: '3hours', name: user?.serialize().email })
      return { token, user: user?.serialize() }
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async loginClient({ auth, request, response }: HttpContextContract) {
    const data = request.only(['email', 'password'])

    const verifyCredentials = await axiosInstance.post('/clients/verify-credentials', data)

    const client = verifyCredentials.data

    if (!client) {
      return response.badRequest({ message: 'Invalid credentials' })
    }

    const token = await auth.use('api').generate(client, {
      expiresIn: '3hours',
      name: client.email,
    })

    return response.ok({ token, user: client })
  }
}
