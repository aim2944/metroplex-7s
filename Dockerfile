FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
COPY server/prisma ./prisma/

RUN npm install

COPY server/ .

RUN npx prisma generate

RUN npx tsc

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && node dist/index.js"]
