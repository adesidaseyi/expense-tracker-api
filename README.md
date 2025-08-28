# expense-tracker-api

> ExpenseShare API (Team Expense Tracker) is a REST API backend application implemented in TypeScript using the [NestJS framework](https://docs.nestjs.com/) where users log shared expenses, categorize them, and view monthly summaries.

---

# Getting started

## Installation

Ensure you have NodeJS and Docker installed

    node --version

    docker --version

Clone the repository

    git clone https://github.com/adesidaseyi/expense-tracker-api

Switch to the repo folder

    cd expense-tracker-api

Install dependencies

    npm install

Create a `.env` file and add your JSON Web Token (JWT) environment variables

    # JWT Authentication Config
    JWT_TOKEN_AUDIENCE=localhost
    JWT_TOKEN_ISSUER=localhost
    JWT_SECRET=your-jwt-super-secret-key
    JWT_ACCESS_TOKEN_TTL=300s

---

## Database

The application makes use of [TypeORM](http://typeorm.io/) for interfacing with a containerized Postgres Database service.

Add your database config variables in the `.env` file

    # Postgres DB Configuration
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    DATABASE_USER=todolistapi
    DATABASE_PASSWORD=your-postgres-db-password
    DATABASE_NAME=localdevdb

Run the docker compose command to start up the database

    docker compose up -d

---

## Start application

- `npm run start`
- Test api with `http://localhost:3000/api` in your favourite browser

---

# Authentication

This applications uses [JSON Web Token (JWT)](https://jwt.io/) to handle authentication. The token is passed with each request using the `Authorization` header. The NestJS `JwtModule` handles the validation and authentication of the token.

---

# Swagger API docs

This applicationmakes use of the NestJS `SwaggerModule` for API documentation. [NestJS Swagger](https://github.com/nestjs/swagger) - [www.swagger.io](https://swagger.io/)
