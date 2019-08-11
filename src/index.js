import { h, render, Component } from 'preact';
import Home from './pages/home';
// import Scene from './misc/scene';
import Router from 'preact-router';
import createHashHistory from 'history/createHashHistory';

class App extends Component {
	constructor() {
		super();
	}

	render() {
		return (
			<section>
				<Router history={createHashHistory()}>
					<Home path="/" />
					<Home path="/home" />
        </Router>
			</section>
		)
	}
}

// render an instance of Clock into <body>:
render(<App />, document.getElementById('app'));
