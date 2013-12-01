(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) {
		this.ctx = ctx;
		this.interval = 1000/(Game.FPS); // milliseconds 

		this.asteroids = [];
		this.addAsteroids(Game.NUM_ASTEROIDS);

		this.ship = new Asteroids.Ship([Math.floor(Game.DIM_X/2),
										Math.floor(Game.DIM_Y/2)]);
	};

	Game.DIM_X = 500;
	Game.DIM_Y = 500;
	Game.FPS = 30; // Frames per second
	Game.NUM_ASTEROIDS = 10;

	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
			var asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X,
															 Game.DIM_Y);
			this.asteroids.push(asteroid);
		}
	};

	Game.prototype.draw = function() {
		this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

		var self = this;
		this.asteroids.forEach(function(asteroid) {
			asteroid.draw(self.ctx);
		});

		this.ship.draw(this.ctx);
	};

	Game.prototype.move = function() {
		var self = this;
		this.asteroids.forEach(function(asteroid) {
			asteroid.move(self.interval);
		});

		this.ship.move(this.interval);
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
	};

	Game.prototype.checkCollisions = function() {
		var self = this;
		this.asteroids.forEach(function(asteroid) {
			if (self.ship.isCollidedWith(asteroid)) {
				self.stop();
				alert("You lost! Humanity is doomed.");
			}
		});
	}

	Game.prototype.stop = function() {
		clearInterval(this.intervalID);
	}
})(this);