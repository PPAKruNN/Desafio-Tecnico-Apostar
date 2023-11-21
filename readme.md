# Quer apostar quanto?

Aplicação de backend para o desafio técnico da posição de desenvolvedor backend júnior na Driven. Nesta aplicação, você pode acessar um backend de apostas que permite aos usuários registrar jogos, fazer apostas neles e ganhar dinheiro com isso!

# Demonstração

-   [Link de implantação](https://desafio-tecnico-l658.onrender.com)

# Tecnologias Utilizadas:

-   Node v18.16.0
-   PostgreSQL v14.9
-   Express
-   Typescript
-   Jest (+SuperTest, faker)
-   Prisma
-   Joi

# Como funciona?

Este projeto consiste em uma API REST para apostas em jogos. Ele possui 3 entidades: Jogo, Aposta e Participante.

### **POST** `/participants`

-   Cria um participante com um saldo inicial específico.
-   **Entrada**: nome e saldo inicial do participante.
    ```tsx
    {
        name: string;
        balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    }
    ```
-   **Saída**: objeto do participante criado.
    ```tsx
    {
        id: number;
        createdAt: string;
        updatedAt: string;
        name: string;
        balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
    }
    ```

### **POST** `/games`

-   Cria um novo jogo, com placar inicial 0x0 e marcado como não finalizado.
-   **Entrada**: nome do time da casa e do time visitante.
    ```tsx
    {
        homeTeamName: string;
        awayTeamName: string;
    }
    ```
-   **Saída**: o objeto do jogo criado.
    ```tsx
    {
        id: number;
        createdAt: string;
        updatedAt: string;
        homeTeamName: string;
        awayTeamName: string;
        homeTeamScore: number; // inicialmente 0
        awayTeamScore: number; // inicialmente 0
        isFinished: boolean; // inicialmente false
    }
    ```

### **POST** `/bets`

-   Registra uma aposta de um participante em um determinado jogo. O valor da aposta é descontado imediatamente do saldo do participante.
-   **Entrada**:
    ```tsx
    {
        homeTeamScore: number;
        awayTeamScore: number;
        amountBet: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
        gameId: number;
        participantId: number;
    }
    ```
-   **Saída**: o objeto da aposta criada.
    ```tsx
    {
        id: number;
        createdAt: string;
        updatedAt: string;
        homeTeamScore: number;
        awayTeamScore: number;
        amountBet: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
        gameId: number;
        participantId: number;
        status: string; // podendo ser PENDING, WON ou LOST
        amountWon: number || null; // nulo quando a aposta ainda está PENDING; número caso a aposta já esteja WON ou LOST, com o valor ganho representado em centavos
    }
    ```

### **POST** `/games/:id/finish`

-   Finaliza um jogo e atualiza todas as apostas vinculadas a ele, calculando o valor ganho em cada uma e atualizando o saldo dos participantes vencedores.
-   **Entrada**: placar final do jogo.
    ```tsx
    {
        homeTeamScore: number;
        awayTeamScore: number;
    }
    ```
-   **Saída**: o objeto do jogo atualizado.
    ```tsx
    {
        id: number;
        createdAt: string;
        updatedAt: string;
        homeTeamName: string;
        awayTeamName: string;
        homeTeamScore: number;
        awayTeamScore: number;
        isFinished: boolean;
    }
    ```

### **GET** `/participants`

-   Retorna todos os participantes e seus respectivos saldos.
-   **Saída**: array de todos os participantes.
    ```tsx
    [
        {
            id: number;
            createdAt: string;
            updatedAt: string;
            name: string;
            balance: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
        },
        {...}
    ]
    ```

### **GET** `/games`

-   Retorna todos os jogos cadastrados.
-   **Saída**: array de todos os jogos
    ```tsx
    [
        {
            id: number;
            createdAt: string;
            updatedAt: string;
            homeTeamName: string;
            awayTeamName: string;
            homeTeamScore: number;
            awayTeamScore: number;
            isFinished: boolean;
        },
        {...}
    ]
    ```

### **GET** `/games/:id`

-   Retorna os dados de um jogo junto com as apostas vinculadas a ele.
-   **Saída**: o objeto do jogo contendo a array de apostas realizadas nele.
    ```tsx
    {
        id: number;
        createdAt: string;
        updatedAt: string;
        homeTeamName: string;
        awayTeamName: string;
        homeTeamScore: number;
        awayTeamScore: number;
        isFinished: boolean;
        bets: [
            {
                id: number;
                createdAt: string;
                updatedAt: string;
                homeTeamScore: number;
                awayTeamScore: number;
                amountBet: number; // representado em centavos, ou seja, R$ 10,00 -> 1000
                gameId: number;
                participantId: number;
                status: string; // podendo ser PENDING, WON ou LOST
                amountWon: number || null; // nulo quando a aposta ainda está PENDING; número caso a aposta já esteja WON ou LOST, com o valor ganho representado em centavos
            },
            {...}
        ]
    }
    ```

## Verifique os testes:

Para executar os testes, use este comando:

```

npm test

```

Para verificar a cobertura dos testes, execute:

```

npm test -- --coverage

```

## Como executar?

Instale as dependências executando:

```

npm install

```

Atualize as informações do seu ambiente no arquivo .env.

-   Crie duas cópias do arquivo ".env.example".
-   Renomeie essas duas cópias para ".env" e ".env.test".
-   Ajuste o arquivo com suas informações seguindo a estrutura de exemplo.
-   Confirme se sua string DATABASE_URL aponta para bancos de dados diferentes.

Gere o banco de dados e aplique as migrações:

```

npm run migrate:dev

```

Agora, execute o código em modo de desenvolvimento.

```

npm run dev

```

Se desejar executar em modo de produção, execute os comandos abaixo:

Faça a build do projeto:

```

npm run build

```

e em seguida inicie o servidor:

```

node ./dist/src/server.js

```
