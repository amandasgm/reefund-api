import { Router } from "express";

import { SessionsControllers } from "../controllers/sessions-controllers";

const sessionsRouter = Router();
const sessionsControllers = new SessionsControllers();

sessionsRouter.post("/", sessionsControllers.create);

export { sessionsRouter };