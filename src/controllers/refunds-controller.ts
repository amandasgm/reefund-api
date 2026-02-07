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
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(req.query);

    // calcular o skip para a paginação
    const skip = (page - 1) * perPage;

    // somente o manager pode ver os reembolsos de todos os funcionários, mas o funcionário só pode ver os seus próprios reembolsos
    const refunds = await prisma.refunds.findMany({
      skip,
      take: perPage,
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

    // total de registros para calcular o total de páginas  
    const totalRefunds = await prisma.refunds.count({
      where: {
        userId: req.user.role === "manager" ? undefined : req.user.id,
        user: {
            name: {
              contains: name.trim(),
          }
        }
      },
    });  
      

    const totalPages = Math.ceil(totalRefunds / perPage);

    res.json({ refunds, pagination: { page, perPage, totalRefunds, totalPages: totalPages > 0 ? totalPages : 1 } });
  }

  async show(req: Request, res: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(req.params);

    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const refund = await prisma.refunds.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!refund) {
      throw new AppError("Refund not found", 404);
    }

    // somente o manager pode ver os reembolsos de todos os funcionários, mas o funcionário só pode ver os seus próprios reembolsos
    if (req.user.role !== "manager" && refund.userId !== req.user.id) {
      throw new AppError("You do not have permission to view this refund", 403);
    }
    res.json({ refund });
  }
}

export { RefundsController };