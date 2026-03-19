import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    include: ['src/test/**/*.test.ts'],
    coverage: {
      // you can include other reporters, but 'json-summary' is required, json is recommended
      reporter: ['text', 'json-summary', 'json'],
      // If you want a coverage reports even if your tests are failing, include the reportOnFailure option
      reportOnFailure: true,
    }
  },
  server: {
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true },
      "/usuarios": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
  
})
