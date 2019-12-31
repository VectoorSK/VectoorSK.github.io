
var playGame;
var canvas, scoreCanv;
var shots = [];
var delay = 0;

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	scoreCanv = document.getElementById("gameScore");
	ctx = canvas.getContext("2d");
	ctxS = scoreCanv.getContext("2d");
	document.addEventListener("keydown", keyPush);
	document.addEventListener("keyup", keyReleased);
	playGame = setInterval(game, 1000/60);

	p = new ship(canvas.width/2, canvas.height/2);
	vAng = 0;

	nbAsteroid = 5;
	asteroids = [];

	for(var i = 0; i < nbAsteroid; i++) {
		r = Math.floor(Math.random()*20) + 40;
		asteroids.push(new asteroid(r));
		chooseSpawn(asteroids[i]);
	}
}

function chooseSpawn(asteroid) {
	rand = Math.floor(Math.random()*4);
	if(rand == 0) {
		asteroid.spawnTop();
	}
	else if(rand == 1) {
		asteroid.spawnBot();
	}
	else if(rand == 2) {
		asteroid.spawnLeft();
	}
	else {
		asteroid.spawnRight();
	}
}

function game() {
	//background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctxS.fillStyle = "white";
	ctxS.fillRect(0, 0, scoreCanv.width, scoreCanv.height);

	//gestion du joueur
	p.show();
	//p.showHitbox();
	p.update();
	p.rotate(vAng);
	if(p.boosted) {
		p.boost();
	}
	if(p.shooting && delay > 10) {
		p.shot(shots);
		delay = 0;
	}
	delay++;
	if(p.invincible > 0) {
		p.invincible--;
	}

	//gestion des tirs
	for(i = 0; i < shots.length; i++) {
		shots[i].show();
		shots[i].update();
		if(shots[i].destroy) {
			shots.splice(i, 1);
		}
		else {
			for(j = 0; j < asteroids.length; j++) {
				if(shots[i].collide(asteroids[j])) {
					if(asteroids[j].r > 15) {
						nAst = asteroids[j].explode();
						asteroids.push(nAst[0]);
						asteroids.push(nAst[1]);
						if(asteroids[j].r >= 40) {
							p.score += 20;
						} else {
							p.score += 50;
						}

					}
					else {
						p.score += 100;
					}
					shots.splice(i, 1);
					asteroids.splice(j, 1);
					break;
				}
			}
		}
	}

	//gestion des asteroides
	for(var i = asteroids.length - 1; i >= 0; i--) {
		asteroids[i].show();
		//asteroids[i].showHitbox();
		asteroids[i].update();
		if(p.collide(asteroids[i])) {
			p.life--;
			p.invincible = 75;
		}
	}

	//vie + score
	ctxS.fillStyle = "black";
	ctxS.font = "bold 30px Arial";
	ctxS.textAlign = "left";
	ctxS.fillText("Score: " + p.score, 10, scoreCanv.height*3/4);
	ctxS.textAlign = "right";
	ctxS.fillText("Life: " + p.life, scoreCanv.width - 10, scoreCanv.height*3/4);

	//victore + defaite
	if(asteroids.length == 0) {
		gameOver(true);
	} else if (p.life <= 0) {
		gameOver(false);
	}
}

function gameOver(win) {
	ctx.fillStyle = "red";
	ctx.font = "bold 30px Arial";
	ctx.textAlign = "center";
	if(win) {
		ctx.fillText("VICTORY", canvas.width/2, canvas.height/2);
	}
	else {
		ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
		clearInterval(playGame);
	}
	ctx.fillStyle = "white";
	ctx.font = "20px Arial";
	ctx.fillText("Reload the page to play again.", canvas.width/2, canvas.height/2 + 30);
}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 38: //UP
			p.boosted = true;
			break;

		case 37: //LEFT
			vAng = -4;
			break;

		case 39: //RIGHT
			vAng = 4;
			break;

		case 32: //SPACE BAR
			p.shooting = true;
			break;
	}
}

