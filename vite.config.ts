import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-icons': ['@phosphor-icons/react'],
          'vendor-utils': ['date-fns', 'sonner', 'clsx', 'tailwind-merge'],
          // Application chunks
          'pages': [
            './src/components/pages/HomePage',
            './src/components/pages/ServicesPage',
            './src/components/pages/AboutPage',
            './src/components/pages/GalleryPage',
            './src/components/pages/BlogPage',
            './src/components/pages/CharityPage',
            './src/components/pages/TestimonialsPage',
            './src/components/pages/ContactPage'
          ],
          'admin': [
            './src/components/pages/AdminPage',
            './src/components/pages/TermsPage',
            './src/components/pages/PrivacyPage'
          ]
        }
      }
    }
  }
});
