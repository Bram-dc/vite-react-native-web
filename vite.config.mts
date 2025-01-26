import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import reactNativeWeb from './rnw'

export default defineConfig(() => ({
	plugins: [react(), reactNativeWeb()],
}))
