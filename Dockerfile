FROM node:alpine
WORKDIR /usr/app


COPY package*.json ./
RUN npm install --production
COPY src .

CMD ["npm", "run", "start"]