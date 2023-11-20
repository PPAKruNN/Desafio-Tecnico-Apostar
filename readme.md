# Quer apostar quanto?

Backend application for the junior backend developer position technical challenge at Driven. In this application, you can access a betting backend that allows users to register games, place bets on them, and earn money for it!

# Demo

-   [Deploy link](https://desafio-tecnico-l658.onrender.com)

# Stack:

-   Node v18.16.0
-   PostgreSQL v14.9
-   Express
-   Typescript
-   Jest (+SuperTest, faker)
-   Prisma
-   Joi

# How it works?

This project is a REST API for betting on games. It has 3 entities, Game, Bet and Participant, their

## Check the tests:

For running tests, run this command:

```
npm test
```

For check the test coverage, run:

```
npm test -- --coverage
```

## How to run?

Install dependencies by running:

```
    npm install
```

Update your enviroment info on .env file.

-   Create two copies of ".env.example" file.
-   Rename those two copies to ".env" and ".env.test"
-   Adjust the file with your information following the example structure.
-   Confirm that your DATABASE_URL string points to different databases.

Generate database and apply migrations:

```
    npm run migrate:dev
```

Now, run the code in development mode.

```
npm run dev
```

If you want to run in production mode, run the below commands:

Build the project:

```
npm run build
```

and then start the server:

```
node ./dist/src/server.js
```
