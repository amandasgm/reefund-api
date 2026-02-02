import { Router } from 'express';
import { RefundsController } from '@/controllers/refunds-controller';

import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization';

const refundsRoutes = Router();
const refundsController = new RefundsController();

// aqui eu defino quais roles estao autorizadas a acessar essa rota
refundsRoutes.post('/', verifyUserAuthorization(["manager"]), refundsController.create); 

export { refundsRoutes };