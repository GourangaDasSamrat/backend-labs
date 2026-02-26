# StreamVault

A full-stack video sharing application.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Installation

```bash
# Install all dependencies from the root
pnpm install
```

### Environment Setup

Copy the example env file and fill in your values:

```bash
cp apps/server/.env.example apps/server/.env
```

### Running the App

```bash
# Run both client and server concurrently
pnpm dev

# Run individually
pnpm dev:client
pnpm dev:server
```

### Production

```bash
# Build the client
pnpm build

# Start the server
pnpm start:server
```
