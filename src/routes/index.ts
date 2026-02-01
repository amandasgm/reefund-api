import { Router } from "express"; 
import { usersRouter } from "./users-routes";

const routes = Router();

// Rotas publicas
routes.use("/users", usersRouter);

export { routes };