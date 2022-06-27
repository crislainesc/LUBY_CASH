import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Kafka, Partitioners } from 'kafkajs'
import Pix from 'App/Models/Pix'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
})

const kafka = new Kafka({
  clientId: 'ms_lubycash',
  brokers: ['localhost:9092'],
})

export default class PixesController {
  public async create({ request, response }: HttpContextContract) {
    const data = request.only(['cpf_sender', 'cpf_receiver', 'amount'])

    const sendPix = await axiosInstance.post('/clients/pix', data)

    if (sendPix.status !== 201) {
      return response.badRequest({ message: sendPix.data.message })
    }

    await Pix.create(data)

    const sender = await axiosInstance.get(`/clients/get-by-cpf/${data.cpf_sender}`)
    const receiver = await axiosInstance.get(`/clients/get-by-cpf/${data.cpf_receiver}`)

    const message = {
      messageData: {
        ssenderEmail: sender.data.email,
        senderName: sender.data.full_name,
        receiverEmail: receiver.data.email,
        receiverName: receiver.data.full_name,
        value: data.amount,
      },
    }

    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })

    await producer.connect()
    await producer.send({
      topic: 'sendEmailToNewPix',
      messages: [{ value: JSON.stringify(message) }],
    })

    return response.created({
      message: 'Pix send with successfuly',
      sender: data.cpf_sender,
      receiver: data.cpf_receiver,
      amount: data.amount,
    })
  }
}
