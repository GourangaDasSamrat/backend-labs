## Tech stack

- Express JS
- Mongoose
- Mongoose Aggregate Paginate
- CORS
- Cookie parser
- bcrypt
- jsonwebtoken

# Dev dependencies

- Prettier

## Start development

### 1. Clone the Repository

```bash
git clone https://github.com/GourangaDasSamrat/backend-labs
cd backend-labs//03_Video-Sharing-App

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Start Server (backend)

```bash
npm run dev

```

## Environment variables

1. Copy `.env.example` to `.env`

```bash
cp .env.example .env

```

2. Fill the `.env` with your actual data

```ts
PORT = YOUR_PORT; // the port you want to start express server, if you didn't fill its automatically chose port 3000

// MongoDB Atlas
MONGODB_URI = YOUR_MONGODB_URL; // your local mongodb url or your mongodb atlas(driver-> mongoose) url

// CORS Origin
CORS_ORIGIN = YOUR_CORS_ORIGIN; // your frontend app url or use * to accept request from anywhere(but its not recommended)

// Access Tokens
ACCESS_TOKEN_SECRET=YOUR_HASH_TOKEN //your hash token(you can use any kinda encryption method)
ACCESS_TOKEN_EXPIRY=YOUR_ACCESS_TOKEN_EXPIRY_TIME // your access token expiry time whatever you want (recommended 1d)

// Refresh Tokes
REFRESH_TOKEN_SECRET=YOUR_HASH_TOKEN //your hash token(you can use any kinda encryption method)
REFRESH_TOKEN_EXPIRY=YOUR_REFRESH_TOKEN_EXPIRY_TIME // your refresh token expiry time whatever you want (recommended 10d)
```
