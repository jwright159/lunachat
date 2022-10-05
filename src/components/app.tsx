import React, { ReactNode } from 'react';
import Posts from './posts';
import User from '../dataclasses/user';
import Post from '../dataclasses/post';
import SocketHandler from '../socketHandler';
import Login from './login';

export default class App extends React.Component<{}, {
	users: Record<string, User>,
	me: User | null,
	socket: SocketHandler,
	posts: Post[],
}> {

	constructor(props: any) {
		super(props);

		const socket = new SocketHandler('localhost:8000');
		this.registerSocketEvents(socket);

		this.state = {
			users: {},
			me: null,
			socket: socket,
			posts: [],
		};
	}

	render() {
		return <>
			<Posts
				items={this.state.posts}
				socket={this.state.socket}
			/>
			{!this.isLoggedIn() && <Login
				socket={this.state.socket}
			/>}
		</>
	}

	registerSocketEvents = (socket: SocketHandler) => {
		socket.on('open', () => {
			this.addPost("Connected, not logged in");
		});

		socket.on('close', () => {
			this.addPost("Disconnected");
		});

		socket.on('loginSelf', data => {
			data['users'].forEach((userData: any) => {
				const user = new User(userData);
				this.state.users[user.id] = user;
			});
			const me = new User(data['me']);
			this.state.users[me.id] = me;
			this.setState({
				me: me
			});
			this.addPost(<><span style={{color: me.color}}>{me.username}</span> (you) logged in</>);
		});

		socket.on('login', data => {
			const sender = new User(data['user']);
			this.state.users[sender.id] = sender;
			this.addPost(<><span style={{color: sender.color}}>{sender.username}</span> logged in</>);
		});

		socket.on('post', data => {
			const sender = this.state.users[data['user']];
			this.addPost(<><span style={{color: sender.color}}>{sender.username}: {data['text']}</span></>);
			if (sender !== this.state.me)
				new Audio('static/among-us-emergency-meeting.mp3').play();
		});

		socket.on('error', data => {
			console.error(data['error']);
			this.addPost(<><span className='error'>{data['error']}</span></>)
		});
	}

	addPost = (text: ReactNode) => {
		this.setState({
			posts: this.state.posts.concat({
				text: text,
			}),
		});
	}

	isLoggedIn = () => {
		return this.state.me !== null;
	}
}