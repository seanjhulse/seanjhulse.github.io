import { h, render, Component } from 'preact';
import List from './list';
import Single from './single';

class Posts extends Component {
	render() {
		if (this.props.id) {
			return <Single id={this.props.id} />;
		} else {
			return <List />;
		}
	}
}

export default Posts;