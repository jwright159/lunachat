import React from 'react';
import SocketHandler from '../socketHandler';
import Post from '../dataclasses/post';
import PostList from './postList';
import PostBox from './postBox';

export default class Posts extends React.Component<{
	items: Post[],
	socket: SocketHandler,
}, {}> {

	render() {
		return <div className='posts'>
			<PostList items={this.props.items} />
			<PostBox socket={this.props.socket} />
		</div>;
	}
}