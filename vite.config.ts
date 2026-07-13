import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  return {
    server: {
      allowedHosts: ['localhost', '.loca.lt']
    },
    resolve: {
      alias: {
        '@admin-page': isDev
          ? path.resolve(__dirname, './src/pages/Admin/Admin.local.tsx')
          : path.resolve(__dirname, './src/pages/Admin/Admin.public.tsx'),
      }
    },
    plugins: [
      react(),
    {
      name: 'scan-images-api',
      configureServer(server) {
        server.middlewares.use('/api/scan-images', (_req, res) => {
          try {
            const travelDir = path.resolve(__dirname, 'public/images/travel');
            const travelImagesJsonPath = path.resolve(__dirname, 'src/data/travelImages.json');

            let files: string[] = ['default.png'];
            if (fs.existsSync(travelDir)) {
              files = fs.readdirSync(travelDir)
                .filter(file => file !== '.gitkeep' && file !== '.DS_Store' && fs.statSync(path.join(travelDir, file)).isFile());
              
              if (!files.includes('default.png')) {
                files.unshift('default.png');
              } else {
                const idx = files.indexOf('default.png');
                files.splice(idx, 1);
                files.unshift('default.png');
              }
            }

            fs.writeFileSync(travelImagesJsonPath, JSON.stringify(files, null, 2));

            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store'
            });
            res.end(JSON.stringify({ 
              success: true, 
              travelImages: files
            }));
          } catch (error: any) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        });
      }
    }
  ],
  };
})

