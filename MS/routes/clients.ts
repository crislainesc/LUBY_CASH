import {Router} from 'express';

import {
    createClient,
    deleteClient,
    getAllClients,
    getClientById,
    updateClient,
} from '../app/Controllers/ClientsController';

const router = Router();

router.post('/', createClient);

router.get('/', getAllClients);

router.get('/:id', getClientById);

router.put('/:id', updateClient);

router.delete('/:id', deleteClient);

export default router;
