import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@core':     resolve(__dirname,'src/core'),
      '@platform': resolve(__dirname,'src/platform'),
      '@libs':     resolve(__dirname,'src/libs'),
      '@features': resolve(__dirname,'src/features'),
      '@products': resolve(__dirname,'src/products'),
      '@rendering':     resolve(__dirname,'src/rendering'),
      '@data-graph':    resolve(__dirname,'src/data-graph'),
      '@federation':    resolve(__dirname,'src/federation'),
      '@realtime':      resolve(__dirname,'src/realtime'),
      '@edge':          resolve(__dirname,'src/edge'),
      '@media':         resolve(__dirname,'src/media'),
      '@scheduling':    resolve(__dirname,'src/scheduling'),
      '@sandbox':       resolve(__dirname,'src/sandbox'),
      '@observability': resolve(__dirname,'src/observability'),
      '@deployment':    resolve(__dirname,'src/deployment'),
      '@build-graph':   resolve(__dirname,'src/build-graph'),
    },
  },
  server: { port: 5173 },
  build: {
    target: 'es2021', sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames:'assets/[name].[hash].js',
        chunkFileNames:'assets/[name].[hash].js',
        assetFileNames:'assets/[name].[hash].[ext]',
        manualChunks(id){
          if(id.includes('node_modules/lit')||id.includes('node_modules/@lit')) return 'vendor-lit';
          if(id.includes('src/core')||id.includes('src/platform')) return 'platform-core';
          if(id.includes('src/libs')) return 'libs';
          if(id.includes('src/features/home'))    return 'feature-home';
          if(id.includes('src/features/watch'))   return 'feature-watch';
          if(id.includes('src/features/search'))  return 'feature-search';
          if(id.includes('src/features/channel')) return 'feature-channel';
        },
      },
    },
  },
});
