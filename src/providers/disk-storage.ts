import fs from "node:fs"
import path from "node:path"

import uploadConfig from "@/configs/upload"

class DiskStorage {
  async saveFile(file:string){
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file) // pasta temporaria onde o multer salva os arquivos
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file) // pasta final onde os arquivos serão movidos

    try {
      // verificar se o arquivo existe na pasta temporaria
      await fs.promises.access(tmpPath)
    } catch (error) {
      throw new Error(`Arquivo nao encontrado: ${tmpPath}`);
    }
    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true }) // garante que existe a pasta de uploads, caso nao exista ele cria
    await fs.promises.rename(tmpPath, destPath) // move o arquivo da pasta temporaria para a pasta de uploads
    return file;
  }

  async deleteFile(file: string, type: "tmp" | "upload"){
    const pathFile = 
      type === "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER
    const filePath = path.resolve(pathFile, file)

    try {
      // verificar se o arquivo existe na pasta
      await fs.promises.stat(filePath)
    } catch {
      return
    }

    await fs.promises.unlink(filePath) // remove o arquivo
  }
}

export { DiskStorage }


