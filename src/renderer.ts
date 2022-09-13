// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// ---- TYPES
type VersionKey = 'node' | 'chrome' | 'electron';

declare global {
	interface Window {
		electron: {
			versions: Record<VersionKey, () => string>,
		}
	}
}

// ---- CODE
import * as $ from 'jquery';

$(() => {
	const replaceText = (selector: string, text: string) => {
		const element = $(`#${selector}`);
		if (element)
			element.text(text);
	};

	for (const app of ['node', 'chrome', 'electron'] as VersionKey[])
		replaceText(`${app}-version`, window.electron.versions[app]());
});