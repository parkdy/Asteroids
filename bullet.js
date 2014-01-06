(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});



	var Bullet = Asteroids.Bullet = function(ship) {
		var vel = [	Bullet.SPEED * Math.cos(ship.direction) + ship.vel[0],
					Bullet.SPEED * Math.sin(ship.direction) + ship.vel[1] ];

		// Call parent class's constructor
		Asteroids.MovingObject.call(this, ship.pos,
										  vel,
										  Bullet.RADIUS,
										  Bullet.COLOR);
	};

	Bullet.inherits(Asteroids.MovingObject);



	// Constants
	Bullet.RADIUS = 2;
	Bullet.COLOR = "lightGreen";
	Bullet.SPEED = 125/1; // pixels/second
})(this);