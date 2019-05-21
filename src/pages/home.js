import { h, render, Component } from 'preact';

class Home extends Component {
	
	render() {
		return (
			<section>
				<h2>Home</h2>
				<p>This is my site. It's not unique. Just a collection of things I've done over the last 6 months or so. I just got tired of building random projects and not having a way to showcase them. So, instead, anytime I feel like revisiting a data structure, algorithm, animation, or entering into a new topic, I use this site to help organize it. Sometimes the code runs in JS, sometimes you'll have to go to <a href="https://github.com/seanjhulse/seanjhulse.github.io/tree/master/programs" target="_blank">my repo</a></p>
			</section>
		)
	}
}

export default Home;
