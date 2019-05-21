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
					bottom: 0,
					left: 0
				}
			},
      keys: {
        "a": false,
        "w": false,
        "s": false,
        "d": false,
      },
      idle: true,
      idleListener: undefined
		}

		this.init = this.init.bind(this)
    this.keypress = this.keypress.bind(this)
    this.bindListeners = this.bindListeners.bind(this)
		this.start = this.start.bind(this)
		this.stop = this.stop.bind(this)
    this.animate = this.animate.bind(this)
    this.distance = this.distance.bind(this)
    this.inCamera = this.inCamera.bind(this)
	}

	componentDidMount() {
    this.init()
    this.bindListeners()
    this.idle()
    this.keypress()
	}

	componentWillUnmount() {
		this.stop()
		this.mount.removeChild(this.renderer.domElement)
  }
  
  bindListeners() {
    // key down
    document.addEventListener("keydown", (e) => {
      clearTimeout(this.state.idleMovementInterval)
      clearTimeout(this.state.idleSpinInterval)
      e = e || event; // to deal with IE
      this.state.keys[e.key] = e.type == 'keydown';
      this.setState({
        keys: {
          ...this.state.keys,
          [e.key]: e.type == 'keydown'
        }
      })
      clearTimeout(this.state.idleListener)
      // idle watcher
      let idleListener = setTimeout(() => {
        this.idle()
      }, 2000);
      this.setState({ idleListener: idleListener })
    })
    
    // key up
    document.addEventListener("keyup", (e) => {
      clearTimeout(this.state.idleMovementInterval)
      clearTimeout(this.state.idleSpinInterval)
      e = e || event; // to deal with IE
      this.state.keys[e.key] = e.type == 'keydown';
      this.setState({
        keys: {
          ...this.state.keys,
          [e.key]: e.type == 'keydown'
        }
      })
      clearTimeout(this.state.idleListener)
      // idle watcher
      let idleListener = setTimeout(() => {
        this.idle()
      }, 2000);
      this.setState({ idleListener: idleListener })
    })
    
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
    
    // Make a material
    const material = new THREE.MeshPhongMaterial({
      ambient: 0xffffaa,
      color: 0xffffaa,
      specular: 0xffffff,
      shininess: 10,
      shading: THREE.SmoothShading
    });

    const cube = new THREE.Mesh(geometry, material)

    cube.velocity = {
      x: 0.01,
      y: 0.01,
    }
    
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 1920 / window.innerWidth * 4

    scene.add(cube)
    
    // Add 2 lights.
    var light = new THREE.PointLight(0xcc0000, 2, 0)
    light.position.set(100, 100, 200)
    scene.add(light)

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
  
  idle() {
    let idleSpinInterval = setInterval(() => {
      this.cube.rotation.x = this.cube.rotation.x - 0.01
      this.cube.rotation.y = this.cube.rotation.y - 0.01
      this.cube.rotation.z = this.cube.rotation.z - 0.01
    }, 10)
    let idleMovementInterval = setInterval(() => {
        this.cube.position.x = this.cube.position.x - this.cube.velocity.x
        this.cube.position.y = this.cube.position.y - this.cube.velocity.y
      if (!this.inCamera(this.cube)) {
        if (!this.inY(this.cube) && this.inX(this.cube)) {
          console.log("OUT OF Y")
          this.cube.velocity.y = -this.cube.velocity.y
        }
        if (!this.inX(this.cube) && this.inY(this.cube)) {
          console.log("OUT OF X")
          this.cube.velocity.x = -this.cube.velocity.x
        }
      }
    }, 10)
    this.setState({ idleSpinInterval: idleSpinInterval })
    this.setState({ idleMovementInterval: idleMovementInterval })
  }

	stop() {
		cancelAnimationFrame(this.frameId)
	}

	animate() {
		this.renderScene()
		this.frameId = window.requestAnimationFrame(this.animate)
  }
  
  distance(obj) {
    const x = this.camera.position.x
    const y = this.camera.position.y
    const z = this.camera.position.z
    const distance = Math.sqrt((obj.position.x - x) * (obj.position.x - x) + (obj.position.y - y) * (obj.position.y - y) + (obj.position.z - z) * (obj.position.z - z))
    return distance
  }

  inCamera(obj) {
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    const frustum = new THREE.Frustum()
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse))

    const pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)
    return frustum.containsPoint(pos)
  }

  inX(obj) {
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    const frustum = new THREE.Frustum()
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse))

    const pos = new THREE.Vector3(obj.position.x, 0, obj.position.z)
    return frustum.containsPoint(pos)
  }

  inY(obj) {
    this.camera.updateMatrix()
    this.camera.updateMatrixWorld()
    const frustum = new THREE.Frustum()
    frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse))

    const pos = new THREE.Vector3(0, obj.position.y, obj.position.z)
    return frustum.containsPoint(pos)
  }

  keypress() {

    let inCamera = this.inCamera(this.cube)
    let speed = 0.035

		Object.keys(this.state.keys).map(key => {
      let { keys } = this.state

      if (inCamera) {
        if (key == "a" && keys["a"]) this.cube.position.x -= speed
        if (key == "d" && keys["d"]) this.cube.position.x += speed
        if (key == "s" && keys["s"]) this.cube.position.y -= speed
        if (key == "w" && keys["w"]) this.cube.position.y += speed

        if (key == "e" && keys["e"]) this.cube.position.z -= speed
        if (key == "q" && keys["q"]) this.cube.position.z += speed
      } else {
        if (this.inX(this.cube)) {
          if (key == "a" && keys["a"]) this.cube.position.x -= speed
          if (key == "d" && keys["d"]) this.cube.position.x += speed
        } else {
          if (key == "a" && keys["a"] && this.cube.position.x >= 0) this.cube.position.x -= speed
          if (key == "d" && keys["d"] && this.cube.position.x <= 0) this.cube.position.x += speed
        }
        if (this.inY(this.cube)) {
          if (key == "s" && keys["s"]) this.cube.position.y -= speed
          if (key == "w" && keys["w"]) this.cube.position.y += speed
        } else {
          if (key == "s" && keys["s"] && this.cube.position.y >= 0) this.cube.position.y -= speed
          if (key == "w" && keys["w"] && this.cube.position.y <= 0) this.cube.position.y += speed
        }
        if (key == "e" && keys["e"]) this.cube.position.z -= speed
      }


      if (key == "ArrowUp" && keys["ArrowUp"]) this.cube.rotation.x += speed
      if (key == "ArrowDown" && keys["ArrowDown"]) this.cube.rotation.x -= speed
      if (key == "ArrowRight" && keys["ArrowRight"]) this.cube.rotation.y += speed
      if (key == "ArrowLeft" && keys["ArrowLeft"]) this.cube.rotation.y -= speed
    })

    setTimeout(this.keypress, 10);

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
