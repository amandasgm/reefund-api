import { Request, Response } from "express";





class UploadsController {
  
  async create(req: Request, res: Response) {

    res.status(201).json({ message: "File uploaded successfully"});
  }
} 

export { UploadsController };