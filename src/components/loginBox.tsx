import React, { ChangeEvent, FormEvent } from 'react';
import SocketHandler from '../socketHandler';

export default class LoginBox extends React.Component<{
	color?: string,
	socket: SocketHandler,
}, {
	loginText: string,
	loginColor: string,
}> {

	static defaultProps = {
		color: '#000000',
	};

	constructor(props: any) {
		super(props);

		this.state = {
			loginText: '',
			loginColor: this.props.color,
		};
	}

	render() {
		return <form className='post-box' onSubmit={this.sendLoginForm}>
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
		</form>;
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
}