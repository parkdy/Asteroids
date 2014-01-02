(function(root) {
	var Asteroids = root.Asteroids = (root.Asteroids || {});

	var Game = Asteroids.Game = function(ctx) {
		this.ctx = ctx;
		this.interval = 1000/(Game.FPS); // milliseconds 
		
		// Bind pause key
		var self = this;
		
		key("p", function () {
			self.togglePaused();
			return false;
		});	
		
		this.restart();
	};
	

	Game.DIM_X = 500;
	Game.DIM_Y = 500;
	Game.FPS = 30; // Frames per second
	Game.NUM_ASTEROIDS = 10;
	Game.BACKGROUND_COLOR = "black"

	Game.prototype.restart = function() {
		this.ship = new Asteroids.Ship([Math.floor(Game.DIM_X/2),
										Math.floor(Game.DIM_Y/2)]);
										
		this.asteroids = [];
		this.addAsteroids(Game.NUM_ASTEROIDS);

		this.bullets = [];
		
		this.score = 0;
		
	    while (key._downKeys.length > 0) {
	       key._downKeys.pop();
	    }
	};
	
	Game.prototype.addAsteroids = function(numAsteroids) {
		for (var i = 0; i < numAsteroids; i++) {
			var asteroid = null;
			
			do {
				asteroid = Asteroids.Asteroid.randomAsteroid(Game.DIM_X,
															 Game.DIM_Y);
			} while (asteroid.isCollidedWith(this.ship));

			this.asteroids.push(asteroid);
		}
	};

	Game.prototype.movingObjects = function() {
		return [this.ship].concat(this.asteroids).concat(this.bullets);
	};

	Game.prototype.draw = function() {
		this.ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);

		var self = this;

		this.movingObjects().forEach(function(obj) {
			obj.draw(self.ctx);
		});
		
		this.ctx.font="20px Sans-Serif";
		this.ctx.fillStyle="gray"
		this.ctx.fillText("Score: " + this.score, 20, 30);
	};

	Game.prototype.move = function() {
		var self = this;

		this.movingObjects().forEach(function(obj) {
			obj.move(self.interval, Game.DIM_X, Game.DIM_Y);
		});
	};

	Game.prototype.step = function() {	
		var ship = this.ship;
		
		if (key.isPressed('up')) {
			ship.power(ship.getImpulse("forward"));
		} else if (key.isPressed('down')) {
			ship.power(ship.getImpulse("reverse"));
		}

		if (key.isPressed('left')) {
			ship.power(ship.getImpulse("leftturn"));
		} else if (key.isPressed('right')) {
			ship.power(ship.getImpulse("rightturn"));
		}

		if (key.isPressed('space') && ship.canFire) {
			this.fireBullet();
		}

		
		this.move();
		this.draw();
		this.checkCollisions();
	};

	Game.prototype.start = function() {
		var self = this;
		this.intervalID = setInterval(function() {
			self.step();
		}, self.interval);
		
		this.paused = false;
		
		this.bindKeyHandlers();
	};

	Game.prototype.checkCollisions = function() {
		// Check collisions between ship and asteroids

		var self = this;
		this.asteroids.forEach(function(asteroid) {
			if (self.ship.isCollidedWith(asteroid)) {
				self.stop();
				if (confirm("You lost! Humanity is doomed!\nDo you want to try again?")) {
					self.restart();
					self.start();
				}
			}
		});

		// Check collisions between bullets and asteroids
		numBullets = this.bullets.length;
		for (var i = numBullets - 1; i >= 0 ; i--) {
			numAsteroids = this.asteroids.length;
			for (var j = numAsteroids - 1; j >= 0; j--) {
				if (this.bullets[i].isCollidedWith(this.asteroids[j])) {
					this.removeAsteroid(j);
					numAsteroids--;
					this.removeBullet(i);
					numBullets--;
					
					this.score++;
				}
			}
		}
		
		// Replace asteroids that were hit
		this.addAsteroids(10-this.asteroids.length); 
	};

	Game.prototype.stop = function() {
		clearInterval(this.intervalID);
		this.paused = true;
		
		["up" , "down", "left", "right", "space"].forEach(function (k) {
			key.unbind(k);
		});
							
		this.ctx.font="40px Sans-Serif";
		this.ctx.fillStyle="green"
		this.ctx.fillText("PAUSED", Game.DIM_X/2 - 75 ,Game.DIM_Y/2+ 15);
	};
	
	Game.prototype.togglePaused = function () {
		if (this.paused) {
			this.start();
		} else {
			this.stop();
		}
	}

	Game.prototype.bindKeyHandlers = function() {
		var ship = this.ship;
		var self = this;
		
		["up" , "down", "left", "right", "space"].forEach(function (k) {
			key(k, function() {
				return false;
			});
		});
	};

	Game.prototype.fireBullet = function() {
		this.bullets.push(this.ship.fireBullet());
	};

	Game.prototype.removeAsteroid = function(index) {
		this.asteroids.splice(index, 1);
	};

	Game.prototype.removeBullet = function(index) {
		this.bullets.splice(index, 1);
	};
})(this);