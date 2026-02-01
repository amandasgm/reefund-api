import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@/database/prisma';
import { AppError } from '@/utils/AppError';
import {compare} from 'bcrypt';
import { authConfig } from '@/configs/auth';
import { sign } from 'jsonwebtoken';


class SessionsControllers {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email({ message: 'Email inválido' }).min(5, { message: 'Email é obrigatório' }).toLowerCase(),
      password: z.string()
    }).parse(request.body);

    const { email, password } = bodySchema;

    // Lógica de criação de sessão (login) aqui 

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const doesPasswordMatch = await compare(password, user.password);
    if (!doesPasswordMatch) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    
    const token = sign({role: user.role}, secret, {
      subject: user.id,
      expiresIn
    });

    // sem senha na resposta
    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json({ message: 'Sessão criada com sucesso', token, user: userWithoutPassword });
  }
}

export { SessionsControllers };