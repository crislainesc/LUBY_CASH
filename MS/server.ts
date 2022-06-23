import {json, urlencoded} from 'body-parser';
import express from 'express';

import connection from './config/database';

import clientsRoutes from './routes/clients';

const PORT = process.env.PORT || 4000;
const HOSTNAME = process.env.HOSTNAME || 'http://localhost';

const app = express();

app.use(json());

app.use(urlencoded({extended: true}));

app.use('/clients', clientsRoutes);

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        res.status(500).json({message: err.message});
    }
);

connection
    .sync()
    .then(() => {
        console.log('Database synced successfully');
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(PORT, () => {
    console.log(`Server running successfully ${HOSTNAME}:${PORT}`);
});
