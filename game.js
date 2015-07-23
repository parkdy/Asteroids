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
		
		// Reset game
		this.reset();
	};



	// Constants

	Game.DIM_X = 500;
	Game.DIM_Y = 500;
	Game.FPS = 30; // Frames per second
	Game.NUM_ASTEROIDS = 10;
	Game.BACKGROUND_COLOR = "black"



	Game.prototype.reset = function() {
		this.ship = new Asteroids.Ship([Math.floor(Game.DIM_X/2),
										Math.floor(Game.DIM_Y/2)]);
										
		this.asteroids = [];
		this.addAsteroids(Game.NUM_ASTEROIDS);

		this.bullets = [];
		
		this.score = 0;
		
		// Clear _downKeys array in keymaster.js
		// to remove keys pressed when the game is paused
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

		// Draw objects
		var self = this;
		this.movingObjects().forEach(function(obj) {
			obj.draw(self.ctx);
		});
		
		// Draw score box
		this.ctx.font="20px Sans-Serif";
		this.ctx.fillStyle="gray"
		this.ctx.fillText("Score: " + this.score, 20, 30);

		this.ctx.font="16px Sans-Serif";
		this.ctx.fillText("Shields:", 20, 60);
		this.ctx.strokeStyle = 'gray';
		this.ctx.strokeRect(20, 70, 100, 16);
		this.ctx.fillStyle = "green";
		this.ctx.fillRect(20, 70, 100 * this.ship.shieldRemaining / Asteroids.Ship.SHIELD_CAPACITY, 16);
	};


	Game.prototype.move = function() {
		var self = this;
		this.movingObjects().forEach(function(obj) {
			obj.move(self.interval, Game.DIM_X, Game.DIM_Y);
		});
	};


	Game.prototype.step = function() {	
		// Check key presses
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
		
		// Refresh
		this.move();
		this.draw();
		this.checkCollisions();
		if (ship.shieldOn) {
			ship.drainShield(this.interval, 0);
		}
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
		for (var i = 0; i < this.asteroids.length; i++) {
			var asteroid = self.asteroids[i];
			if (self.ship.isCollidedWith(asteroid)) {
				if (self.ship.shieldOn) {
					self.ship.vel[0] += asteroid.vel[0] - self.ship.vel[0];
					self.ship.vel[1] += asteroid.vel[1] - self.ship.vel[1];
					self.removeAsteroid(i);
				} else {
					self.stop();
					if (confirm("You lost! Humanity is doomed!\nDo you want to try again?")) {
						self.reset();
						self.start();
					}
				}
			}
		};
		
		// Check collisions between bullets and asteroids
		this.checkBulletHits();
	};
	

	Game.prototype.checkBulletHits = function () {
		// Check collisions between bullets and asteroids
		numBullets = this.bullets.length;
		for (var i = numBullets - 1; i >= 0 ; i--) {
			numAsteroids = this.asteroids.length;
			for (var j = numAsteroids - 1; j >= 0; j--) {
				if (this.bullets[i].isCollidedWith(this.asteroids[j])) {
					// If the bullet hits an asteroid
					// Remove the bullet
					this.removeBullet(i);
					numBullets--;
					
					// Split the asteroid if it's big enough
					var self = this;
					var asteroid = this.asteroids[j];
					
					if (asteroid.radius !== Asteroids.Asteroid.RADIUS) {
						numAsteroids--;
					} else {
						asteroid.splitAsteroids().forEach(function(a) {
							self.asteroids.push(a);
						});
						numAsteroids++;
					}
					
					// Remove the asteroid hit
					this.removeAsteroid(j);

					// Increment the score
					this.score++;
				}
			}
		}
		
		// Replace asteroids that were destroyed
		this.addAsteroids(Game.NUM_ASTEROIDS - this.asteroids.length); 
	};


	Game.prototype.stop = function() {
		// Stop timer
		clearInterval(this.intervalID);
		this.paused = true;
		
		// Unbind ship controls
		["up" , "down", "left", "right", "space", "s"].forEach(function (k) {
			key.unbind(k);
		});
							
		// Show pause text
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
		
		// For each key, prevent the default action (e.g. page scrolling)
		["up" , "down", "left", "right", "space", "s"].forEach(function (k) {
			key(k, function() {
				return false;
			});
		});

		key("s", function() {
			ship.toggleShield();
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