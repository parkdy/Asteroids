(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});



	var Asteroid = Asteroids.Asteroid = function(pos, vel, radius) {
		// Call parent class's constructor
		Asteroids.MovingObject.call(this, pos,
										  vel,
										  radius || Asteroid.RADIUS,
										  Asteroid.COLOR);
	};

	Asteroid.inherits(Asteroids.MovingObject);



	// Constants
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


	// Split asteroid into two smaller asteroids
	Asteroid.prototype.splitAsteroids = function() {
		var x = this.pos[0];
		var y = this.pos[1];
		
		var direction = Math.atan2(this.vel[1], this.vel[0]);
		var dir1 = direction + Math.PI/6;
		var dir2 = direction - Math.PI/6;
		var speed = Asteroid.SPEED;


		vel1 = [speed * Math.cos(dir1),
				speed * Math.sin(dir1)];
		vel2 = [speed * Math.cos(dir2),
				speed * Math.sin(dir2)];

		return [new Asteroid([x,y], vel1, this.radius/2),
				new Asteroid([x,y], vel2, this.radius/2)];
	};
})(this);