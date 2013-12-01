(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var MovingObject = Asteroids.MovingObject = function(pos, vel, radius, color) {
		this.pos = pos;
		this.vel = vel;
		this.radius = radius;
		this.color = color;
	};

	// Velocity is in pixels/second
	// Interval is in milliseconds
	MovingObject.prototype.move = function(interval, dimX, dimY) {
		this.pos[0] += this.vel[0] * interval / 1000;
		this.pos[1] += this.vel[1] * interval / 1000;
	};

	MovingObject.prototype.draw = function(ctx) {
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

	MovingObject.prototype.isCollidedWith = function(otherObject) {
		var dx = otherObject.pos[0] - this.pos[0];
		var dy = otherObject.pos[1] - this.pos[1];
		var dist = Math.sqrt(dx*dx + dy*dy);

		return (otherObject.radius + this.radius > dist);
	};
})(this);