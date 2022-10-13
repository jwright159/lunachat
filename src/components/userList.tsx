import React from 'react';
import User from '../dataclasses/user';

export default class UserList extends React.Component<{
	users: User[],
}, {}> {

	render() {
		return <div className='user-list'>
			{this.props.users.map((item, i) => (
				<p key={i} style={{color: item.color}}>{item.username}</p>
			))}
		</div>;
	}
}