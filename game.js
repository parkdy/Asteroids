(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) {
		this.ctx = ctx;

		this.asteroids = [];
		this.addAsteroids(Game.NUM_ASTEROIDS);

		this.interval = 1000/(Game.FPS); // milliseconds 
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
	};

	Game.prototype.move = function() {
		var self = this;
		this.asteroids.forEach(function(asteroid) {
			asteroid.move(self.interval);
		});
	};

	Game.prototype.step = function() {
		this.move();
		this.draw();
	};

	Game.prototype.start = function() {
		var self = this;
		var intervalID = setInterval(function() {
			self.step();
		}, self.interval);
	};
})(this);