(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Bullet = Asteroids.Bullet = function(pos, direction) {
		var vel = [	Bullet.SPEED * Math.cos(direction),
					Bullet.SPEED * Math.sin(direction)];

		Asteroids.MovingObject.call(this, pos,
										  vel,
										  Bullet.RADIUS,
										  Bullet.COLOR);
	};

	Bullet.inherits(Asteroids.MovingObject);

	Bullet.RADIUS = 2;
	Bullet.COLOR = "lightGreen";
	Bullet.SPEED = 125/1; // pixels/second
})(this);