function keyReleased(evt) {
	switch(evt.keyCode) {
		case 38: //UP
			p.boosted = false;
			break;
		case 37: //LEFT
			vAng = 0;
			break;

		case 39: //RIGHT
			vAng = 0;
			break;

		case 32: //SPACE BAR
			p.shooting = false;
			break;
	}
}

function ship(x, y) {
	//(x,y) = centre du triangle
	this.x = x;
	this.y = y;
	this.xv = 0;
	this.yv = 0;
	this.angle = 0;
	this.life = 5;
	this.score = 0;
	this.boosted = false;
	this.shooting = false;
	this.invincible = 0;

	this.show = function() {
		if(this.invincible) {
			ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
		} else {
			ctx.fillStyle = "white";
		}
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle * Math.PI / 180);
		
		ctx.beginPath();
		ctx.lineTo(15, 20);
		ctx.lineTo(0, -20);
		ctx.lineTo(-15, 20);
		ctx.fill();

		if(this.boosted) {
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.moveTo(10, 20);
			ctx.lineTo(0, 30);
			ctx.lineTo(-10, 20);
			ctx.fill();
		}
		ctx.restore();	
	}

	this.showHitbox = function() {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x + 20*Math.cos((this.angle-90)*Math.PI/180) - 2, this.y + 20*Math.sin((this.angle-90)*Math.PI/180) - 2, 4, 4);
		ctx.fillRect(this.x + 25*Math.cos((this.angle+53)*Math.PI/180) - 2, this.y + 25*Math.sin((this.angle+53)*Math.PI/180) - 2, 4, 4);
		ctx.fillRect(this.x + 25*Math.cos((this.angle+127)*Math.PI/180) - 2, this.y + 25*Math.sin((this.angle+127)*Math.PI/180) - 2, 4, 4);
	}
	
	this.update = function() {
		this.x += this.xv;
		this.y += this.yv;

		if(this.x < 0) {
			this.x = canvas.width;
		}
		if(this.x > canvas.width) {
			this.x = 0;
		}
		if(this.y < 0) {
			this.y = canvas.height;
		}
		if(this.y > canvas.height) {
			this.y = 0;
		}
		this.xv += -this.xv*0.015;	
		this.yv += -this.yv*0.015;
	}

	this.rotate = function(angle) {
		this.angle += angle;
		//if(this.angle >= 360) this.angle = 0;
		//if(this.angle <= 0) this.angle = 360;	
	}

	this.boost = function() {
		vectX = Math.cos(this.angle * Math.PI / 180 - Math.PI/2);
		vectY = Math.sin(this.angle * Math.PI / 180 - Math.PI/2);
		if(this.xv > -10 && this.xv < 10) {
			this.xv += vectX*0.1;
		}
		if(this.yv > -10 && this.yv < 10) {
			this.yv += vectY*0.1;
		}
	}

	this.shot = function(shots) {
		vectX = Math.cos(this.angle * Math.PI / 180 - Math.PI/2);
		vectY = Math.sin(this.angle * Math.PI / 180 - Math.PI/2);
		
		shots.push(new shot(this.x, this.y, vectX*10, vectY*10));
	}

	this.collide = function(asteroid) {
		if(this.invincible <= 0) {
			var a1 = this.x + 20*Math.cos((this.angle-90)*Math.PI/180) - asteroid.x;
			var b1 = this.y + 20*Math.sin((this.angle-90)*Math.PI/180) - asteroid.y;
			var dist1 = Math.sqrt(a1*a1 + b1*b1);
			var a2 = this.x + 25*Math.cos((this.angle+53)*Math.PI/180) - asteroid.x;
			var b2 = this.y + 25*Math.sin((this.angle+53)*Math.PI/180) - asteroid.y;
			var dist2 = Math.sqrt(a2*a2 + b2*b2);
			var a3 = this.x + 25*Math.cos((this.angle+127)*Math.PI/180) - asteroid.x;
			var b3 = this.y + 25*Math.sin((this.angle+127)*Math.PI/180) - asteroid.y;
			var dist3 = Math.sqrt(a3*a3 + b3*b3);
			if(dist1 < asteroid.r || dist2 < asteroid.r || dist3 < asteroid.r) {
				return true;
			}
		}
		return false;
	}
}

