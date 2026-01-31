// para lidar com erros de forma centralizada
import { AppError } from '@/utils/AppError';
import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

export const  errorHandling: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return
  }

  if (err instanceof ZodError){
    res.status(400).json({ message: "Validation error", issues: err.format() });
    return
  }
}