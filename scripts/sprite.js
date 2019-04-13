window.onload = function() {
	new SpriteContainers('.sprite-container');
}

class SpriteContainers {
	constructor(containerClass) {
		this.containerClass = containerClass;
		this.containers = [];
		this.init();
	}

	init() {
		document.querySelectorAll(this.containerClass).forEach((container) => {
			this.containers.push(new SpriteContainer(container, container.getAttribute('data-sprite-speed')));
		});
	}
}

class SpriteContainer {
	constructor(container, speed) {
		this.container = container;
		this.sprites = [];
		this.speed = speed * 1000; // convert to milliseconds
		this.currentSprite = 0;
		this.nextSprite = 1;
		this.playForward = true;
		this.init(function() {
			if(this.sprites.length <= 1) { 
				console.error("Must have at least two sprites to animate.")
				return;
			}
			window.requestAnimationFrame(this.animate.bind(this));
		}.bind(this));
	}

	init(callback) {
		this.container.querySelectorAll('.sprite').forEach((sprite) => {
			this.sprites.push(new Sprite(sprite));
		})
		callback();
	}

	animate() {
		setTimeout(function() {
			this.nextFrame();
			window.requestAnimationFrame(this.animate.bind(this));
		}.bind(this), this.speed);
	}

	nextFrame() {
		let currSprite = this.sprites[this.currentSprite];
		let nextSprite = this.sprites[this.nextSprite];
		
		if(currSprite && nextSprite) {
			currSprite.toggle();
			nextSprite.toggle();
		}

		if(this.nextSprite == 0) {
			this.playForward = true;
		}
		if(this.nextSprite == this.sprites.length - 1) {
			this.playForward = false;
		}
		
		this.currentSprite = this.nextSprite;
		
		if((this.sprites.length - 1) > this.nextSprite && this.playForward) {
			this.nextSprite = this.nextSprite + 1;
		} else {
			this.nextSprite = this.nextSprite - 1;
		}
		
	}
}

class Sprite {
	constructor(sprite) {
		this.sprite = sprite;
	}

	toggle() {
		this.sprite.classList.toggle('active');
	}

	active() {
		this.sprite.classList.contains('active');
	}
}