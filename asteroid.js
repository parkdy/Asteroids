(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function(pos, vel) {
		Asteroids.MovingObject.call(this, pos,
										  vel,
										  Asteroid.RADIUS,
										  Asteroid.COLOR);
	};

	Asteroid.inherits(Asteroids.MovingObject);

	Asteroid.RADIUS = 15;
	Asteroid.COLOR = "gray";
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
})(this);