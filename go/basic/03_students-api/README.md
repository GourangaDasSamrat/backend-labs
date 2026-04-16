# Students API — Go

## Requirements

- Go 1.22+
- [just](https://github.com/casey/just) (optional)
- [air](https://github.com/air-verse/air) (optional)

## Quick start

```bash
just run                  # go run on :3000
just build                # compile → ./app binary
just start                # build + run
just run-port 8080        # custom port
PORT=8080 just run        # via env var
```

## Justfile recipes

| Recipe        | What it does                         |
|---------------|--------------------------------------|
| `run`         | `go run` — no binary produced        |
| `build`       | compile → `./app`                |
| `start`       | build then run                       |
| `dev`  | run dev server with love reload               |
| `test`        | `go test ./...`                      |
| `fmt`         | `gofmt -w .`                         |
| `lint`        | `golangci-lint run`                  |
| `clean`       | remove binary                        |
| `build-all`   | cross-compile to `dist/` (5 targets) |
| `clean-all`   | remove binary + `dist/`              |