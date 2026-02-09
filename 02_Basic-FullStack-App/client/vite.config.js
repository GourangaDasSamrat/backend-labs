import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_JOKE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    plugins: [
      tailwindcss(),
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
  };
});
