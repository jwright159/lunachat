import React from 'react';
import Post from '../dataclasses/post';

export default class PostList extends React.Component<{
	posts: Post[],
}, {
	isSticky: boolean,
	prevItemsLength: number,
}> {

	scrollDivRef: React.RefObject<HTMLDivElement>;

	constructor(props: any) {
		super(props);

		this.scrollDivRef = React.createRef();

		this.state = {
			isSticky: false,
			prevItemsLength: 0,
		}
	}

	render() {
		return <React.Fragment>
			<div className='post-list' onScroll={this.updateSticky} ref={this.scrollDivRef}>
				{this.props.posts.map((item, i) => (
					<p key={i}>{item.text}</p>
				))}
			</div>
			{!this.state.isSticky &&
				<button className='post-list-bottom-button' onClick={this.scrollToBottom}>Go to bottom</button>
			}
		</React.Fragment>
	}

	componentDidUpdate() {
		if (this.state.isSticky && this.props.posts.length !== this.state.prevItemsLength)
			this.scrollToBottom();
		
		if (this.props.posts.length !== this.state.prevItemsLength)
			this.setState({
				prevItemsLength: this.props.posts.length,
			});

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
		const element = this.scrollDivRef.current;
		element.scrollTo({
			top: element.scrollHeight - element.clientHeight,
			behavior: this.state.isSticky ? 'auto' : 'smooth',
		});
	}
}