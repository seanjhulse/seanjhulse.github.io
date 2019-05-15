import { h, render, Component } from 'preact'
import NavLink from './nav_link'

class Header extends Component {
	constructor() {
		super()
		this.state = {
			style: {
				nav: {
					padding: "0.5rem",
    			background: "#161f27",
    			borderRadius: "5px",
    			textAlign: "right"
				},
				brand: {
					width: "20px",
					float: "left",
				}
			},
			navLinks: ["home", "posts", "about"],
			activeLink: undefined
		}

		this.setActiveLink = this.setActiveLink.bind(this)
	}

	componentDidMount() {
		this.setActiveLink()
		window.addEventListener("hashchange", () => {
			this.setActiveLink()
		})
	}

	setActiveLink() {
		const activeLink = this.state.navLinks.filter(link => window.location.href.toLowerCase().indexOf(link) !== -1)
		this.setState({ activeLink: activeLink[0] })
	}

	render() {
		let { style, navLinks, activeLink } = this.state
		return (
			<section>
				<nav style={style.nav}>
					<div style={style.brand}>
						<img src="/favicon.ico" />
					</div>
					{navLinks.map(link => {
						return <NavLink name={link} active={activeLink == link}/>
					})}
				</nav>
				<h1>Miscellaneous things</h1>
				<p>Prettier than a Git repo. Worse than a tutorial.</p>
			</section>
		)
	}
}

export default Header;
