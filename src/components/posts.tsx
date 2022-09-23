import React, { ChangeEvent, FormEvent, ReactNode } from 'react';
import SocketHandler from '../socketHandler';
import Post from '../dataclasses/post';
import PostList from './postList';

export default class Posts extends React.Component<{
	color?: string,
	loggedIn: boolean,
	items: Post[],
	socket: SocketHandler
}, {
	postText: string,
	loginText: string,
	loginColor: string,
}> {

	static defaultProps = {
		color: '#000000',
	};

	postListRef: React.RefObject<PostList>;

	constructor(props: any) {
		super(props);

		this.postListRef = React.createRef();

		this.state = {
			postText: '',
			loginText: '',
			loginColor: this.props.color,
		};
	}

	render() {
		return <div className='posts'>
			<PostList
				items={this.props.items}
				ref={this.postListRef}
			/>
			{!this.props.loggedIn ?
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
		this.props.socket.send('login', {
			username: username,
			color: color,
		});
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
		this.props.socket.send('post', {
			text: text,
		});
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
}