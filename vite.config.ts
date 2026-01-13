import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 5000,
        host: '0.0.0.0',
        allowedHosts: true,
        hmr: { clientPort: 5000 },
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: false,
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                // Preserve original Host header for OAuth callback URL generation
                if (req.headers.host) {
                  proxyReq.setHeader('Host', req.headers.host);
                }
              });
            }
          },
          '/auth': {
            target: 'http://localhost:3001',
            changeOrigin: false,
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                if (req.headers.host) {
                  proxyReq.setHeader('Host', req.headers.host);
                }
              });
            }
          }
        }
      },
      preview: {
        port: 5000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: false,
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                if (req.headers.host) {
                  proxyReq.setHeader('Host', req.headers.host);
                }
              });
            }
          },
          '/auth': {
            target: 'http://localhost:3001',
            changeOrigin: false,
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq, req) => {
                if (req.headers.host) {
                  proxyReq.setHeader('Host', req.headers.host);
                }
              });
            }
          }
        }
      },
      plugins: [
        react(),
        tailwindcss()
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Chunk size warning limit (500KB)
        chunkSizeWarningLimit: 500,
        rollupOptions: {
          output: {
            // Manual chunk splitting for better caching and parallel loading
            manualChunks: (id) => {
              // Vendor chunks - separate React, React Router, and other large dependencies
              if (id.includes('node_modules')) {
                // React and React DOM together (commonly used together)
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                // React Router
                if (id.includes('react-router')) {
                  return 'vendor-router';
                }
                // Other vendor libraries
                return 'vendor';
              }
              
              // Data chunks - separate poetry data files
              if (id.includes('data/poetryData')) {
                return 'data-poetry';
              }
              if (id.includes('data/poeticDevicesData')) {
                return 'data-devices';
              }
              if (id.includes('data/sanchoQuotes')) {
                return 'data-quotes';
              }
              
              // Icon components chunk (many small icon files)
              if (id.includes('components/icons/')) {
                return 'icons';
              }
            }
          }
        },
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Optimize for production
        minify: 'esbuild',
        // Source maps for production debugging (can be disabled for smaller builds)
        sourcemap: false,
      }
    };
});
