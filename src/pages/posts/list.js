import { h, render, Component } from 'preact';

class List extends Component {
	constructor() {
		super();
		this.state = {
			posts: [],
			archives: [],
		}
	}

	componentDidMount() {
		fetch('data/archive.json')
			.then(data => data.json())
			.then(data => this.setState({ archives: data.posts }))
		
		fetch('data/posts.json')
			.then(data => data.json())
			.then(data => this.setState({ posts: data.posts }))
	}

	render() {
		let { posts, archives } = this.state;
		
		posts = posts.map(post => {
			return (
				<li>
					<a href={"#/posts/" + post.title}>{post.title}</a>
				</li>
			)
		})

		archives = archives.map(post => {
			return (
				<li>
					<a href={post.href}>{post.title}</a>
				</li>
			)
		})
		return (
			<section>
				<h2>Posts</h2>
				<ul>
					{posts}
				</ul>
				<h2>Archives</h2>
				<p>Archived posts are old posts that I made when this site was a traditional static website. The new ones are using Preact, these archived ones are using pure static JS, HTML, and CSS.</p>
				<ul>
					{archives}
				</ul>
			</section>
		)
	}
}

export default List;