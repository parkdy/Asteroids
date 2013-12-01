(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) {
		this.ctx = ctx;
		this.interval = 1000/(Game.FPS); // milliseconds 

		this.ship = new Asteroids.Ship([Math.floor(Game.DIM_X/2),
										Math.floor(Game.DIM_Y/2)]);

		this.asteroids = [];
		this.addAsteroids(Game.NUM_ASTEROIDS);

		this.bullets = [];
	};

	Game.DIM_X = 500;
	Game.DIM_Y = 500;
	Game.FPS = 30; // Frames per second
	Game.NUM_ASTEROIDS = 10;
	Game.BACKGROUND_COLOR = "black"

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
			var asteroid = null;
			
			do {
				asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X,
															 Game.DIM_Y);
			} while (asteroid.isCollidedWith(this.ship));

			this.asteroids.push(asteroid);
		}
	};

	Game.prototype.movingObjects = function() {
		return [this.ship].concat(this.asteroids).concat(this.bullets);
	};

	Game.prototype.draw = function() {
		this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

		var self = this;

		this.movingObjects().forEach(function(obj) {
			obj.draw(self.ctx);
		});
	};

	Game.prototype.move = function() {
		var self = this;

		this.movingObjects().forEach(function(obj) {
			obj.move(self.interval, Game.DIM_X, Game.DIM_Y);
		});
	};

	Game.prototype.step = function() {
		this.move();
		this.draw();
		this.checkCollisions();
	};

	Game.prototype.start = function() {
		var self = this;
		this.intervalID = setInterval(function() {
			self.step();
		}, self.interval);

		this.bindKeyHandlers();
	};

	Game.prototype.checkCollisions = function() {
		// Check collisions between ship and asteroids

		var self = this;
		this.asteroids.forEach(function(asteroid) {
			if (self.ship.isCollidedWith(asteroid)) {
				self.stop();
				alert("You lost! Humanity is doomed.");
			}
		});

		// Check collisions between bullets and asteroids
		numBullets = this.bullets.length;
		for (var i = numBullets - 1; i >= 0 ; i--) {
			numAsteroids = this.asteroids.length;
			for (var j = numAsteroids - 1; j >= 0; j--) {
				if (this.bullets[i].isCollidedWith(this.asteroids[j])) {
					this.removeAsteroid(j);
					numAsteroids--;
					this.removeBullet(i);
					numBullets--;
				}
			}
		}
	};

	Game.prototype.stop = function() {
		clearInterval(this.intervalID);
	};

	Game.prototype.bindKeyHandlers = function() {
		var ship = this.ship;
		var self = this;

		key("up", function() {
			ship.power(ship.getImpulse("forward"));
		});

		key("down", function() {
			ship.power(ship.getImpulse("reverse"));
		});

		key("left", function() {
			ship.power(ship.getImpulse("leftturn"));
		});

		key("right", function() {
			ship.power(ship.getImpulse("rightturn"));
		});

		key("space", function() {
			self.fireBullet();
		});
	};

	Game.prototype.fireBullet = function() {
		this.bullets.push(this.ship.fireBullet());
	};

	Game.prototype.removeAsteroid = function(index) {
		this.asteroids.splice(index, 1);
	};

	Game.prototype.removeBullet = function(index) {
		this.bullets.splice(index, 1);
	};
})(this);