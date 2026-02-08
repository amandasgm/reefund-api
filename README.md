# Reefund-API

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
