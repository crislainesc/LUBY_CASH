import {RequestHandler, response} from 'express';

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
        status: 'disapproved',
        created_at: new Date(),
        updated_at: new Date(),
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

export const getClientByCpf: RequestHandler = async (
    request,
    response,
    next
) => {
    const {cpf_number} = request.params;

    const client = await Client.findOne({
        where: {cpf_number: cpf_number},
    });

    return response.status(200).json(client);
};

export const updateClient: RequestHandler = async (request, response, next) => {
    const {id} = request.params;

    await Client.update(
        {...request.body, updated_at: new Date()},
        {where: {id}}
    );

    const updatedClient: Client | null = await Client.findByPk(id);

    return response.status(200).json(updatedClient);
};

export const verifyCredentials: RequestHandler = async (
    request,
    response,
    next
) => {
    const {email, password} = request.body;

    const client: Client | null = await Client.findOne({
        where: {email: email},
    });

    const comparePasswords = await bcrypt.compare(password, client!.password);

    if (comparePasswords) {
        return response.status(200).json(client);
    } else {
        return response.status(200).json(null);
    }
};

export const sendPix: RequestHandler = async (request, response, next) => {
    const {cpf_sender, cpf_receiver, amount} = request.body;

    const sender = await Client.findOne({where: {cpf_number: cpf_sender}});

    const receiver = await Client.findOne({where: {cpf_number: cpf_receiver}});

    if (sender!.current_balance < amount) {
        return response.status(200).json({
            message:
                'Unable to perform the pix. The amount is greater than the available balance. No amounts have been deducted.',
        });
    }

    if (
        sender!.status === 'disapproved' ||
        receiver!.status === 'disapproved'
    ) {
        return response.status(200).json({
            message:
                'These customers are not authorized to perform this type of service.',
        });
    }

    await Client.update(
        {current_balance: sender!.current_balance - amount},
        {where: {id: sender!.id}}
    );

    await Client.update(
        {current_balance: receiver!.current_balance + amount},
        {where: {id: receiver!.id}}
    );

    return response
        .status(201)
        .json({message: 'Transfer performed successfully'});
};
