FROM node:20

WORKDIR /app

COPY app/package*.json ./

RUN npm install --include=dev

COPY app/ .

# RUN npm run build

# RUN npm install -g serve

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
