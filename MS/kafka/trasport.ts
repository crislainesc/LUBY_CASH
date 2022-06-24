import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: 'd71dc8151dc46b',
        pass: '20202e019926c6',
    },
});

const lubyCashEmail = 'lubycash@labluby.com.br';

export const sendMailForNewApprovedClient = async (
    email: string,
    username: string,
    status: string
) => {
    const message = {
        from: lubyCashEmail,
        to: email,
        subject: 'Welcome to LubyCash!',
        html: `<h3>Hello ${username}</h3>
        <p>
          <p>We have received your request and your status is ${status}</p>
          <p>Thank you for your interest in being part of LubyCash.</p>
          <p>We are happy with your arrival!</p>
        </p>
        `,
    };

    transport.sendMail(message);
};

export const sendMailForNewDisapprovedClient = async (
    email: string,
    username: string,
    status: string
) => {
    const message = {
        from: lubyCashEmail,
        to: email,
        subject: "We don't have good news",
        html: `<h3>Hello ${username}</h3>
        <p>
          <p>We have received your request and your status is ${status}</p>
          <p>Unfortunately you will be our customer.</p>
          <p>Thank you for your interest in being part of LubyCash!</p>
        </p>
        `,
    };

    transport.sendMail(message);
};

export const sendMailForNewClient = async (
    email: string,
    username: string,
    newClient: string,
    status: string
) => {
    const message = {
        from: lubyCashEmail,
        to: email,
        subject: 'New client on board',
        html: `<h3>Hello ${username}</h3>
        <p>
          <p>A new client has been added</p>
          <p>The data has passed the approval belt and the status of ${newClient} is ${status}</p>
          <p>You can perform a search for customer data at any time.</p>
        </p>
        `,
    };

    transport.sendMail(message);
};

export const sendMailForNewPix = async (
    senderEmail: string,
    senderName: string,
    receiverEmail: string,
    receiverName: string,
    value: string
) => {
    const messageToSender = {
        from: lubyCashEmail,
        to: senderEmail,
        subject: 'New pix performed',
        html: `<h3>Hello ${senderName}</h3>
        <p>
          <p>Your pix was successfully performed</p>
          <p>A transfer in the amount of ${value} to ${receiverName}</p>
          <p>Thank you for using our services</p>
        </p>
        `,
    };

    const messageToReceiver = {
        from: lubyCashEmail,
        to: receiverEmail,
        subject: 'New pix received',
        html: `<h3>Hello ${receiverName}</h3>
        <p>
          <p>You got a new pix</p>
          <p>${senderName} sent a pix worth ${value}</p>
          <p>Thank you for using our services</p>
        </p>
        `,
    };

    transport.sendMail(messageToSender);
    transport.sendMail(messageToReceiver);
};
