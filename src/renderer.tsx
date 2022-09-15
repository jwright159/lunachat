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

		const socket = new WebSocket('ws://localhost:8000');
		socket.addEventListener('open', (event) => {
			this.sendLogin('bepisman');
		});

		socket.addEventListener('message', this.recieveMessage);

		socket.addEventListener('close', (event) => {
			this.setState({
				items: this.state.items.concat({
					text: "Disconnected"
				})
			});
		});

		this.state = {
			items: [],
			socket: socket
		};
	}

	render() {
		return <div>
			<button onClick={this.sendDefaultPost}>Ping</button>
			<MessageList items={this.state.items} />
		</div>;
	}

	sendLogin = (username: string) => {
		this.state.socket.send(JSON.stringify({
			type: 'login',
			username: username
		}));
	}

	sendPost = (text: string) => {
		this.state.socket.send(JSON.stringify({
			type: 'post',
			text: text
		}));
	}

	sendDefaultPost = () => {
		this.sendPost('bepis');
	}

	showPost = (text: string) => {
		this.setState({
			items: this.state.items.concat({
				text: text
			})
		});
	}

	recieveMessage = (event: MessageEvent) => {
		const data = JSON.parse(event.data);
		switch(data['type']) {
			case 'login':
				this.showPost(data['username'] + " logged in.");
				break;
			case 'post':
				this.showPost(data['username'] + ": " + data['text']);
				break;
			case 'error':
				console.error(data['error']);
				break;
			default:
				console.error("Invalid type of message " + data['type']);
				break;
		}
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