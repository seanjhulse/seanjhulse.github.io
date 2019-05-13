import { h, render, Component } from 'preact';

class Header extends Component {
	render() {
		return (
			<nav>
				<a href="/">Home</a>
				<a href="#/posts">Posts</a>
				<a href="#/about">About</a>
				<h1>Miscellaneous things</h1>
				<p>Prettier than a Git repo. Worse than a tutorial.</p>
			</nav>
		)
	}
}

export default Header;
