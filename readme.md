# Template for back-end using the stack:

Express
Typescript
Jest (+SuperTest, faker)
Prisma

## Prerequisites

-   Node v18.16.0
-   PostgreSQL v14.9

## How to run?

Install dependencies:

```
    npm install
```

Update your enviroment info on .env file.

-   Create two copy of ".env.example" file.
-   Rename those two copies to ".env" and ".env.test"
-   Adjust the file with your information following the example structure.
-   Confirm that your DATABASE_URL string points to different databases.

Generate database and apply migrations:

```
    npm run migrate:dev
```
