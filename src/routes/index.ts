import { Router } from "express"; 
import { usersRouter } from "./users-routes";
import { sessionsRouter } from "./sessions-routes";
import { refundsRoutes } from "./refunds-routes";

const routes = Router();

// Rotas publicas
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);

// Rotas privadas
routes.use("/refunds", refundsRoutes);

export { routes };