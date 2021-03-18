import { h, render, Component } from 'preact';
import Posts from './posts';

class Home extends Component {
	render() {
		return <Posts path="/posts/:id?" />
	}
}

export default Home;