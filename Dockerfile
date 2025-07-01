# Usa imagem oficial do Node
FROM node:18-alpine

# Define pasta de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência primeiro
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --omit=dev

# Copia o restante do projeto
COPY . .

# Expõe a porta
EXPOSE 3000

# Comando que inicia o servidor
CMD ["npm", "start"]
