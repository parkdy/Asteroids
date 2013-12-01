(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var MovingObject = Asteroids.MovingObject = function(pos, vel, radius, color) {
		this.pos = pos;
		this.vel = vel;
		this.radius = radius;
		this.color = color;
	};

	MovingObject.move = function(interval) {
		this.pos[0] += this.vel[0] * interval;
		this.pos[1] += this.vel[1] * interval;
	};

	MovingObject.draw = function(ctx) {
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

	MovingObject.isCollidedWith = function(otherObject) {
		var dx = otherObject.pos[0] - this.pos[0];
		var dy = otherObject.pos[1] - this.pos[1];
		var dist = Math.sqrt(dx*dx + dy*dy);

		return (otherObject.radius + this.radius > dist);
	};
})(this);