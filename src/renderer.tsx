import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

// ---- TYPES (since vs code doesn't like .d.ts files)

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

const socket = new WebSocket('ws://localhost:8000');
socket.addEventListener('open', (event) => {
	socket.send('Connected');
});

socket.addEventListener('message', (event) => {
	console.log('Got ' + event.data);
});

socket.addEventListener('close', (event) => {
	console.log('Ok actually we closed');
});

const ping = () => {
	socket.send('bepis');
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<p>We are using
	Node.js {window.electron.versions['node']()},
	Chromium {window.electron.versions['chrome']()}, and
	Electron {window.electron.versions['electron']()}.
</p>);

root.render(<button onClick={ping}>Ping</button>)