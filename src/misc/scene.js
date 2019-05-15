import { h, render, Component } from 'preact';

class Scene extends Component {
	constructor() {
		super()

		this.state = {
			style: {
				scene: {
					width: window.innerWidth,
					height: window.innerHeight,
					position: "fixed",
					zIndex: -1,
					top: 0,
					left: 0
				}
			},
			keys: {}
		}

		this.init = this.init.bind(this)
		this.keypress = this.keypress.bind(this)
		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)
		this.animate = this.animate.bind(this)
	}

	componentDidMount() {
		this.init()
		document.addEventListener("keydown", (e) => {
			e = e || event; // to deal with IE
			this.state.keys[e.key] = e.type == 'keydown';
			this.setState({
				keys: {
					...this.state.keys,
					[e.key]: e.type == 'keydown'
			}}, this.keypress)
		})
		document.addEventListener("keyup", (e) => {
			e = e || event; // to deal with IE
			this.state.keys[e.key] = e.type == 'keydown';
			this.setState({
				keys: {
					...this.state.keys,
					[e.key]: e.type == 'keydown'
				}
			}, this.keypress)
		})

	}

	componentWillUnmount() {
		this.stop()
		this.mount.removeChild(this.renderer.domElement)
	}

	init() {
		const width = this.mount.clientWidth
		const height = this.mount.clientHeight

		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(
			75,
			width / height,
			0.1,
			1000
		)
		const renderer = new THREE.WebGLRenderer({ antialias: true })
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		const material = new THREE.MeshBasicMaterial({ color: '#433F81' })
		const cube = new THREE.Mesh(geometry, material)

		camera.position.z = 4
		scene.add(cube)
		renderer.setClearColor('#202b38')
		renderer.setSize(width, height)

		this.scene = scene
		this.camera = camera
		this.renderer = renderer
		this.material = material
		this.cube = cube

		this.mount.appendChild(this.renderer.domElement)
		this.start()
	}

	start() {
		if (!this.frameId) {
			this.frameId = requestAnimationFrame(this.animate)
		}
	}

	stop() {
		cancelAnimationFrame(this.frameId)
	}

	animate() {
		this.renderScene()
		this.frameId = window.requestAnimationFrame(this.animate)
	}

	keypress() {
		Object.keys(this.state.keys).map(key => {
			console
			let { keys } = this.state
			for (let i = 0; i < 10; i++) {
				if (key == "a" && keys["a"]) this.cube.position.x -= 0.01
				if (key == "d" && keys["d"]) this.cube.position.x += 0.01
				
				if (key == "s" && keys["s"]) this.cube.position.y -= 0.01
				if (key == "w" && keys["w"]) this.cube.position.y += 0.01

				if (key == "ArrowUp" && keys["ArrowUp"]) this.cube.rotation.x += 0.01
				if (key == "ArrowDown" && keys["ArrowDown"]) this.cube.rotation.x -= 0.01
				if (key == "ArrowRight" && keys["ArrowRight"]) this.cube.rotation.y += 0.01
				if (key == "ArrowLeft" && keys["ArrowLeft"]) this.cube.rotation.y -= 0.01
			}
		})
		
	}

	renderScene() {
		this.renderer.render(this.scene, this.camera)
	}

	render() {
		let { style } = this.state
		return (
			<div
				id="scene"
				style={style.scene}
				ref={(mount) => { this.mount = mount }}
			/>
		)
	}
}

export default Scene;
