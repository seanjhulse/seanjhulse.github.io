import { h, render, Component } from 'preact'
import posts from './post_map'

class Single extends Component {
	constructor() {
		super()
		this.state = {
			posts: posts()
		}
	}

	render() {
		const Post = this.state.posts[this.props.id].jsx
		return <Post />;
	}
}

export default Single;