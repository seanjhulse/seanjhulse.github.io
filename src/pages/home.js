import { h, render, Component } from 'preact';

class Home extends Component {
	
	render() {
		return (
			<section>
				<h1>Home</h1>
				<address>Localhost: California</address>
				<div className="skills">
					<h2>Things I Do</h2>
					<p>Order is from most knowledgeable to least knowledgeable. I've worked on all sorts of languages in undergrad: <i>C++</i>, <i>Java</i>, <i>Python</i>, but the real world has pushed me into more dynamic scripting languages to build applications and websites.</p>
					<div className="program-languages">
						<div className="program-language">
							<img src="https://rubyonrails.org/images/rails-logo.svg" />
						</div>
						<div className="program-language">
							<img src="https://raw.githubusercontent.com/voodootikigod/logo.js/master/js.png" />
						</div>
						<div className="program-language">
							<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" />
						</div>
						<div className="program-language">
							<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/1200px-Node.js_logo.svg.png" />
						</div>
						<div className="program-language">
							<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/PHP-logo.svg/1280px-PHP-logo.svg.png" />
						</div>
						<div className="program-language">
							<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/AmazonWebservices_Logo.svg/1280px-AmazonWebservices_Logo.svg.png" />
						</div>
					</div>
				</div>
				<div>
					<p>I work remotely right now and I'm going to graduate school for Computer Science. If you want to reach me, reach out on <a href="https://github.com/seanjhulse">https://github.com/seanjhulse</a></p>
					<p>I'm willing to work on almost any framework, but right now I'm generally too busy to help anyone out on open source projects. But I'm always happy to read whitepapers if you have any to share.</p>
				</div>
			</section>
		)
	}
}

export default Home;
