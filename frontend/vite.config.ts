import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; 
import path from "path";
;

export default defineConfig(({ mode }) => ({
  
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
   
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));