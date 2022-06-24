import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateClientValidator from 'App/Validators/CreateClientValidator'
import { Kafka, Partitioners } from 'kafkajs'
import axios from 'axios'

const kafka = new Kafka({
  clientId: 'ms_lubycash',
  brokers: ['localhost:9092'],
})

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
})

export default class ClientsController {
  public async create({ request, response }: HttpContextContract) {
    await request.validate(CreateClientValidator)

    const data = request.only([
      'full_name',
      'email',
      'password',
      'phone',
      'cpf_number',
      'address',
      'city',
      'state',
      'zipcode',
      'average_salary',
    ])

    const existsClient = await axiosInstance.get(`/clients/${data.cpf_number}`)

    console.log(existsClient.data)

    if (existsClient.data) {
      return response.badRequest({ message: 'Customer already registered' })
    }

    const clientResponse = await axiosInstance.post('/clients', data)

    const clientData = clientResponse.data

    const message = {
      messageData: {
        email: clientData.email,
        username: clientData.full_name,
        status: clientData.status,
      },
    }

    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

    if (clientData.status === 'disapproved') {
      await producer.connect()
      await producer.send({
        topic: 'sendEmailToDisapprovedClient',
        messages: [{ value: JSON.stringify(message) }],
      })
    }

    if (clientData.status === 'approved') {
      await producer.connect()
      await producer.send({
        topic: 'sendEmailToApprovedClient',
        messages: [{ value: JSON.stringify(message) }],
      })
    }

    return response.created(clientData)
  }

  public async index({ request, response }: HttpContextContract) {
    const clients = await axiosInstance.get('/clients')

    const { status, from, to } = request.qs()

    if (status) {
      const filteredClients = clients.data.filter((client) => client.status === status)
      return response.ok(filteredClients)
    }

    return response.ok(clients.data)
  }
}
