import { h, render, Component } from 'preact';
import Header from './layout/header';
import Posts from './pages/posts';
import Home from './pages/home';
import About from './pages/about';
import Router from 'preact-router';
import createHashHistory from 'history/createHashHistory';

class App extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<section>
				<Header />
				<Router history={createHashHistory()}>
					<Home path="/" />
					<Home path="/home" />
					<Posts path="/posts/:id?" />
					<About path="/about" />
				</Router>
			</section>
		)
	}
}

// render an instance of Clock into <body>:
render(<App />, document.getElementById('app'));