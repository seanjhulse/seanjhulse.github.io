import { h, render, Component } from 'preact'
import { Preact, Github } from '../misc/svg'

class About extends Component {
	render() {
		return (
			<section>
				<h2>About this site</h2>
				<p>Normally I'd forgo this sort of thing, but building this site has been a lot of fun and exposed some opportunity to script in Node.js. I figured I'd give a little shout out to tools that make it happen.</p>
				<Preact />
				<p>Renders all of the posts, homepage, and the about page. Why did I choose Preact? Well, I was spending more and more of my time writing JS for the site. I enjoy JS for making movement and illustration possible, but it was difficult trying to make different scripts appear all over the place. Instead, I went with Preact because it's a lightweight solution to organize my code.</p>
				<b>But isn't that still going to be slow?</b>
				<p>Meh, I'm okay with a slower solution. Yes, it takes 0.5s to load my content instead of the 0.1s it used to take. But people can hardly see that kind of difference and toggling between posts becomes much faster after the first render. This way, I'm also making less requests to Github Pages to keep the site chugging along.</p>
				<b>Admit it, you just like fancy JS frameworks</b>
				<p>Yes...</p>
				<Github />
				<p>Good ole' Github Pages. Runs my site, tracks my changes, and does it all for free! I can't believe we have this nowadays. I use Github Pages for my personal site because it lets me direct people to my scripty playground and it helps keep my site grounded. No users, no database, just code and text.</p>
			</section>
		)
	}
}

export default About;