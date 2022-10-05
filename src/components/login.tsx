import React, { ChangeEvent, FormEvent } from 'react';
import SocketHandler from '../socketHandler';

export default class Login extends React.Component<{
	socket: SocketHandler,
}, {
	usernameText: string,
	passwordText: string,
}> {

	constructor(props: any) {
		super(props);

		this.state = {
			usernameText: '',
			passwordText: '',
		};
	}

	render() {
		return <form className='login-box' onSubmit={this.sendLoginForm}>
			<input
				className='username'
				onChange={this.updateUsernameBox}
				value={this.state.usernameText}
				placeholder='Username'
			/>
			<input
				className='password'
				onChange={this.updatePasswordBox}
				value={this.state.passwordText}
				placeholder='Password'
			/>
			<input type='submit' name='login' value='Login' />
			<input type='submit' name='register' value='Register' />
		</form>;
	}

	updateUsernameBox = (event: ChangeEvent) => {
		this.setState({
			usernameText: (event.target as any).value,
		});
	}

	updatePasswordBox = (event: ChangeEvent) => {
		this.setState({
			passwordText: (event.target as any).value,
		});
	}

	sendLogin = (username: string, password: string) => {
		this.props.socket.send('login', {
			username: username,
			password: password,
		});
	}

	sendRegister = (username: string, password: string) => {
		this.props.socket.send('register', {
			username: username,
			password: password,
		});
	}

	sendLoginForm = (event: FormEvent) => {
		event.preventDefault();
		
		if (this.state.usernameText.length === 0 || this.state.passwordText.length === 0)
			return;

		const operation = ((event.nativeEvent as SubmitEvent).submitter as HTMLInputElement).name;
		if (operation === 'login')
			this.sendLogin(this.state.usernameText, this.state.passwordText);
		else if (operation === 'register')
			this.sendRegister(this.state.usernameText, this.state.passwordText);
		else
			throw new Error(`Invalid login operation ${operation}`);

		this.setState({
			passwordText: '',
		});
	}
}