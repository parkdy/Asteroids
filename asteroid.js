(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Asteroid = Asteroids.Asteroid = function(pos, vel, radius) {
		Asteroids.MovingObject.call(this, pos,
										  vel,
										  radius || Asteroid.RADIUS,
										  Asteroid.COLOR);
	};

	Asteroid.inherits(Asteroids.MovingObject);

	Asteroid.RADIUS = 20;
	Asteroid.COLOR = "brown";
	Asteroid.SPEED = 50/1; // pixels/second

	Asteroid.randomAsteroid = function(dimX, dimY) {		
		var x;
		var y;

		// Spawn asteroid at edge of screen		
		if (Math.floor(Math.random() * 2)) {
			// Left or right side
			x = Math.round(Math.random()) * dimX;
			// Random y
			y = Math.floor(Math.random() * dimY)
		} else {
			// Random x
			x = Math.floor(Math.random() * dimX);
			// Top or bottom side
			y = Math.round(Math.random()) * dimY;
		}

		return new Asteroid([x,y],
							Asteroid.randomVel(Asteroid.SPEED),
							Asteroid.RADIUS);
	};

	// Random angle, constant speed (in pixels/second)
	Asteroid.randomVel = function(speed) {
		var angle = Math.random() * (2 * Math.PI);
		var vx = speed * Math.cos(angle);
		var vy = speed * Math.sin(angle);

		return [vx, vy];
	};

	Asteroid.prototype.move = function(interval, dimX, dimY) {
		Asteroids.MovingObject.prototype.move.call(this, interval, dimX, dimY);

		// Make it wrap around if it reaches the edge of the screen
		this.pos[0] = (this.pos[0] + dimX) % dimX;
		this.pos[1] = (this.pos[1] + dimY) % dimY;
	};

	Asteroid.prototype.splitAsteroids = function() {
		var x = this.pos[0];
		var y = this.pos[1];
		
		var direction = Math.atan2(this.vel[1], this.vel[0]);

		vel1 = [Asteroid.SPEED * Math.cos(direction + Math.PI/6),
				Asteroid.SPEED * Math.sin(direction + Math.PI/6)];
		vel2 = [Asteroid.SPEED * Math.cos(direction - Math.PI/6),
				Asteroid.SPEED * Math.sin(direction - Math.PI/6)];

		return [new Asteroid([x,y], vel1, this.radius/2),
				new Asteroid([x,y], vel2, this.radius/2)];
	};
})(this);