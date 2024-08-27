import { defineConfig } from 'astro/config';
import opengraphImages, { presets } from "astro-opengraph-images";
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
// import compress from 'astro-compress'; // TODO removed or replaced?
import icon from "astro-icon";
import fs from 'fs';
import pageInsight from "astro-page-insight";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";

export const config = {
  site: "https://discoverme.igbo.land",
  compressHTML: true,
  integrations: [
    mdx(),
    icon(),
    tailwind({
      applyBaseStyles: false
    }),
    opengraphImages({
      options: {
        fonts: [{
          name: "Roboto",
          weight: 400,
          style: "normal",
          data: fs.readFileSync("node_modules/@fontsource/roboto/files/roboto-latin-400-normal.woff")
        }]
      },
      render: presets.blackAndWhite
    }),
    pageInsight(),
    (await import("astro-compress")).default({
      SVG: false
    }),
    db()
  ],
  vite: {
    optimizeDeps: {
      exclude: ['astro:db', 'oslo'],
    },
  },
  output: 'hybrid',
  adapter: netlify({
      edgeMiddleware: true,
  }),
};

// https://astro.build/config
export default defineConfig(config);