function shot(x, y, xv, yv) {
	this.x = x;
	this.y = y;
	this.xv = xv;
	this.yv = yv;
	this.destroy = false;

	this.show = function() {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, 2, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.strokeStyle = "rgba(1, 1, 1, 0)";
		ctx.stroke();
	}

	this.update = function() {
		this.x += this.xv;
		this.y += this.yv;

		if(this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
			this.destroy = true;
		}
	}

	this.collide = function(asteroid) {
		var a = this.x - asteroid.x;
		var b = this.y - asteroid.y;
		var dist = Math.sqrt(a*a + b*b);
		if(dist < asteroid.r) {
			return true;
		}
		return false;
	}
}

function asteroid(x, y, r, e) {
	if(arguments.length == 4) {
		this.x = x;
		this.y = y;
		this.r = r;
		this.edges = e;
	}
	else {
		this.x = 0;
		this.y = 0;
		if(arguments.length == 1) {
			this.r = x;
		} else {
			this.r = Math.floor(Math.random()*60) + 10;
		}
		this.edges = Math.floor(Math.random()*5) + 5;
	}
	this.xv = Math.random()*4 - 2;
	this.yv = Math.random()*4 - 2;
	this.offsets = [];
	this.maxoffset = 0;
	for(i=0; i<this.edges; i++) {
		this.offsets[i] = Math.floor(Math.random()*this.r*0.7) - this.r*0.35;
		this.maxoffset = Math.max(this.maxoffset, this.offsets[i]);

	}

	this.show = function() {
		ctx.strokeStyle = "white";
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.beginPath();
		ctx.moveTo(this.r, 0);
		index = 0;
		for(i = 0; i <= 360; i+=360/this.edges) {
			rad = i*Math.PI/180;
			r = this.offsets[index] + this.r;
			nx = r * Math.cos(rad);
			ny = r * Math.sin(rad);
			ctx.lineTo(nx, ny);
			index++;
		}
		ctx.lineTo(this.r, 0);
		ctx.stroke();
		ctx.restore();
	}

	this.showHitbox = function() {
		ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
		ctx.fill();
	}

	this.update = function() {
		this.x += this.xv;
		this.y += this.yv;

		if (this.x + this.r + this.maxoffset < 0) {
			this.x = this.r + this.maxoffset + canvas.width;
		}
		if(this.x - this.r - this.maxoffset > canvas.width ) {
			this.x = -this.r - this.maxoffset;
		} 
		if(this.y + this.r + this.maxoffset < 0) {
			this.y = this.r + this.maxoffset + canvas.height;
		}
		if(this.y - this.r - this.maxoffset > canvas.height) {
			this.y = -this.r - this.maxoffset;
		}
	}

	this.spawnTop = function() {
		this.x = Math.random()*canvas.width;
		this.y = - (this.r + this.maxoffset);
		if(this.yv < 0) {
			this.yv *= -1;
			this.yv += 3;
		}
	}

	this.spawnBot = function() {
		this.y = canvas.height + (this.r + this.maxoffset);
		this.x = Math.random()*canvas.width;
		if(this.yv > 0) {
			this.yv *= -1;
			this.yv -= 3;
		}
	}

	this.spawnLeft = function() {
		this.x = - (this.r + this.maxoffset);
		this.y = Math.random()*canvas.height;
		if(this.xv < 0) {
			this.xv *= -1;
			this.xv += 3;
		}
	}

	this.spawnRight = function() {
		this.x = canvas.width + (this.r + this.maxoffset);
		this.y = Math.random()*canvas.height;
		if(this.xv > 0) {
			this.xv *= -1;
			this.xv -= 3;
		}
	}

	this.explode = function() {
		nAst = [];
		nAst[0] = new asteroid(this.x + 30, this.y, this.r/2, this.edges);
		nAst[1] = new asteroid(this.x - 30, this.y, this.r/2, this.edges);
		return nAst;
	}
}