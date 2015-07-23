(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});



	var Ship = Asteroids.Ship = function(pos) {
		// Call parent class's constructor
		Asteroids.MovingObject.call(this, pos,
										  [0,0],
										  Ship.RADIUS,
										  Ship.COLOR);

		this.direction = 0; // Orientation angle (positive clockwise from +x)
		this.shieldRemaining = Ship.SHIELD_CAPACITY;
		this.shieldOn = false;
		
		// Set weapon cooldown timer
		var self = this;
		this.canFire = true;
		this.intervalID = setInterval(function() {
			self.canFire = true;
		}, Ship.COOLDOWN);
	};

	Ship.inherits(Asteroids.MovingObject);



	// Constants
	Ship.RADIUS = 10;
	Ship.COLOR = "lightGray";
	Ship.FORWARD_IMPULSE = 5/1; // 5 pixels/second per impulse
	Ship.REVERSE_IMPULSE = 2/1; // 2 pixels/second per impulse
	Ship.TURN_IMPULSE = 10 * (Math.PI / 180); // 10 deg per impulse
	Ship.COOLDOWN = 200; // 0.2 seconds

	Ship.SHIELD_ON_COLOR = "lightGreen";
	Ship.SHIELD_OFF_COLOR = "gray";
	Ship.SHIELD_CAPACITY = 100;
	Ship.SHIELD_DRAIN_RATE = 5.0/1000; // 5 per second



	Ship.prototype.draw = function(ctx) {
		// Draw shield circle
		this.drawShield(ctx);
		
		// Draw triangular ship pointing in direction angle		
		ctx.fillStyle = this.color;
		ctx.beginPath();

		var angles = [this.direction,
					  this.direction + 3/4 * Math.PI,
					  this.direction - 3/4 * Math.PI];

		var self = this;

		angles.forEach(function(angle) {
			var x = self.pos[0] + self.radius * Math.cos(angle);
			var y = self.pos[1] + self.radius * Math.sin(angle);

			ctx.lineTo(x,y);
		});

		ctx.fill();
	};


	Ship.prototype.drawShield = function(ctx) {
		if (this.shieldOn) {
			ctx.strokeStyle = Ship.SHIELD_ON_COLOR;
		} else {
			ctx.strokeStyle = Ship.SHIELD_OFF_COLOR;
		}

		ctx.lineWidth = 1;

		ctx.beginPath();

		ctx.arc(
			this.pos[0],
			this.pos[1],
			this.radius,
			0,
			2 * Math.PI,
			false
		);

		ctx.stroke();
	};


	Ship.prototype.power = function(impulse) {
		// Impulse is [dVx, dVy, dAngle]
		this.vel[0] += impulse[0];
		this.vel[1] += impulse[1];
		this.direction = (this.direction + impulse[2] + 2 * Math.PI) % (2 * Math.PI);
	};


	Ship.prototype.move = function(interval, dimX, dimY) {
		Asteroids.MovingObject.prototype.move.call(this, interval, dimX, dimY);

		// Make it wrap around if it reaches the edge of the screen
		this.pos[0] = (this.pos[0] + dimX) % dimX;
		this.pos[1] = (this.pos[1] + dimY) % dimY;
	};


	Ship.prototype.getImpulse = function(cmd) {
		// Impulse is [dVx, dVy, dAngle]
		var impulse = [0, 0, 0];

		switch (cmd) {
			case "forward":
				impulse[0] = Ship.FORWARD_IMPULSE * Math.cos(this.direction);
				impulse[1] = Ship.FORWARD_IMPULSE * Math.sin(this.direction);
				break;
			case "reverse":
				impulse[0] = Ship.REVERSE_IMPULSE * Math.cos(this.direction + Math.PI);
				impulse[1] = Ship.REVERSE_IMPULSE * Math.sin(this.direction + Math.PI);
				break;
			case "leftturn":
				impulse[2] = -Ship.TURN_IMPULSE;
				break;
			case "rightturn":
				impulse[2] = Ship.TURN_IMPULSE;
				break;
		}

		return impulse;
	};


	Ship.prototype.fireBullet = function() {		
		this.canFire = false;
		return new Asteroids.Bullet(this);
	};


	Ship.prototype.toggleShield = function() {
		this.shieldOn = !this.shieldOn && this.shieldRemaining > 0;
	};


	Ship.prototype.drainShield = function(interval, fixedDrainAmount) {
		this.shieldRemaining -= Ship.SHIELD_DRAIN_RATE * interval + fixedDrainAmount;

		if (this.shieldRemaining < 0) {
			this.shieldRemaining = 0;
			this.shieldOn = false;
		}
	};
})(this);