import {Router} from 'express';

import {
    createClient,
    deleteClient,
    getAllClients,
    getClientByCpf,
    getClientById,
    sendPix,
    updateClient,
    verifyCredentials,
} from '../app/Controllers/ClientsController';

const router = Router();

router.post('/', createClient);

router.get('/', getAllClients);

router.get('/:id', getClientById);

router.get('/get-by-cpf/:cpf_number', getClientByCpf);

router.put('/:id', updateClient);

router.delete('/:id', deleteClient);

router.post('/pix', sendPix)

router.post('/verify-credentials', verifyCredentials)

export default router;
