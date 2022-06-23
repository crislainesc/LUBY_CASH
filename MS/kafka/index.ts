import {Kafka} from 'kafkajs';

import {
    sendMailForNewClient,
    sendMailForNewApprovedClient,
    sendMailForNewDesaprovedClient,
    sendMailForNewPix,
} from './trasport';

const kafka = new Kafka({
    clientId: 'ms_lubycash',
    brokers: ['localhost:9092'],
});

const adminsTopics = {
    newClient: 'sendEmailToAdminsForNewClient',
};

const clientsTopics = {
    approved: 'sendEmailToApprovedClient',
    desaproved: 'sendEmailToDesaprovedClient',
    newPix: 'sendEmailToNewPix',
};

const consumer_admin = kafka.consumer({groupId: 'admin'});

const consumer_client = kafka.consumer({groupId: 'client'});

export const runSendMailForNewClient = async () => {
    await consumer_admin.connect();
    await consumer_admin.subscribe({topic: adminsTopics.newClient});
    await consumer_admin.run({
        eachMessage: async ({message}) => {
            const {messageData} = JSON.parse(message.value!.toString());
            const {email, username, newClient, status} = messageData;
            sendMailForNewClient(email, username, newClient, status);
        },
    });
};

export const runSendMailForNewApprovedClient = async () => {
    await consumer_client.connect();
    await consumer_client.subscribe({topic: clientsTopics.approved});
    await consumer_client.run({
        eachMessage: async ({message}) => {
            const {messageData} = JSON.parse(message.value!.toString());
            const {email, username, status} = messageData;
            sendMailForNewApprovedClient(email, username, status);
        },
    });
};

export const runSendMailForNewDesaprovedClient = async () => {
    await consumer_client.connect();
    await consumer_client.subscribe({topic: clientsTopics.desaproved});
    await consumer_client.run({
        eachMessage: async ({message}) => {
            const {messageData} = JSON.parse(message.value!.toString());
            const {email, username, status} = messageData;
            sendMailForNewDesaprovedClient(email, username, status);
        },
    });
};

export const runSendMailForNewPix = async () => {
    await consumer_client.connect();
    await consumer_client.subscribe({topic: clientsTopics.newPix});
    await consumer_client.run({
        eachMessage: async ({message}) => {
            const {messageData} = JSON.parse(message.value!.toString());
            const {
                senderEmail,
                senderName,
                receiverEmail,
                receiverName,
                value,
            } = messageData;
            sendMailForNewPix(
                senderEmail,
                senderName,
                receiverEmail,
                receiverName,
                value
            );
        },
    });
};
