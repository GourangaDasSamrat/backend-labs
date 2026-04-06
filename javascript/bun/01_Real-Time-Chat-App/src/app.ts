import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { Server, ServerWebSocket } from "bun";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const port: number = Number(process.env.PORT) || 3000;

const publicDir: string = path.join(__dirname, "..", "public");

// Track all connected WebSocket clients
const clients = new Set<ServerWebSocket<unknown>>();

export const server: Server = Bun.serve({
  port,

  websocket: {
    open(ws: ServerWebSocket<unknown>): void {
      clients.add(ws);
    },

    message(ws: ServerWebSocket<unknown>, message: string | Buffer): void {
      const text = typeof message === "string" ? message : message.toString();
      // Broadcast to all OTHER clients (exclude sender)
      for (const client of clients) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(text);
        }
      }
    },

    close(ws: ServerWebSocket<unknown>): void {
      clients.delete(ws);
    },
  },

  async fetch(req: Request): Promise<Response | undefined> {
    const url = new URL(req.url);

    // Upgrade WebSocket connections
    if (req.headers.get("upgrade") === "websocket") {
      const upgraded = server.upgrade(req);
      if (upgraded) return undefined;
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    // Serve static files from /public
    const filePath: string =
      url.pathname === "/" ? "/index.html" : url.pathname;

    const fullPath: string = path.join(publicDir, filePath);
    const file = Bun.file(fullPath);
    const exists: boolean = await file.exists();

    if (exists) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
});
