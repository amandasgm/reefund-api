import { Request, Response } from 'express';
import { userRole } from '@prisma/client';
import { prisma } from "@/database/prisma";
import { z } from 'zod';
import { AppError } from '@/utils/AppError';
import { hash } from 'bcrypt';

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

    const userWithSameEmail = await prisma.user.findUnique({ where: { email }})
    if (userWithSameEmail) {
      throw new AppError('Já existe um usuário cadastrado com esse email');
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
      }
    });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  }

  async list(req: Request, res: Response) {
    // lógica de listagem de usuários
    res.json({ message: 'Listagem de usuários' });
  }
}

export { UsersController };