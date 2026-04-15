# Chatify — Go

Real-time chat app in Go.
**Zero external dependencies** — pure stdlib only (`net/http`, `crypto/sha1`, `encoding/binary`).
The WebSocket handshake and framing are implemented directly per RFC 6455.

## Requirements

- Go 1.22+
- [just](https://github.com/casey/just) (optional)

## Quick start

```bash
just run                  # go run on :3000
just build                # compile → ./chatify binary
just start                # build + run
just run-port 8080        # custom port
PORT=8080 just run        # via env var
```

## Justfile recipes

| Recipe        | What it does                         |
|---------------|--------------------------------------|
| `run`         | `go run` — no binary produced        |
| `build`       | compile → `./chatify`                |
| `start`       | build then run                       |
| `run-port N`  | run on a specific port               |
| `test`        | `go test ./...`                      |
| `fmt`         | `gofmt -w .`                         |
| `vet`         | `go vet ./...`                       |
| `clean`       | remove binary                        |
| `build-all`   | cross-compile to `dist/` (5 targets) |
| `clean-all`   | remove binary + `dist/`              |

## Project layout

```
chatify/
├── cmd/chatify/main.go   # server: RFC 6455 WS + hub + static files
├── public/
│   ├── index.html        # chat UI (Tailwind CDN)
│   └── client.js         # native WebSocket client
├── go.mod                # module chatify — no dependencies
└── justfile
```

## Stack

| Layer     | Original (Bun/TypeScript)  | Go                              |
|-----------|----------------------------|---------------------------------|
| Runtime   | Bun                        | Go stdlib `net/http`            |
| WebSocket | Bun built-in               | RFC 6455, stdlib only           |
| WS route  | `/` (implicit upgrade)     | `/ws`                           |
| Frontend  | unchanged                  | unchanged (1-line patch to `/ws`)|
