import React from 'react';
import SocketHandler from '../socketHandler';
import Post from '../dataclasses/post';
import PostList from './postList';
import PostBox from './postBox';

export default class Posts extends React.Component<{
	posts: Post[],
	socket: SocketHandler,
	isLoggedIn: boolean,
}, {}> {

	render() {
		return <div className='posts'>
			<PostList posts={this.props.posts} />
			{this.props.isLoggedIn && <PostBox socket={this.props.socket} />}
		</div>;
	}
}