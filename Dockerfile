FROM node:14.17.0

RUN mkdir /app
WORKDIR /app

COPY package*.json ./
RUN ["yarn", "install", "--unsafe-perm"]

COPY tsconfig.json ./
COPY src ./src/
RUN ["yarn", "build-only"]

EXPOSE 3901/tcp
CMD ["npm", "start"]