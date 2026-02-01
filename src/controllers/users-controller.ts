import { Request, Response } from 'express';
import { userRole } from '@prisma/client';
import { z } from 'zod';

class UsersController {
  async create(req: Request, res: Response) {
    // lógica de criação de usuário
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: 'Nome é obrigatório' }),
      email: z.string().email().min(5, { message: 'Email invalido'}).toLowerCase(),
      password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
      role: z.enum([userRole.employee, userRole.manager]).default(userRole.employee),
    }).parse(req.body)

    const { name, email, role, password } = bodySchema;


    


    res.json({ name, email, role, password });
  }

  async list(req: Request, res: Response) {
    // lógica de listagem de usuários
    res.json({ message: 'Listagem de usuários' });
  }
}

export { UsersController };