// ---- TYPES

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
}

type VersionKey = 'node' | 'chrome' | 'electron';

export interface ElectronAPI {
	versions: Record<VersionKey, () => string>,
}

declare global {
	interface Window {
		electron: ElectronAPI
	}
}

// ---- CODE

$(() => {
	const replaceText = (selector: string, text: string) => {
		const element = $(`#${selector}`);
		if (element)
			element.text(text);
	};

	for (const app of ['node', 'chrome', 'electron'] as VersionKey[])
		replaceText(`${app}-version`, window.electron.versions[app]());
});