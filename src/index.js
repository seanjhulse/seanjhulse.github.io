import { h, render, Component } from 'preact';
import Header from './layout/header';
import Posts from './pages/posts';
import Home from './pages/home';
import About from './pages/about';
// import Scene from './misc/scene';
import Router from 'preact-router';
import { createHashHistory } from "history";

class App extends Component {
	render() {
		return (
			<section>
				<Header />
				<Router history={createHashHistory()}>
					<Home path="/" />
					<Posts path="/posts/:id?" />
					<About path="/about" />
				</Router>
			</section>
		)
	}
}

render(<App />, document.getElementById('app'));