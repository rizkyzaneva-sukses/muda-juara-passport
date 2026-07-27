FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000
CMD ["sh", "-c", "node node_modules/prisma/build/index.js db push --schema=prisma/schema.prisma --skip-generate 2>&1; npm start"]
