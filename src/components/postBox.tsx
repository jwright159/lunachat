import React, { ChangeEvent, FormEvent } from 'react';
import SocketHandler from '../socketHandler';

export default class PostBox extends React.Component<{
	socket: SocketHandler,
}, {
	postText: string,
}> {

	constructor(props: any) {
		super(props);

		this.state = {
			postText: '',
		};
	}

	render() {
		return <form className='post-box' onSubmit={this.sendPostForm}>
			<input
				className='post-box-input'
				onChange={this.updatePostBox}
				value={this.state.postText}
				placeholder='Post'
			/>
			<button>Send</button>
		</form>;
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