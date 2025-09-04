import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
	plugins: [
		viteSingleFile(),
		VitePWA({
			registerType: 'autoUpdate',
			injectRegister: 'auto',
			manifest: {
				name: 'breathe.zip',
				short_name: 'breathe',
				description: 'Box-breathing web app',
				theme_color: '#0ea5e9',
				background_color: '#0b1020',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				icons: [
					{ src: '/vite.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
				]
			},
			workbox: {
				navigateFallback: '/index.html',
				globPatterns: ['**/*.{js,css,html,svg,png,ico}']
			}
		})
	]
}) 