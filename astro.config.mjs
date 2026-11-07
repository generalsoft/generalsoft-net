import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Custom domain served by GitHub Pages (see public/CNAME).
  site: 'https://generalsoft.net',
  integrations: [tailwind()],
});

