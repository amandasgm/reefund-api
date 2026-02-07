import { Router } from 'express';
import { RefundsController } from '@/controllers/refunds-controller';

import { verifyUserAuthorization } from '@/middlewares/verify-user-authorization';

const refundsRoutes = Router();
const refundsController = new RefundsController();

// aqui eu defino quais roles estao autorizadas a acessar essa rota
refundsRoutes.post('/', verifyUserAuthorization(["employee"]), refundsController.create);
// somente o manager pode ver os reembolsos de todos os funcionários, mas o funcionário só pode ver os seus próprios reembolsos
refundsRoutes.get('/', verifyUserAuthorization(["employee","manager"]), refundsController.list);
refundsRoutes.get('/:id', verifyUserAuthorization(["employee","manager"]), refundsController.show);



export { refundsRoutes };