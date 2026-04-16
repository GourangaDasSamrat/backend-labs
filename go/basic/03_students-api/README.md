# Students API — Go

## Requirements

**Core:**
- Go 1.22+

**Optional (for justfile recipes):**
- [just](https://github.com/casey/just) — task runner
- [air](https://github.com/air-verse/air) — live reload (`dev` recipe)
- [golangci-lint](https://golangci-lint.run/) — linting (`lint` recipe)
- [gotests](https://github.com/cweill/gotests) — test generation (`test-gen`, `test-gen-file` recipes)



## Justfile recipes

| Recipe            | What it does                         |
|-------------------|--------------------------------------|
| `run`             | `go run` — no binary produced        |
| `build`           | compile → `./app`                   |
| `start`           | build then run                       |
| `dev`             | run dev server with live reload     |
| `test`            | `go test -v ./...` — run all tests  |
| `test-gen`        | generate test stubs for all files   |
| `test-gen-file`   | generate test stubs for specific file (takes file path as argument) |
| `fmt`             | `gofmt -w .`                         |
| `lint`            | `golangci-lint run`                  |
| `clean`           | remove binary, dist/, and tmp/      |
| `build-all`       | cross-compile to `dist/` (5 targets) |