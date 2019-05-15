import { h, render, Component } from 'preact';

class NavLink extends Component {
	constructor() {
		super()
		this.state = {
			style: {
				navLink: {
					color: "white",
					padding: "0 0.5rem"
				},
				navLinkHover: {
					textDecoration: "none",
					padding: "0 0.5rem"
				},
				navLinkActive: {
					color: "#41adff"
				}
			},
			hoverId: undefined
		}
		this.hoverOn = this.hoverOn.bind(this)
		this.hoverOff = this.hoverOff.bind(this)
	}

	hoverOn(e) {
		this.setState({ hoverId: e.target.id })
	}
	hoverOff(e) {
		this.setState({ hoverId: undefined })
	}
	

	render() {
		let { style, hoverId } = this.state

		let linkStyle = style.navLink
		if (hoverId == this.props.name) {
			linkStyle = style.navLinkHover
		}

		if (this.props.active) {
			linkStyle = {
				...linkStyle,
				...style.navLinkActive
			}
		}
		return (
			<a
				onMouseEnter={this.hoverOn}
				onMouseLeave={this.hoverOff}
				id={this.props.name}
				style={linkStyle}
				href={`#/${this.props.name}`}>
				{this.props.name.charAt(0).toUpperCase() + this.props.name.slice(1)}
			</a>
		)
	}
}

export default NavLink;
