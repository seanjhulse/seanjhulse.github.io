import { h, render, Component } from "preact";
import NavLink from "./nav_link";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      style: {
        nav: {
          padding: "0.5rem",
          background: "var(--background)",
          borderRadius: "5px",
          textAlign: "right",
        },
        brand: {
          width: "20px",
          float: "left",
        },
      },
      navLinks: [],
      activeLink: undefined,
    };

    this.setActiveLink = this.setActiveLink.bind(this);
  }

  componentDidMount() {
    this.setActiveLink();
    window.addEventListener("hashchange", () => {
      this.setActiveLink();
    });
  }

  setActiveLink() {
    const activeLink = this.state.navLinks.filter(
      (link) => window.location.href.toLowerCase().indexOf(link) !== -1
    );
    this.setState({ activeLink: activeLink[0] });
  }

  render() {
    let { style, navLinks, activeLink } = this.state;
    if (navLinks.length > 0) {
      return (
        <section>
          <nav style={style.nav}>
            <div style={style.brand}>
              <a href="/">
                {" "}
                <img src="/favicon.ico" />
              </a>
            </div>
            {navLinks.map((link) => {
              return <NavLink name={link} active={activeLink == link} />;
            })}
          </nav>
          <h1>Personal Logs</h1>
          <p>Prettier than a Git repo.</p>
          <a href="/">
            <button>Home</button>
          </a>
          <button onclick={() => window.history.back()}>Back</button>
        </section>
      );
    } else {
      return (
        <section>
          <h1>Personal Logs</h1>
          <p>Prettier than a Git repo.</p>
          <a href="/">
            <button>Home</button>
          </a>
        </section>
      );
    }
  }
}

export default Header;
