import { Request, response, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class RefundsController {
  async create(req: Request, res: Response) {

    res.status(201).json({ message: "Reembolso criado com sucesso" });
  }
}

export { RefundsController };