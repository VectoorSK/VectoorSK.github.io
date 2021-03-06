
var playGame;
var canvas;
var imageR;
var imageG;
var imageB;
var spaceship;

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	imageR = document.getElementById("redInvader");
	imageG = document.getElementById("greenInvader");
	imageB = document.getElementById("blueInvader");
	spaceship = document.getElementById("spaceship");
	ctx = canvas.getContext("2d");
	document.addEventListener("keydown", keyPush);
	document.addEventListener("keyup", keyReleased);
	playGame = setInterval(game, 1000/60);

	wPlayer = 35;
	hPlayer = 40;
	p = new player(canvas.width/2);


	for(var i = 0; i < 10; i++) {
		aliens.push(new alien((i+1)*mSize, 10, 3));
		aliens.push(new alien((i+1)*mSize, 45, 2));
		aliens.push(new alien((i+1)*mSize, 80, 1));
	}
}

aliens = [];
mSize = tileCount = 35;
aVel = 1;
aShots = [];

shots = [];
shotSpeed = 8;


function game() {
	//background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//gestion du joueur
	p.show();
	p.update();
	
	//nombre de vie
	ctx.fillStyle = "red";
	ctx.font = "bold 30px Arial";
	ctx.fillText(p.life, 10, 30);

	//gestion des tirs
	for(var i = 0; i < shots.length; i++) {
		shots[i].show();
		shots[i].update();
		if(shots[i].destroy) {
			shots.splice(i, 1);
		}
	}
	
	//gestion des montres
	for(var i = 0; i < aliens.length; i++) {
		aliens[i].show();
		aliens[i].update();
		if(aliens[i].x > canvas.width - aliens[i].w || aliens[i].x < 5) {
			for(var j = 0; j < aliens.length; j++) {
				aliens[j].lift();
			}
		}
		for(var j = 0; j < shots.length; j++) {
			aliens[i].collide(shots[j]);
		}
		if(aliens[i].destroy) {
			aliens.splice(i, 1);
		}
	}

	//gestion des tirs des monstres
	for(var i = 0; i < aShots.length; i++) {

		aShots[i].show();
		aShots[i].update();
		if(aShots[i].collide(p)) {
			aShots[i].destroy = true;
			p.life--;
		}
		if(aShots[i].destroy) {
			aShots.splice(i, 1);
		}
	}

	//si tous les monstres sont détruits
	if(aliens.length == 0) {
		gameOver(true);
		clearInterval(playGame);
	}

	//si nombre de vie = 0
	if(p.life <= 0) {
		gameOver(false);
		clearInterval(playGame);
	}

	//console.table(shots);
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
	}
	ctx.fillStyle = "white";
	ctx.font = "20px Arial";
	ctx.fillText("Reload the page to play again.", canvas.width/2, canvas.height/2 + 30);
}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 37: //LEFT
			p.xv = -5;
			break;

		case 39: //RIGHT
			p.xv = 5;
			break;

		case 32: //SPACE BAR
			if(!shots || !shots.length) {
				shots.push(new shot(p.x, p.y - 3, shotSpeed, 0));
			}
			else {
				if(shots[shots.length-1].y < p.y - 75) {
					shots.push(new shot(p.x, p.y - 3, shotSpeed, 0));
				}
			}
			break;
	}
}

function keyReleased(evt) {
	switch(evt.keyCode) {
		case 37: //LEFT
			p.xv = 0;
			break;

		case 39: //RIGHT
			p.xv = 0;
			break;

		case 32: //SPACE BAR

			break;
	}
}

function player(x) {
	this.x = x;
	this.xv = 0;
	this.w = wPlayer;
	this.h = hPlayer;
	this.y = canvas.height - (this.h + 1);
	this.life = 3;

	this.show = function() {
		ctx.drawImage(spaceship, this.x-this.w/2, this.y, this.w, this.h);
	}

	this.update = function() {
		this.x += this.xv;

		if(this.x < this.w/2) {
			this.x = this.w/2 + 1;
		}
		if(this.x > canvas.width - this.w/2) {
			this.x = canvas.width - this.w/2 - 1;
		}
	}
}

function shot(x, y, speed, type) {
	this.x = x;
	this.y = y;
	this.r = 3;
	this.speed = speed;
	this.type = type;
	this.destroy = false;


	this.show = function() {
		if(this.type == 0) {
			ctx.fillStyle = "white";
		}
		else if(this.type == 1) {
			ctx.fillStyle = "blue";
		}
		else if(this.type == 2) {
			ctx.fillStyle = "lime";
		}
		else {
			ctx.fillStyle = "red";
		}
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.strokeStyle = "rgba(1, 1, 1, 0)";
		ctx.stroke();

	}

	this.update = function() {
		this.y -= this.speed;
		if(this.y < -this.r) {
			this.destroy = true;
		}
		if(this.y > canvas.height + this.r) {
			this.destroy = true;
		}
	}

	this.collide = function(p) {
		var dX = this.x - Math.max(p.x, Math.min(this.x, p.x + p.w));
		var dY = this.y - Math.max(p.y, Math.min(this.y, p.y + p.h));
		if((dX * dX + dY * dY) < (this.r*this.r)) {
			//this.destroy = true;
			//p.life--;
			return true;
		}
		return false;
	}
}

function alien(x, y, l) {
	this.x = x;
	this.y = y;
	this.w = mSize - 5;
	this.xv = aVel;
	this.life = l;

	this.show = function() {
		if(this.life == 3) {
			ctx.drawImage(imageR, this.x, this.y, this.w, this.w);
		}
		else if(this.life == 2) {
			ctx.drawImage(imageG, this.x, this.y, this.w, this.w);
		}
		else {
			ctx.drawImage(imageB, this.x, this.y, this.w, this.w);
		}
	}

	this.update = function() {
		this.x += this.xv;

		if(Math.floor(Math.random()*600) == 0) {
			aShots.push(new shot(this.x + this.w/2, this.y + this.w + 3, -shotSpeed, this.life));
		}

		if(this.y + this.w > canvas.height - hPlayer) {
			gameOver(false);
			clearInterval(playGame);
		}
	}
	
	this.lift = function() {
		this.xv *= -1;
		this.y += this.w + 5;
	}

	this.collide = function(s) {
		DeltaX = s.x - Math.max(this.x, Math.min(s.x, this.x + this.w));
		DeltaY = s.y - Math.max(this.y, Math.min(s.y, this.y + this.w));
		if((DeltaX * DeltaX + DeltaY * DeltaY) < (s.r*s.r)) {
			s.destroy = true;
			this.life--;
			if(this.life == 0) {
				this.destroy = true;
			}
		}
	}
}