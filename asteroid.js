(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function(pos, vel) {
		Asteroids.MovingObject.call(this, pos,
										  vel,
										  Asteroid.RADIUS,
										  Asteroid.COLOR);
	};

	Asteroid.inherits(Asteroids.MovingObject);

	Asteroid.RADIUS = 20;
	Asteroid.COLOR = "brown";
	Asteroid.SPEED = 25/1; // pixels/second

	Asteroid.randomAsteroid = function(dimX, dimY) {
		var x = Math.floor(Math.random() * dimX);
		var y = Math.floor(Math.random() * dimY);

		return new Asteroid([x,y], Asteroid.randomVel());
	};

	// Random angle, constant speed (in pixels/second)
	Asteroid.randomVel = function() {
		var angle = Math.random() * (2 * Math.PI);
		var vx = Asteroid.SPEED * Math.cos(angle);
		var vy = Asteroid.SPEED * Math.sin(angle);

		return [vx, vy];
	};

	Asteroid.prototype.move = function(interval, dimX, dimY) {
		Asteroids.MovingObject.prototype.move.call(this, interval, dimX, dimY);

		// Make it wrap around if it reaches the edge of the screen
		this.pos[0] = (this.pos[0] + dimX) % dimX;
		this.pos[1] = (this.pos[1] + dimY) % dimY;
	};
})(this);