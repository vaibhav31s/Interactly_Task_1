FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expose port 3000
EXPOSE 3000

CMD [ "npm", "start" ]

