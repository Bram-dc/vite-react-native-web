import flowRemoveTypes from 'flow-remove-types'
import fs from 'node:fs/promises'
import type { Plugin as ESBuildPlugin } from 'esbuild'
import * as esbuild from 'esbuild'

const extensions = [
    // ⚠️ this doesn't work even though .tsx is after .web.tsx
    '.web.mjs',
    '.mjs',
    '.web.js',
    '.js',
    '.web.mts',
    '.mts',
    '.web.ts',
    '.ts',
    '.web.jsx',
    '.jsx',
    '.web.tsx',
    '.tsx',
    '.json',

    // ⚠️ this works
    // '.web.mjs',
    // '.web.js',
    // '.web.mts',
    // '.web.ts',
    // '.web.jsx',
    // '.web.tsx',
    // '.mjs',
    // '.js',
    // '.mts',
    // '.ts',
    // '.jsx',
    // '.tsx',
    // '.json',
]

const scriptPathPattern = /\.(js|jsx|ts|tsx|flow)$/
const nativeLegacyScriptPathPattern = /\.(js|flow)$/

const flowPragmaPattern = /@flow\b/

const loaders = {
	'.js': 'jsx',
	'.flow': 'jsx',
} as const

const getLoader = (path: string) => {
	const ext = `.${path.split('.').pop()}`

	if (ext in loaders) {
		return loaders[ext as keyof typeof loaders]
	}

	return 'default' as const
}

const esbuildPlugin = (): ESBuildPlugin => ({
	name: 'react-native-web',
	setup: (build) => {
		build.onLoad({ filter: scriptPathPattern }, async (args) => {
			let path = args.path

            // We need to manually resolve .web files since the resolveExtensions option does not seem to work properly.
			// const webPath = args.path.replace(/(\.[^/.]+)$/, '.web$1')
			// try {
			// 	await fs.access(webPath)
			// 	path = webPath
			// } catch {}

			let contents = await fs.readFile(path, 'utf-8')
			const loader = getLoader(path)

			if (nativeLegacyScriptPathPattern.test(path) && flowPragmaPattern.test(contents)) {
                const transformed = flowRemoveTypes(contents)
				contents = transformed.toString()
			}

			return {
				contents,
				loader,
			}
		})
	},
})

const result = await esbuild.build({
    entryPoints: ['src/App.tsx'],
    bundle: true,
    plugins: [esbuildPlugin()],
    resolveExtensions: extensions,
    alias: {
        'react-native': 'react-native-web',
    },
    write: false,
})

const output = result.outputFiles?.[0].text
if (!output) {
    throw new Error('No output')
}

console.log('ExpoImage.tsx:', output.includes('node_modules/expo-image/src/ExpoImage.tsx') ? '✅' : '❌')
console.log('ExpoImage.web.tsx:', output.includes('node_modules/expo-image/src/ExpoImage.web.tsx') ? '✅' : '❌')
console.log('Test.tsx:', output.includes('src/Test.tsx') ? '✅' : '❌')
console.log('Test.web.tsx:', output.includes('src/Test.web.tsx') ? '✅' : '❌')