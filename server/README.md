# Server web Aptis


# Version NodeJS

20.12.0

# Version Package Management Tool: yarn

1.22.22



# Overview
This is Monorepo using Turborepo as the management tool.



## 1. Install dependencies

`yarn install`

## 2. Create `.env` file base on `.sample.env` of each `apps`

## 3. Generate DB
### Make sure you installed Mongodb

## 4. Run Server

`yarn start`


## 5. Create user


### Find file `access.post.http` inside folder `postman` and Copy api Paste postman to creat the first user

Because of Prisma require interactive environment, so you need migrate each app manually
Go to each apps directory:

Ex: `cd apps/react-admin`

`npx prisma migrate dev`

# Docker

## Run server by Docker

## Step1 : install Docker to My computer
## Step2 : find folder Docker
 ### `cd .\server\Docker\ `
## Step3 : Build Docker compose
 ## `docker-compose -f docker-compose.dev.yml up -d`

## Step4: Create user

### Find file `access.post.http` inside folder `postman` and Copy api Paste postman to creat the first user