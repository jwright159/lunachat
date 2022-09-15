import React, { useState } from 'react';
import * as ReactDOM from 'react-dom/client';

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
}

type VersionKey = 'node' | 'chrome' | 'electron';

interface ElectronAPI {
	versions: Record<VersionKey, () => string>,
}

declare global {
	interface Window {
		electron: ElectronAPI
	}
}

interface Message {
	text: string;
}

class MessageList extends React.Component {
	props: {
		items: Message[]
	};

	render() {
		return <ul>
			{this.props.items.map((item, i) => (
				<li key={i}>{item.text}</li>
			))}
		</ul>
	}
}

class Messages extends React.Component {
	state: {
		items: Message[],
		socket: WebSocket,
	};

	constructor(props: {}) {
		super(props);
		this.sendMessage = this.sendMessage.bind(this);
		this.recieveMessage = this.recieveMessage.bind(this);

		const socket = new WebSocket('ws://localhost:8000');
		socket.addEventListener('open', (event) => {
			socket.send('Connected');
		});

		socket.addEventListener('message', this.recieveMessage);

		socket.addEventListener('close', (event) => {
			console.log('Ok actually we closed');
		});

		this.state = {
			items: [],
			socket: socket
		};
	}

	render() {
		return <div>
			<button onClick={this.sendMessage}>Ping</button>
			<MessageList items={this.state.items} />
		</div>;
	}

	sendMessage() {
		this.state.socket.send('ping');
	}

	recieveMessage(event: MessageEvent) {
		this.setState({
			items: this.state.items.concat({
				text: event.data
			})
		});
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<div>
	<p>
		We are using
		Node.js {window.electron.versions['node']()},
		Chromium {window.electron.versions['chrome']()}, and
		Electron {window.electron.versions['electron']()}.
	</p>
	<Messages />
</div>);