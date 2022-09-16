import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';

declare namespace JSX {
	interface IntrinsicElements {
		[elemName: string]: any;
	}
}

interface Message {
	text: ReactNode;
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
		postText: string,
		loginText: string,
		loginColor: string,
		loggedInUsername: string | null,
	};

	constructor(props: {}) {
		super(props);

		const socket = new WebSocket('ws://localhost:8000');
		socket.addEventListener('open', (event) => {
			this.showPost("Connected, not logged in");
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
			socket: socket,
			postText: '',
			loginText: '',
			loginColor: '#000000',
			loggedInUsername: null,
		};
	}

	render() {
		return <div>
			{this.state.loggedInUsername === null ?
				<form onSubmit={this.sendLoginForm}>
					<input
						id='login-box'
						onChange={this.updateLoginBox}
						value={this.state.loginText}
						placeholder='Username'
					/>
					<input
						id='login-color'
						type='color'
						onChange={this.updateLoginColor}
						value={this.state.loginColor}
					/>
					<button>Login</button>
				</form>
			:
				<form onSubmit={this.sendPostForm}>
					<input
						id='login-box'
						onChange={this.updatePostBox}
						value={this.state.postText}
						placeholder='Message'
					/>
					<button>Send</button>
				</form>
			}
			<MessageList items={this.state.items} />
		</div>;
	}

	updateLoginBox = (event: ChangeEvent) => {
		this.setState({
			loginText: (event.target as any).value,
		});
	}

	updateLoginColor = (event: ChangeEvent) => {
		this.setState({
			loginColor: (event.target as any).value,
		});
	}

	sendLogin = (username: string, color: string) => {
		this.state.socket.send(JSON.stringify({
			type: 'login',
			username: username,
			color: color,
		}));
	}

	sendLoginForm = (event: FormEvent) => {
		event.preventDefault();
		if (this.state.loginText.length === 0)
			return;
		this.sendLogin(this.state.loginText, this.state.loginColor);
		this.setState({
			loginText: '',
		});
	}

	updatePostBox = (event: ChangeEvent) => {
		this.setState({
			postText: (event.target as any).value,
		});
	}

	sendPost = (text: string) => {
		this.state.socket.send(JSON.stringify({
			type: 'post',
			text: text,
		}));
	}

	sendPostForm = (event: FormEvent) => {
		event.preventDefault();
		if (this.state.postText.length === 0)
			return;
		this.sendPost(this.state.postText);
		this.setState({
			postText: '',
		});
	}

	showPost = (text: ReactNode) => {
		this.setState({
			items: this.state.items.concat({
				text: text,
			})
		});
	}

	recieveMessage = (event: MessageEvent) => {
		const data = JSON.parse(event.data);
		console.log(data)
		switch(data['type']) {
			case 'loginSelf':
				this.setState({
					loggedInUsername: data['username']
				});
				this.showPost(<p><span style={{color: data['color']}}>{data['username']}</span> (you) logged in</p>);
				break;
				
			case 'login':
				this.showPost(<p><span style={{color: data['color']}}>{data['username']}</span> logged in</p>);
				break;

			case 'post':
				this.showPost(<p><span style={{color: data['color']}}>{data['username']}: {data['text']}</span></p>);
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
	<Messages />
</div>);