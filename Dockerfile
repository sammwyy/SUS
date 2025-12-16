FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=3000
ENV UPLOAD_DIR=/data
ENV PASSWORD=

EXPOSE 3000

CMD ["node", "server.js"]