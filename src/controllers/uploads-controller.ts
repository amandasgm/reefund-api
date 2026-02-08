import { Request, Response } from "express";
import z from "zod";
import { ZodError } from "zod";

import uploadConfig from "@/configs/upload";
import { DiskStorage } from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

class UploadsController {
  
  async create(req: Request, res: Response) {
    const diskStorage = new DiskStorage();

    // manipilando o arquivo dentro da pasta temporaria do multer
    try {
      const fileSchema = z.object({
        filename: z.string().min(1, "O nome do arquivo é obrigatório"),
        mimetype: z.string().refine((type) => uploadConfig.ACCEPTED_FILE_TYPES.includes(type), `Formato de arquivo invalido: ${uploadConfig.ACCEPTED_FILE_TYPES}`),  
        size: z.number().positive().refine((size) => size <= uploadConfig.MAX_FILE_SIZE, `Arquivo excede tamanho maximo de ${uploadConfig.MAX_FILE_SIZE}`),
      }).passthrough()
      
      const file  = fileSchema.parse(req.file)

      // salvar na pasta permanente
      const filename = await diskStorage.saveFile(file.filename)


      res.json({ message: "ok", filename })

    } catch (error) {
      if (error instanceof ZodError) {
        if(req.file){
          // se der erro na validacao, remover o arquivo da pasta temporaria
          await diskStorage.deleteFile(req.file.filename, "tmp")
        }
        throw new AppError(error.issues[0].message)
      }

    }
  } 
}

export { UploadsController};