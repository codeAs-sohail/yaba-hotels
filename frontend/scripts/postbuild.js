import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

const routes = [
  'owner',
  'gallery',
  'feedback',
  'about',
  'branches',
  'menu',
  'contact',
  'home',
  'Yaba7qK29700rest',
];

if (fs.existsSync(distDir)) {
  const indexPath = path.join(distDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  // Copy 404.html
  fs.writeFileSync(path.join(distDir, '404.html'), indexContent);

  // Generate directory index.html for all SPA routes
  for (const route of routes) {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexContent);
  }

  // Ensure _redirects file exists for Netlify / Render static rewrites
  const redirectsPath = path.join(distDir, '_redirects');
  if (!fs.existsSync(redirectsPath)) {
    fs.writeFileSync(redirectsPath, '/*    /index.html   200\n');
  }

  console.log(`[postbuild] Generated static fallbacks for ${routes.length} routes, 404.html, and _redirects.`);
} else {
  console.warn('[postbuild] dist directory does not exist. Run vite build first.');
}
