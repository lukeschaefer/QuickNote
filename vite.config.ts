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
				name: 'quicknote.zip',
				short_name: 'quicknote',
				description: 'Micro note taking web app',
				theme_color: '#0ea5e9',
				background_color: '#0b1020',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				icons: [
					{ src: '/favicon.png', sizes: 'any', type: 'image/png', purpose: 'any' }
				]
			},
			workbox: {
				navigateFallback: '/index.html',
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				globIgnores: ['**/favicon.png']
			}
		})
	]
}) 