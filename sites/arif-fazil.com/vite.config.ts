import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { ssgPlugin } from "vite-plugin-ssg"

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ssgPlugin({
      pages: 'src/pages/',
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: 'public',
});
