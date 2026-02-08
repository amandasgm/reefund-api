# Reefund-API

<p>
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
</p>


Uma API REST para cadastro e gerenciamento de **reembolsos**, construída com **Node.js**, **TypeScript**, **Express**, **Prisma** e **Zod**.

Essa API permite:
✔️ Cadastrar reembolsos com nome, categoria e valor  
✔ Fazer upload de comprovantes  
✔ Validar entradas com Zod  
✔ Salvar arquivos via Multer e mover para armazenamento local  
✔ Autorização por função (ex.: managers)  
✔ Paginação e filtros básicos (quando aplicados)

## Tecnologias e funçoões
- Node => Runtime
- Express => Framework HTTP
- TypeScript => Tipagem estatica
- Prisma => ORM
- Zod => Validação de dados
- Multer => Upload de arquivos
- DiskStorage => Provider de storage local

 ## Upload de Arquivos
Arquivos são inicialmente salvos em uma pasta temporária com Multer e depois movidos para UPLOADS_FOLDER com o provider DiskStorage.
Esse provider também permite deletar arquivos quando necessário.

## Autorização
O middleware verifyUserAuthorization restringe acesso com base em roles (ex.: only “manager”).
