# 🚀 Go Course Backend

A clean, modular REST API built with **Go** and **Gorilla Mux**. This project demonstrates a robust "port-hunting" startup logic and a scalable directory structure.

## 🛠 Features

* **Smart Port Allocation:** Automatically finds the next available port if your preferred one is busy.
* **Modular Architecture:** Strict separation between routes, controllers, and models.
* **Environment Driven:** Seamless configuration using `.env` files.
* **Developer Friendly:** Includes a `Makefile` for one-command linting and execution.

## 🏁 Getting Started

### 1. Prerequisites
* [Go](https://golang.org/doc/install) (1.18+)
* `make` (optional, for shortcuts)

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
> **Note:** Open the `.env` file and replace the placeholder values with your actual configurations (e.g., DB credentials, API keys, etc.).

- Install dependencies
```bash
go mod tidy
```

### 3. Running the App
You can use the standard Go command or the provided **Makefile**:

| Action | Command |
| :--- | :--- |
| **Run Server** | `make run` (or `go run main.go`) |
| **Format Code** | `make fmt` |
| **Lint Code** | `make lint` |
| **Tidy & Run** | `make dev` |

> **Note:** The server defaults to port `8080`. If occupied, it will automatically scan up to 100 subsequent ports to find an open slot.

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
└── Makefile          # Project automation commands
```

## 🧰 Tech Stack

* **Language:** Go (Golang)
* **Router:** [Gorilla Mux](https://github.com/gorilla/mux)
* **Env Management:** [godotenv](https://github.com/joho/godotenv)
* **Tooling:** GolangCI-Lint, Make
