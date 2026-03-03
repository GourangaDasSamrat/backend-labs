# Prisma+MongoDB Lab

## Tech stacks

- Typescript
- Express JS
- Prisma
- Prisma Client
- Json Web Token
- Cookie Parser
- Bcrypt JS
- Cors
- Dotenv

## Installation & Setup

### Prerequisites

- Node.js **v22+**
- A MongoDB connection string (Atlas or local)

### 1. Install dependencies

```zsh
npm i
```

### 2. Configure environment variables

Copy the provided example file and fill in your values:

```zsh
cp .env.example .env
```

| Variable       | Description                        |
| -------------- | ---------------------------------- |
| `PORT`         | Port the server runs on            |
| `DATABASE_URL` | Your MongoDB connection string     |
| `JWT_SECRET`   | Secret key used to sign JWT tokens |

### 3. Push schema to MongoDB

```zsh
npx prisma@6 db push
```

### 4. Generate Prisma Client

```zsh
npx prisma@6 generate
```

### 5. Start the dev server

```zsh
npm run dev
```

> For production, build first with `npm run build`, then `npm start`.

1. Install dependencies:

```zsh
npm i
```

2. Push your schema to MongoDB

```zsh
npx prisma@6 db push
```

3. Generate prisma client

```zsh
npx prisma@6 generate
```
