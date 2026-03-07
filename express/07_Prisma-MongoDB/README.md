# Prisma+MongoDB Lab

## Tech stacks

- Typescript
- Express JS
- Prisma
- Prisma Client
- Json Web Token
- Cookie Parser
- Cors
- Dotenv
- Tsup

## Installation & Setup

### Prerequisites

- Node.js **v22+**
- A MongoDB connection string (Atlas or local)

### 1. Install dependencies

```zsh
npm install
```

### 2. Configure environment variables

Copy the provided example file and fill in your values:

```zsh
cp .env.example .env
```

| Variable               | Description                               |
| ---------------------- | ----------------------------------------- |
| `PORT`                 | Port the server runs on (default: `4000`) |
| `DATABASE_URL`         | Your MongoDB connection string            |
| `JWT_SECRET`           | Secret key used to sign JWT tokens        |
| `JWT_TOKEN_EXPIRES_IN` | Cookie expiry time (default: `1d`)        |

### 3. Generate Prisma Client

```zsh
npm run db:gen
```

### 4. Push schema to MongoDB

Sync your Prisma schema with your MongoDB database:

```zsh
npm run db:push
```

### 5. Development & Production

Run Development Server:

```zsh
npm run dev
```

Production Build:

```zsh
npm run build
npm start
```

## Scripts Overview

| Script    | Description                                     |
| --------- | ----------------------------------------------- |
| `db:gen`  | Manually generate Prisma Client (v6)            |
| `db:push` | Pushes Prisma schema to MongoDB                 |
| `dev`     | Syncs DB, watches files and restarts on changes |
| `build`   | Compiles TS to JS using tsup with minification  |
| `start`   | Runs the compiled production build from `dist/` |
