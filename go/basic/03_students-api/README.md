# Students API — Go

A learning project demonstrating a students management API built with Go.

## Tech Stack

- **Language:** Go 1.22+
- **Task Runner:** [just](https://github.com/casey/just)
- **Live Reload:** [air](https://github.com/air-verse/air)
- **Linting:** [golangci-lint](https://golangci-lint.run/)
- **Test Generation:** [gotests](https://github.com/cweill/gotests)
- **Vulnerability Scanning:** [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck)

## Requirements

**Core:**

- Go 1.22+
- [just](https://github.com/casey/just)

**Optional (for specific recipes):**

- [air](https://github.com/air-verse/air) — live reload
- [golangci-lint](https://golangci-lint.run/) — linting
- [gotests](https://github.com/cweill/gotests) — test generation
- [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck) — security scanning

## Quick Start

```bash
just dev    # Run with live reload
just test   # Run tests
just lint   # Check code quality
```

## Available Commands

### Development

| Recipe | Description                         |
| ------ | ----------------------------------- |
| `run`  | Run directly without binary         |
| `dev`  | Run with live reload (requires air) |

### Quality & Security

| Recipe | Description                       |
| ------ | --------------------------------- |
| `fmt`  | Format code and tidy dependencies |
| `lint` | Lint all packages                 |
| `vuln` | Scan for vulnerabilities          |
| `test` | Run all tests                     |

### Testing

| Recipe          | Description                           |
| --------------- | ------------------------------------- |
| `test-gen`      | Generate test stubs for all files     |
| `test-gen-file` | Generate test stubs for specific file |

### Build

| Recipe       | Description                            |
| ------------ | -------------------------------------- |
| `build`      | Quick local build → `./app`            |
| `build-prod` | Secure production build                |
| `build-all`  | Cross-compile to `dist/` (6 platforms) |
| `clean`      | Remove binaries and cache              |
