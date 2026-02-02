import { verify } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express"
import { authConfig } from "../configs/auth"
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  role: string;
  sub: string;

}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      throw new AppError("Token JWT not found", 401)
    }

    // [Bearer, 56273894350-607958437265143425367485496]
    const [, token] = authHeader.split(" ")

    const { role, sub: user_id } = verify(token, authConfig.jwt.secret) as TokenPayload

    req.user = {
      id: user_id,
      role,
    }

    return next()

  } catch (error) {
    throw new AppError("Invalid token JWT", 401)
  }
}

export { ensureAuthenticated }