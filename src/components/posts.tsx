import React from 'react';
import SocketHandler from '../socketHandler';
import Post from '../dataclasses/post';
import PostList from './postList';
import PostBox from './postBox';
import LoginBox from './loginBox';

export default class Posts extends React.Component<{
	loggedIn: boolean,
	items: Post[],
	socket: SocketHandler,
}, {}> {

	render() {
		return <div className='posts'>
			<PostList items={this.props.items} />
			{!this.props.loggedIn ? <LoginBox socket={this.props.socket} /> : <PostBox socket={this.props.socket} />}
		</div>;
	}
}