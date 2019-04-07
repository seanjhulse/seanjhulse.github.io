function createLineElement(x, y, length, angle, v1, v2) {
	let id = v1.id + "-to-" + v2.id;
	if(document.getElementById(id)) {
		document.getElementById(id).remove();
	}
	var line = document.createElement("div");
	line.id = id;
    var styles = 'border: 1px dashed #06345a; '
               + 'width: ' + length + 'px; '
               + 'height: 0px; '
               + 'z-index: -1; '
               + 'transform: rotate(' + angle + 'rad); '
               + '-moz-transform: rotate(' + angle + 'rad); '
               + '-webkit-transform: rotate(' + angle + 'rad); '
               + '-o-transform: rotate(' + angle + 'rad); '  
               + '-ms-transform: rotate(' + angle + 'rad); '  
               + 'position: fixed; '
               + 'top: ' + (y) + 'px; '
               + 'left: ' + (x) + 'px; ';
	line.setAttribute('style', styles);
    document.getElementById('graph').append(line);
}

function createLine(v1, v2) {
    var a = v1.x - v2.x,
        b = v1.y - v2.y,
        c = Math.sqrt(a * a + b * b);

    var sx = (v1.x + v2.x) / 2.0,
        sy = (v1.y + v2.y) / 2.0;

    var x = sx - c / 2.0,
        y = sy;

    var alpha = Math.PI - Math.atan2(-b, a);

    return createLineElement(x, y, c, alpha, v1, v2);
}

/**
 * finds an integer between min and max inclusive
 * @param {Integer} min  
 * @param {Integer} max 
*/
var randomIntInRange = function(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var xBound = function() {
	return window.innerWidth;
}

var yBound = function() {
	return window.innerHeight;
}

class Node {
	constructor(radius) {
		this.radius = radius;
		this.edges = {};
		this.rotation = randomIntInRange(1, 360);
		this.id = this.generateUUID();
		this.x = randomIntInRange(0, xBound() - this.radius);
		this.y = randomIntInRange(0, yBound() - this.radius);
		this.vectorx = this.generateVector();
		this.vectory = this.generateVector();
		this.el = undefined;
		this.render();
	}

	/**
	 * Adds a new edge to this node
	 * @param {Node} Node to be added
	 */
	addEdge(Node) {
		this.edges[Node.id] = Node;
		this.radius = this.radius + 4;
	}

	/**
	 * 
	 * @param {Node} node to be removed 
	 */
	removeEdge(node) {
		if(!node) return
		delete this.edges[node.id];
		delete node.edges[this.id];
	}

	/**
	 * pseudo-unique ID generator. We don't mind if we get a 1/100000 
	 * overlap because this is just for funsies
	 */
	generateUUID() {
		let bytes = window.crypto.getRandomValues(new Uint8Array(32));
		const randomBytes = () => (bytes = bytes.slice(1)) && bytes[0];
	  
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => 
			(c ^ randomBytes() & 15 >> c / 4).toString(16)
		);
	}

	generateVector() {
		let component = 0;
		while(component == 0) {
			component = randomIntInRange(-1, 1);
		}
		return component;
	}

	render() {
		let node = document.createElement('div');
		node.id = this.id;
		node.classList.add("node");
		node.style.transform = `rotate(${this.rotation}deg)`;
		document.getElementById('graph').append(node);
		this.el = node;
		this.draw();
	}

	draw() {
		this.el.style.width = `${this.radius}px`;
		this.el.style.height = `${this.radius}px`;
		this.el.style.top = `${this.y - this.radius/2}px`;
		this.el.style.left = `${this.x - this.radius/2}px`;
	}

	move() {
		let x = this.x + this.vectorx;
		let y = this.y + this.vectory;
		this.x = x;
		this.y = y;
		if(this.insideBounds()) {
			this.draw();
		} else {
			this.bounce();
		}
	}

	bounce() {
		if(this.x > xBound() - this.radius || this.x < this.radius) {
			this.vectorx = -this.vectorx;
			this.rotateCounterClockwise();
		} else {
			this.vectory = -this.vectory;
			this.rotateClockwise();
		}
		
		this.pulse();
		this.draw();
	}

	insideBounds() {
		return (this.x < (xBound() - this.radius) && this.x > 0 && this.y < (yBound() - this.radius) && this.y > 0);
	}

	pulse() {
		this.el.style.opacity = this.el.style.opacity == 1 ? "0.25" : "0.75";
	}
	rotateClockwise() {
		this.rotation = this.rotation + randomIntInRange(90 , 180);
		this.el.style.transform = `rotate(${this.rotation}deg)`;
	}
	rotateCounterClockwise() {
		this.rotation = this.rotation - randomIntInRange(90 , 180);
		this.el.style.transform = `rotate(${this.rotation}deg)`;
	}
	drawLines() {
		Object.keys(this.edges).forEach((edgeKey) => {
			let vertex = this.edges[edgeKey];
			createLine(this, vertex);
		});
	}
}

class Graph {
	constructor(num_of_nodes=1, num_of_edges=0) {
		if(num_of_nodes < 1) {
			console.error("You must have at least 1 node: Graph(1)");
			return;
		}
		this.nodes = [];
		this.createGraphDiv();
		this.generate(num_of_nodes, num_of_edges);
		this.render();
	}

	createGraphDiv() {
		let graph = document.createElement('div');
		graph.id = "graph";
		document.body.append(graph);
	}

	generate(num_of_nodes, num_of_edges) {
		for(var i = 0; i < num_of_nodes; i++) {
			let node = new Node(10);
			this.nodes.push(node);
		}
		for(var i = 0; i < num_of_edges; i++) {
			
			let node1_index = 0;
			let node2_index = 0;

			while(node1_index == node2_index) {
				node1_index = randomIntInRange(0, this.nodes.length - 1);
				node2_index = randomIntInRange(0, this.nodes.length - 1);
			}
			
			let node1 = this.nodes[node1_index];
			let node2 = this.nodes[node2_index];

			node1.addEdge(node2);
		}
	}

	chaos() {
		let numtoRemove = randomIntInRange(0, this.nodes.length/2);
		for(var i = 0; i < numtoRemove; i++) {
			this.removeNode(this.nodes[randomIntInRange(0, this.nodes.length-1)])
		}
		let numtoadd = randomIntInRange(0, this.nodes.length/2);
		this.generate(numtoadd, numtoadd);
	}

	addEdge(Node1, Node2) {
		Node1.addEdge(Node2);
		Node2.addEdge(Node1);
	}

	removeEdge(Node1, Node2) {
		document.getElementById(Node1.id).remove();
		document.getElementById(Node2.id).remove();
		Node1.removeEdge(Node2);
		Node2.removeEdge(Node1);
	}

	removeNode(node) {
		Object.keys(node.edges).forEach((edgeKey) => {
			let v = this.nodes.filter(n => n.id == edgeKey)[0];
			node.removeEdge(v);
		})
		this.nodes = this.nodes.filter(n => n.id != node.id);
	}


	render() {
		this.nodes.forEach((node) => {
			node.move();
			node.drawLines();
		});
		window.requestAnimationFrame(this.draw.bind(this));
	}

	draw() {
		this.render();
	}


}

window.addEventListener('load', function() {
	let numOfCircles = randomIntInRange(10, Math.floor((this.innerWidth / 1920) * 100));
	new Graph(numOfCircles, 50);
})