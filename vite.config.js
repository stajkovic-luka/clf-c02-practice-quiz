import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Vercel automatski prepoznaje Vite projekat:
// build komanda = "vite build", output direktorijum = "dist" — bez ikakve dodatne konfiguracije.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
