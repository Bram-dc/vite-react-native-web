import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const app = document.getElementById('app')
if (!app) {
	throw new Error('Element with id "app" not found')
}

const root = createRoot(app)

root.render(createElement(App))
