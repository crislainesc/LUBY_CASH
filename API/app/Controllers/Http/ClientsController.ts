import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateClientValidator from 'App/Validators/CreateClientValidator'
import { Kafka, Partitioners } from 'kafkajs'
import axios from 'axios'
import Pix from 'App/Models/Pix'

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

    if (status && from && to) {
      const filteredClients = clients.data.filter((client) => {
        const [created_at] = client.created_at.split('T')
        const [updated_at] = client.updated_at.split('T')

        return (
          new Date(created_at) >= new Date(from) &&
          new Date(updated_at) <= new Date(to) &&
          client.status === status
        )
      })

      if (filteredClients.length === 0) {
        return response.notFound({
          message: 'There are no customers registered with the filters sent',
        })
      }

      return response.ok(filteredClients)
    }

    if (from && to) {
      const filteredClients = clients.data.filter((client) => {
        const [created_at] = client.created_at.split('T')
        const [updated_at] = client.updated_at.split('T')

        return new Date(created_at) >= new Date(from) && new Date(updated_at) <= new Date(to)
      })

      if (filteredClients.length === 0) {
        return response.notFound({
          message: 'There are no customers registered with the filters sent',
        })
      }
      return response.ok(filteredClients)
    }

    if (status) {
      const filteredClients = clients.data.filter((client) => client.status === status)

      if (filteredClients.length === 0) {
        return response.notFound({
          message: 'There are no customers registered with the filters sent',
        })
      }

      return response.ok(filteredClients)
    }

    return response.ok(clients.data)
  }

  public async upddate({ request, response }: HttpContextContract) {
    const { cpf_number } = request.params()

    const data = request.body()

    const client = await axiosInstance.get(`/clients/${cpf_number}`)

    const updatedClient = await axiosInstance.put(`/clients/${client.data.id}`, data)

    return response.ok(updatedClient)
  }

  public async delete({ request, response }: HttpContextContract) {
    const { cpf_number } = request.params()

    const client = await axiosInstance.get(`/clients/${cpf_number}`)

    await axiosInstance.delete(`/clients/${client.data.id}`)

    return response.noContent()
  }

  public async extract({ request, response }: HttpContextContract) {
    const { cpf_number } = request.params()

    const { from, to } = request.qs()

    const clientResponse = await axiosInstance.get(`/clients/get-by-cpf/${cpf_number}`)

    const client = clientResponse.data

    const allPixes = await Pix.all()

    let clientPixesSended = allPixes.filter((pix) => pix.cpf_sender === client.cpf_number)

    let clientPixesReceived = allPixes.filter((pix) => pix.cpf_receiver === client.cpf_number)

    if (from && to) {
      clientPixesSended = clientPixesSended.filter((pix) => {
        const [created_at] = pix.createdAt.toString().split('T')

        return new Date(created_at) >= new Date(from) && new Date(created_at) <= new Date(to)
      })

      clientPixesReceived = clientPixesReceived.filter((pix) => {
        const [created_at] = pix.createdAt.toString().split('T')

        return new Date(created_at) >= new Date(from) && new Date(created_at) <= new Date(to)
      })
    }

    return response.ok({
      sended: clientPixesSended,
      received: clientPixesReceived,
      current_balance: client.current_balance,
    })
  }
}
