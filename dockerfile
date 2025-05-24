FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g nodemon

COPY controllers/   /app/controllers/
COPY middleware/    /app/middleware/
COPY models/        /app/models/
COPY public/        /app/public/
COPY routes/        /app/routes/
COPY util/          /app/util/
COPY views/         /app/views/
COPY app.js         ./app.js

CMD ["npm", "start"]