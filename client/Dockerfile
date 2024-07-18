FROM node:18-alpine

ADD package.json package.json
COPY . .

RUN npm install 

CMD ["npm", "run", "start"]