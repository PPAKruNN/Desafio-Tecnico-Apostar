# Template for back-end using the stack:

Express
Typescript
Jest (+SuperTest, faker)
Prisma

## Prerequisites

- Node xx.0v
- PostgreSQL xx.0v

## Architecture

- REST Api.
- Layered Archtecture.

## How to run?

When opening the project for the very first time:

Install dependencies:

```
    npm install
```

Update your dependencies on .env file.

- Create a copy of ".env.example" file.
- Rename the copy to ".env".
- Adjust the file with your information following the example structure.
- Create another copy of ".env" and rename it to ".env.test"
- Change the DATABASE_URL database name to a new one.

Generate database and apply migrations:

```
    npm run migrations
```
