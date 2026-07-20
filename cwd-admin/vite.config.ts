import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
	plugins: [vue(), cloudflare()],
	server: {
		host: true,
		port: 1226,
	},
});