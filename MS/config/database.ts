import {Sequelize} from 'sequelize-typescript';

import {Client} from '../app/models/Client';

const connection = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'lubycash',
    logging: false,
    models: [Client],
});

export default connection;
