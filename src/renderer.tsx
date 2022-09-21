import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';

class User {
	id: string;
	username: string;
	color: string;

	constructor(data: any) {
		this.id = data['id']
		this.username = data['username']
		this.color = data['color']
	}
}

const users: Record<string, User> = {};

interface Post {
	text: ReactNode;
}

class PostList extends React.Component<{
	items: Post[],
}, {
	isSticky: boolean,
}> {

	scrollDivRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);

		this.scrollDivRef = React.createRef();

		this.state = {
			isSticky: false,
		}
	}

	render() {
		return <div className={'post-list' + (this.state.isSticky ? ' sticky' : '')} onScroll={this.updateSticky} ref={this.scrollDivRef}>
			{this.props.items.map((item, i) => (
				<p key={i}>{item.text}</p>
			))}
		</div>
	}

	componentDidUpdate() {
		this.updateSticky();
	}

	isAtBottom = (element: HTMLDivElement) => {
		return element.scrollHeight - element.clientHeight - element.scrollTop < 1;
	}

	updateSticky = () => {
		const isAtBottom = this.isAtBottom(this.scrollDivRef.current);
		if (this.state.isSticky != isAtBottom)
			this.setState({
				isSticky: isAtBottom,
			});
	}

	scrollToBottom = () => {
		
	}
}

class Posts extends React.Component<{
	color?: string,
}, {
	items: Post[],
	socket: WebSocket,
	postText: string,
	loginText: string,
	loginColor: string,
	me: User | null,
}> {

	static defaultProps = {
		color: '#000000',
	}

	constructor(props: any) {
		super(props);

		const socket = new WebSocket('ws://localhost:8000');
		socket.addEventListener('open', (event) => {
			this.showPost("Connected, not logged in");
		});

		socket.addEventListener('message', this.recieveMessage);

		socket.addEventListener('close', (event) => {
			this.showPost("Disconnected");
		});

		this.state = {
			items: [],
			socket: socket,
			postText: '',
			loginText: '',
			loginColor: this.props.color,
			me: null,
		};
	}

	render() {
		return <div className='posts'>
			<PostList items={this.state.items} />
			{this.state.me === null ?
				<form className='post-box' onSubmit={this.sendLoginForm}>
					<input
						className='post-box-input'
						onChange={this.updateLoginBox}
						value={this.state.loginText}
						placeholder='Username'
					/>
					<input
						type='color'
						onChange={this.updateLoginColor}
						value={this.state.loginColor}
					/>
					<button>Login</button>
				</form>
			:
				<form className='post-box' onSubmit={this.sendPostForm}>
					<input
						className='post-box-input'
						onChange={this.updatePostBox}
						value={this.state.postText}
						placeholder='Post'
					/>
					<button>Send</button>
				</form>
			}
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
			case 'loginSelf': {
				data['users'].forEach((userData: any) => {
					const user = new User(userData);
					users[user.id] = user;
				});
				const me = new User(data['me']);
				users[me.id] = me;
				this.setState({
					me: me
				});
				this.showPost(<><span style={{color: me.color}}>{me.username}</span> (you) logged in</>);
				break;
			}

			case 'login': {
				const sender = new User(data['user']);
				users[sender.id] = sender;
				this.showPost(<><span style={{color: sender.color}}>{sender.username}</span> logged in</>);
				break;
			}

			case 'post': {
				const sender = users[data['user']];
				this.showPost(<><span style={{color: sender.color}}>{sender.username}: {data['text']}</span></>);
				break;
			}

			case 'error': {
				console.error(data['error']);
				break;
			}

			default: {
				console.error("Invalid type of message " + data['type']);
				break;
			}
		}
	}
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<>
	<Posts />
</>);