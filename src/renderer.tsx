import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

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

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<p>We are using
	Node.js {window.electron.versions['node']()},
	Chromium {window.electron.versions['chrome']()}, and
	Electron {window.electron.versions['electron']()}.
</p>);