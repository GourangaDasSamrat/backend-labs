# 🚀 Go Course Backend

A clean, modular REST API built with **Go** and **Gorilla Mux**. This project demonstrates a robust "port-hunting" startup logic and a scalable directory structure.

## 🛠 Features

- **Smart Port Allocation:** Automatically finds the next available port if your preferred one is busy.
- **Modular Architecture:** Strict separation between routes, controllers, and models.
- **Environment Driven:** Seamless configuration using `.env` files.
- **Developer Friendly:** Includes a `Makefile` for one-command linting and execution.

## 🏁 Getting Started

### 1. Prerequisites

- [Go](https://golang.org/doc/install) (1.18+)
- `just` (optional, for shortcuts)

### 2. Installation & Setup

- Clone and enter the directory

```bash
git clone https://github.com/GoruangaDasSamrat/backend-labs.git
cd backend-labs/go/01_basic-backend
```

- Setup environment variables

```bash
cp .env.example .env
```

> **Note:** Open the `.env` file and replace the placeholder values with your actual configurations.

- Install dependencies

```bash
go mod tidy
```

### 3. Running the App

You can use the standard Go command or the provided **justfile**:

| Action                   | Command                          |
| :----------------------- | :------------------------------- |
| **Run Server**           | `just run` (or `go run main.go`) |
| **Run Dev Server**       | `just dev` (or `air`)            |
| **Format Code & Tidy**   | `just fmt`                       |
| **Lint Code**            | `just lint`                      |
| **Build**                | `just build`                     |
| **Buuld & Start binary** | `just start`                     |
| **Clean**                | `just clean`                     |

> **Note:** The server defaults to port `8080`. If occupied, it will automatically scan up to 100 subsequent ports to find an open slot. Also jst dynamically detect os and give actual binary name for `start` command.

---

## 🏗 Project Structure

```text
├── main.go           # Application entry point & server initialization
├── routes/           # Route definitions and Gorilla Mux setup
├── controllers/      # Request handlers and business logic
├── models/           # Data structures and schemas
├── utils/            # Helper functions
├── .env              # Local secrets (ignored by git)
├── .env.example      # .env template
└── justfile          # Project automation commands
```

## 🧰 Tech Stack

- **Language:** Go (Golang)
- **Router:** [Gorilla Mux](https://github.com/gorilla/mux)
- **Env Management:** [godotenv](https://github.com/joho/godotenv)
- **Tooling:** GolangCI-Lint, Just, Air
