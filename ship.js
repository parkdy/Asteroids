(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Ship = Asteroids.Ship = function(pos) {
		Asteroids.MovingObject.call(this, pos,
										  [0,0],
										  Ship.RADIUS,
										  Ship.COLOR);
	};

	Ship.inherits(Asteroids.MovingObject);

	Ship.RADIUS = 10;
	Ship.COLOR = "black";

	Ship.prototype.draw = function(ctx) {
		ctx.fillStyle = this.color;
		ctx.beginPath();

		ctx.arc(
			this.pos[0],
			this.pos[1],
			this.radius,
			0,
			2 * Math.PI,
			false
		);

		ctx.fill();
	};
})(this);