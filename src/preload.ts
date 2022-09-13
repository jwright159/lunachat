// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
	versions: {
		node: () => process.versions.node,
		chrome: () => process.versions.chrome,
		electron: () => process.versions.electron,
	},
	// we can also expose variables, not just functions
})