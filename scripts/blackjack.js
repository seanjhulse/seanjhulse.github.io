const SUITS = {
	"S": "Spades",
	"D": "Diamonds",
	"C": "Clubs",
	"H": "Hearts"
};
const CARD_TYPES = {
	1: "A",
	2: "2",
	3: "3",
	4: "4",
	5: "5",
	6: "6",
	7: "7",
	8: "8",
	9: "9",
	10: "10",
	11: "J",
	12: "Q",
	13: "K"
};

class Card {
	constructor(value, name, suit) {
		this.value = value;
		this.name = name;
		this.image = `../images/playing_cards/${name}.png`;
		this.suite = SUITS[suit];
		this.faceUp = true;
	}
}

class Cards {
	constructor() {
		this.cards = [];
		this.generateCards();
		this.shuffleDeck();
	}

	generateCards() {
		for (var cardNum = 1; cardNum < 14; cardNum++) {
			let value = cardNum;
			if (cardNum > 10) {
				value = 10;
			}
			if (cardNum == 1) {
				value = 11;
			}
			Object.keys(SUITS).forEach((suit) => {
				let card = new Card(value, `${CARD_TYPES[cardNum]}${suit}`);
				this.cards.push(card);
			})
		}
	}

	shuffleDeck() {
		var currentIndex = this.cards.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = this.cards[currentIndex];
			this.cards[currentIndex] = this.cards[randomIndex];
			this.cards[randomIndex] = temporaryValue;
		}
	}

	getCard() {
		var randomIndex = Math.floor(Math.random() * this.cards.length);
		let card = this.cards[randomIndex];
		this.cards.splice(randomIndex, 1);
		return card;
	}
}

class User {
	constructor(id) {
		this.id = id ? id : this.uuid();
		this.wins = 0;
		this.busts = 0;
		this.stay = false;
		this.cards = [];

		let userDiv = document.createElement('div');
		userDiv.id = this.id;
		userDiv.classList.add('player-hand');
		document.getElementById('playing-area').append(userDiv);
		if (id == "player") {
			let el = document.createElement("h2");
			el.innerHTML = "Your Hand";
			userDiv.append(el);
		}
	}

	uuid() {
		function randomDigit() {
			if (crypto && crypto.getRandomValues) {
				var rands = new Uint8Array(1);
				crypto.getRandomValues(rands);
				return (rands[0] % 16).toString(16);
			} else {
				return ((Math.random() * 16) | 0).toString(16);
			}
		}
		var crypto = window.crypto || window.msCrypto;
		return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
	}

	addCard(card, callback) {
		this.cards.push(card);

		let cardImg = document.createElement('img');
		cardImg.onload = function () {
			callback();
		}
		
		cardImg.src = card.faceUp ? card.image : "../images/playing_cards/blue_back.png";
		cardImg.classList.add('playing-card');
		document.getElementById(this.id).append(cardImg);
	}

	checkScore() {
		let score = 0;
		Object.values(this.cards).forEach(card => {
			score = score + card.value;
		});
		if (score <= 21) return;
		Object.keys(this.cards).forEach(card => {
			if (score > 21 && this.cards[card].value == 11) {
				score = score - 10;
				this.cards[card].value = 1;
			}
		});
	}

	getScore() {
		this.checkScore();
		let score = 0;
		Object.values(this.cards).forEach(card => {
			score = score + card.value;
		});
		return score;
	}

	bust() {
		if (this.getScore() > 21) {
			return true;
		}
		return false;
	}

	win() {
		if (this.getScore() == 21) {
			return true;
		}
		return false;
	}
}

class Play {
	constructor(num_of_npcs=0) {
		this.users = {};
		this.deck = new Cards();
		this.generateUsers(num_of_npcs);
		this.deal();
	}

	generateUsers(num_of_npcs) {
		this.dealer = new User("dealer");
		for (var i = 0; i < num_of_npcs; i++) {
			let user = new User();
			this.users[user.id] = user;
		}
		this.player = new User("player");
		this.users[this.player.id] = this.player;
	}

	deal() {
		Object.keys(this.users).forEach(userId => {
			for (var i = 0; i < 2; i++) {
				let user = this.users[userId];
				let card = this.deck.getCard();
				user.addCard(card, function () {
					
				});
			}
		});
		let card = this.deck.getCard();
		this.dealer.addCard(card, function () {
			this.turn();
		}.bind(this));
	}

	hit() {
		let card = this.deck.getCard();
		this.player.addCard(card, function () {
			this.turn();
		}.bind(this));
	}

	stay() {
		this.turn();
		this.player.stay = true;
	}

	turn() {
		if (this.check()) return;

		if (this.dealer.getScore() < 21) {
			let card = this.deck.getCard();
			this.dealer.addCard(card, function () {
				this.check();
			}.bind(this));
		} else {
			this.dealer.stay();
		}
	}

	check() {
		if (this.player.win() && this.dealer.win()) {
			document.getElementById('score').innerText = "You tie!";
			document.getElementById('hit').disabled = true;
			document.getElementById('stay').disabled = true;
			return true;
		}
		if (this.player.bust()) {
			document.getElementById('score').innerText = "You bust!";
			document.getElementById('hit').disabled = true;
			document.getElementById('stay').disabled = true;
			return true;
		}
		if (this.dealer.bust()) {
			document.getElementById('score').innerText = "You win!";
			document.getElementById('hit').disabled = true;
			document.getElementById('stay').disabled = true;
			return true;
		}
		if (this.dealer.getScore() > this.player.getScore() && this.player.stay) {
			document.getElementById('score').innerText = "You lose!";
			document.getElementById('hit').disabled = true;
			document.getElementById('stay').disabled = true;
			return true;
		}
		return false;
	}

	reset() {
		document.getElementById('hit').disabled = false;
		document.getElementById('stay').disabled = false;
		document.getElementById('dealer').remove();
		Object.values(this.users).forEach(user => {
			document.getElementById(user.id).remove();
		})
		document.getElementById('score').innerText = "";
		this.users = {}
		this.player = undefined;
		this.generateUsers();
		this.cards = new Cards();
		this.deal();
	}
}

window.onload = function () {
	let game = new Play();
	document.getElementById('card-pile').addEventListener('click', function () {
		console.log("Get a card");
		game.hit();
	})
	document.getElementById('hit').addEventListener('click', function () {
		console.log("Get a card");
		game.hit();
	})
	document.getElementById('stay').addEventListener('click', function (event) {
		console.log("Stay");
		game.stay();
	})
	document.getElementById('reset').addEventListener('click', function (event) {
		console.log("Reset");
		game.reset();
	})
}