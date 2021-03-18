import { h, render, Component } from "preact";

class Sockets extends Component {
  constructor() {
    super();
    let udp_data =
      "UDP is like when you're trying to get ready in the morning and you're late for work. Yeah, you still got ready, but you missed some things like breakfast and you're wearing mismatched socks. But who cares, you got ready as fast as possible. That's UDP. It gets data from A to B as fast as possible and order doesn't matter. In fact, they don't event mind if they lose data! You just keep plugging along until the sender is done. When I think of UDP, I think of streaming videos.";

    let tcp_data =
      "This is a Saturday morning. You got up early because you just felt good. You had a cup of coffee, read the news, and walked through the yard. TCP is slower but every little bit if accounted for. You get to where you need to in the order you want it to appear. That's why it's so common on the internet. Servers and clients aren't worried about the order of data (outside of endianness). They know they can just wait for the other person to finish and then they render/serve/process the data in the same order. If they don't get all the bits or they take too long to send another one, they just end the conversation and throw away the whole message. It's certainly appealing. This is a classic example of trading organization over speed. We do it all the time and it's a big reason things are so easy to work with today. When I think of TCP, I think of a static website.";

    this.state = {
      udp_server_data: udp_data.split(" "),
      udp_client_data: [],
      tcp_server_data: tcp_data.split(" "),
      tcp_client_data: [],
      styles: {
        "term-name": {
          fontWeight: 800,
        },
        value: {
          display: "inline-block",
          padding: "10px 15px",
          borderRadius: "3px",
          border: "1px solid #c1c1c1",
          margin: "10px",
        },
      },
    };

    this.udp = this.udp.bind(this);
    this.organize_udp = this.organize_udp.bind(this);
    this.tcp = this.tcp.bind(this);
  }

  udp() {
    let udp_client_data = [];
    this.state.udp_server_data.forEach((word) => {
      let timeout = Math.random() * 1500;
      setTimeout(() => {
        udp_client_data.push(word);
        this.setState({ udp_client_data: udp_client_data });
      }, timeout);
    });
  }

  organize_udp() {
    this.setState({ udp_client_data: this.state.udp_server_data });
  }

  tcp(tcp_client_data = []) {
    let index = tcp_client_data.length;
    let value = this.state.tcp_server_data[index];
    tcp_client_data.push(value);
    this.setState({ tcp_client_data: tcp_client_data }, () => {
      if (tcp_client_data.length != this.state.tcp_server_data.length) {
        this.tcp_helper();
      }
    });
  }

  tcp_helper() {
    setTimeout(() => {
      this.tcp(this.state.tcp_client_data);
    }, 100);
  }

  render() {
    let { styles, udp_client_data, tcp_client_data } = this.state;

    return (
      <article>
        <h1>Sockets</h1>
        <p>
          I played around with TCP and some UDP sockets in Python. Turns out
          sockets aren't that hard to setup (with help from{" "}
          <a href="https://realpython.com/python-sockets/">
            https://realpython.com/python-sockets/
          </a>
          ), but they're pretty hard to manage. It's easy to end up breaking
          your server. Even my best multi-connection servers would break down if
          I sent ten thousand small requests in a loop. Using the selectors
          package, we can handle connections simultaneously as quickly as
          possible, but our server was a little fragile. If things went wrong,
          it would crash or stall. Sometimes it could churn through them, but at
          great cost to my little processor.
        </p>
        <p>
          I'm not going to cover the full-tutorial from realpython. They covered
          it very well and it's lengthy indeed. Instead, I recommend you give it
          a read.
        </p>
        <p>
          Since they did such a good job covering it, I'm just going to describe
          some terms in some fun ways to flex my animation muscle a little.
        </p>
        <div className="terms">
          <div className="term">
            <div className="term-name" style={styles["term-name"]}>
              UDP
            </div>
            <button onClick={this.udp}>Serve data over UDP</button>
            <button
              onClick={this.organize_udp}
              disabled={
                udp_client_data.length < this.state.udp_server_data.length
              }
            >
              Sort UDP Bits
            </button>
            <p className="term-animation">
              {udp_client_data.map((value) => value + " ")}
            </p>
          </div>
          <div className="term">
            <div className="term-name" style={styles["term-name"]}>
              TCP
            </div>
            <button onClick={() => this.tcp()}>Serve data over TCP</button>
            <p className="term-animation">
              {tcp_client_data.map((value) => value + " ")}
            </p>
          </div>
        </div>
      </article>
    );
  }
}

export default Sockets;
