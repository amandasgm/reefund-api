import { prisma } from "@/database/prisma";
import { Request, Response } from "express";
import { AppError } from "@/utils/AppError";
import { z } from "zod";


const CategoriesEnum = z.enum(["food", "others", "services", "transport", "accommodation"]);

class RefundsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Informe o nome da solicitação" }),
      category: CategoriesEnum,
      amount: z.number().positive({ message: "Informe o valor do reembolso" }),
      filename: z.string().min(20, { message: "Informe o nome do arquivo" }),
    });

    const { name, category, amount, filename } = bodySchema.parse(req.body);

    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const existingRefund = await prisma.refunds.findFirst({
      where: {
        name,
        amount
      }
    });

    if (existingRefund) {
      throw new AppError("A refund with the same name and amount already exists", 400);
    }

    const refund = await prisma.refunds.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: req.user!.id 
      }
    });

    res.status(201).json({ message: "ok", refund });
  }

  async list(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const querySchema = z.object({
      name: z.string().optional().default(""),
    });

    const { name } = querySchema.parse(req.query);
    
    // somente o manager pode ver os reembolsos de todos os funcionários, mas o funcionário só pode ver os seus próprios reembolsos
    const refunds = await prisma.refunds.findMany({
      where: {
        userId: req.user.role === "manager" ? undefined : req.user.id,
        user: {
            name: {
              contains: name.trim(),
          }
        }
      },
      orderBy: { createdAt: "desc" },
      include: {user: true}
    });

    // erro para caso nao exista o usuario buscado
    if (refunds.length === 0) {
      throw new AppError("No refunds found for the given name", 404);
    }

    res.json({ refunds });
  }
}

export { RefundsController };