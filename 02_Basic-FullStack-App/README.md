# Simple Jokes App

A full-stack application built with a **Monorepo** architecture using **npm workspaces**.

[**Live Preview**](https://blab-2.gdsamrat.qzz.io/)

---

## 🚀 Tech Stack

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS**
- **Axios**

### Backend
- **Express JS**

---

## 📦 Project Structure
This repository is managed as a monorepo. Both the client and server live in the same root directory.
- `/client`: React frontend application.
- `/server`: Node.js Express backend API.

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v7+ for workspace support)

### 1. Clone the Repository
```bash
git clone https://github.com/GourangaDasSamrat/backend-labs
cd backend-labs

```

### 2. Install Dependencies

Since this is a monorepo, you can install all dependencies for both client and server from the root directory:

```bash
npm install

```

### 3. Development

To run the client and server both from the root:


```bash
npm run dev
# Frontend application will be available at http://localhost:5173
# Server will be available at http://localhost:3000 or the port you define in .env file

```


To run the client and server separately from the root:

**Start Frontend (Client):**

```bash
npm run dev:client
# Application will be available at http://localhost:5173

```

**Start Backend Dev Server (Server):**

```bash
npm run dev:server
# Server will be available at http://localhost:3000 or the port you define in .env file

```
**Start Backend (Server):**

```bash
npm run dev:server
# Server will be available at http://localhost:3000 or the port you define in .env file

```

---

## 🏗️ Build & Deployment

### Production Build

To create a production build for the frontend:

```bash
npm run build

```

### Deployment (Vercel)

This project is optimized for deployment on **Vercel** using the root `vercel.json` configuration.

* **Install Command:** `npm install`
* **Build Command:** `npm run build`
* **Output Directory:** `client/dist`
* **Root Directory:** `./`

---

## 🔑 Environment Variables

Create a `.env` file inside the `server` directory:

```bash
PORT=3000
```