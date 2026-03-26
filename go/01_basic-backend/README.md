# Simple Course Backend

A clean, modular Go backend built with **Gorilla Mux**. This project is structured to separate concerns, making it easy to maintain and scale.

## 🚀 How to Start

### 1. Install Dependencies
Ensure you have Go installed, then run:
```bash
go mod tidy
```

### 2. Run the Server
Execute the main entry point:
```bash
go run main.go
```
The server will be live at `http://localhost:8080`.

---

## 🏗 File structure

* **`main.go`**: The entry point. It only initializes and starts the server.
* **`routes/`**: Isolated routing logic using Gorilla Mux. Keeps your URL paths organized in one place.
* **`controllers/`**: The "brain" of the app. Contains the actual logic for handling requests.
* **`utils/`**: Shared helpers that handle various mini things
* **`models/`**: Defines the data structures (schemas) used across the application.

---

## 🛠 Tech Stack
* **Language:** Go
* **Router:** Gorilla Mux