# Stack:

Express
Typescript
Jest (+SuperTest, faker)
Prisma

## Prerequisites

-   Node v18.16.0
-   PostgreSQL v14.9

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

### Short Path:

Update your enviroment info on .env file.

-   Create two copy of ".env.example" file.
-   Rename those two copies to ".env" and ".env.test"
-   Adjust the file with your information following the example structure.
-   Confirm that your DATABASE_URL string points to different databases.

Run setup command:

```
npm run setup
```

Start server for testing:

```
npm run start
```

### If Short Path don't work, try this:

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

Now, run the code

```
npm run dev
```

Or Build and run the code:

```
npm run build
```

and then run the code

```
node ./dist/src/server.js
```
