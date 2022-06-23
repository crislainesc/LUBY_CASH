import {RequestHandler} from 'express';

import bcrypt from 'bcrypt';

import {Client} from '../models/Client';

export const createClient: RequestHandler = async (request, response, next) => {
    const {average_salary} = request.body;
    const hashedPassword = await bcrypt.hash(request.body.password, 6);

    const clientData = {
        full_name: request.body.full_name,
        email: request.body.email,
        password: hashedPassword,
        phone: request.body.phone,
        cpf_number: request.body.cpf_number,
        address: request.body.address,
        city: request.body.city,
        state: request.body.state,
        zipcode: request.body.zipcode,
        current_balance: 0,
        average_salary: request.body.average_salary,
        status: 'desaproved',
    };

    if (average_salary >= 500) {
        clientData.current_balance = 200;
        clientData.status = 'approved';

        const client = await Client.create(clientData);

        return response.status(201).json(client);
    }

    if (average_salary <= 500) {
        const client = await Client.create(clientData);

        return response.status(201).json(client);
    }
};

export const deleteClient: RequestHandler = async (request, response, next) => {
    const {id} = request.params;

    await Client.destroy({where: {id}});

    return response.status(204).send();
};

export const getAllClients: RequestHandler = async (
    request,
    response,
    next
) => {
    const clients: Client[] = await Client.findAll();

    return response.status(200).json(clients);
};

export const getClientById: RequestHandler = async (
    request,
    response,
    next
) => {
    const {id} = request.params;

    const client: Client | null = await Client.findByPk(id);

    return response.status(200).json(client);
};

export const updateClient: RequestHandler = async (request, response, next) => {
    const {id} = request.params;

    await Client.update({...request.body}, {where: {id}});

    const updatedClient: Client | null = await Client.findByPk(id);

    return response.status(200).json(updatedClient);
};
