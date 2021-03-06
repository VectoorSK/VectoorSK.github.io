var playGame;
var canvas;

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	sizeP = document.getElementById("sizeP");
	sizeM = document.getElementById("sizeM");
	speedP = document.getElementById("speedP");
	speedM = document.getElementById("speedM");
	double = document.getElementById("double");
	ctx = canvas.getContext("2d");
	document.addEventListener("keydown", keyPush);
	document.addEventListener("keyup", keyReleased);
	playGame = setInterval(game, 1000/60);
	wPlayer = 100;
	hPlayer = 10;
	xPos = canvas.width/2;
	player = new player(xPos, 0, wPlayer, hPlayer);

	for(var i = 0; i < 8; i++) {
		for(var j = 0; j < 6; j++) {
			bricks.push(new brick(i*(brkW+1)+37, (brkH+1)*j + 37, 3-Math.floor((j+0.1)/2)));
		}
	}
}

bricks = [];
tileSize = tileCount = 35;
brkW = 50;
brkH = 20;

drops = [];
dSpeed = 4;
dRad = 12;

balls = [];
bRad = 8;

function game() {
	//background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//gestion du joueur
	player.show();
	player.update();
	
	//nombre de vie
	ctx.fillStyle = "red";
	ctx.font = "bold 30px Arial";
	ctx.fillText(player.life, 10, 30);
	
	//gestion des briques
	for(var i = 0; i < bricks.length; i++) {
		bricks[i].show();
		bricks[i].update();
		for(var j = 0; j < balls.length; j++) {
			bricks[i].collide(balls[j]);
		}
		if(bricks[i].destroy) {
			bricks.splice(i,1);
		}
	}

	//gestion des drops
	for(var i = 0; i < drops.length; i++) {
		drops[i].show();
		drops[i].update();
		drops[i].collide(player);
		if(drops[i].destroy) {
			drops.splice(i, 1);
		}
	}
	
	//gestion des balles
	for(var i = 0; i < balls.length; i++) {
		balls[i].show();
		balls[i].update();
		balls[i].collide(player);
		if(balls[i].destroy) {
			balls.shift(i, 1);
			if(balls.length == 0) {
				player.life--;
			}
		}
	}

	//si toutes les briques sont détruites
	if(bricks.length == 0) {
		gameOver(true);
		clearInterval(playGame);
	}

	//si nombre de vie = 0
	if(player.life <= 0) {
		gameOver(false);
		clearInterval(playGame);
	}

	//console.table(balls);
}

function gameOver(win) {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
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
			player.xv = -8;
			break;

		case 39: //RIGHT
			player.xv = 8;
			break;

		case 32: //SPACE BAR
			if(balls.length == 0) {
				balls.push(new ball(player.x, player.y-bRad, 0, -8));
			}
			break;

		case 13: 
			bricks.push({x:canvas.width/2 - brkW/2, y:canvas.height/2, l:3});
			break;
	}
}

function keyReleased(evt) {
	switch(evt.keyCode) {
		case 37: //LEFT
			player.xv = 0;
			break;

		case 39: //RIGHT
			player.xv = 0;
			break;
	}
}

function brick(x, y, l) {
	this.x = x;
	this.y = y;
	this.l = l;
	this.w = brkW;
	this.h = brkH;
	this.destroy = false;

	this.show = function() {
		if(this.l == 3) {
			ctx.fillStyle = "gray";
		}
		else if(this.l == 2) {
			ctx.fillStyle = "darkgray";
		}
		else {
			ctx.fillStyle = "lightgray";
		}
		ctx.fillRect(this.x, this.y, this.w, this.h);	
	}

	this.update = function() {
		if(this.l <= 0) {
			dropRate = Math.floor(Math.random()*10);
			if(dropRate == 0) {
				drop = Math.floor(Math.random()*4);
				this.drop(drop);
			}
			this.destroy = true;		
		}
	}
	
	this.collide = function(ball) {
		var NearestX = Math.max(this.x, Math.min(ball.x, this.x + this.w));
	 	var NearestY = Math.max(this.y, Math.min(ball.y, this.y + this.h));
		var DeltaX = ball.x - NearestX;
		var DeltaY = ball.y - NearestY;
		if((DeltaX * DeltaX + DeltaY * DeltaY) < (ball.r*ball.r)) {
			
			if (NearestX == this.x) {
				ball.x = this.x - ball.r;
				ball.xv *= -1;
			}
			else if (NearestX == this.x + this.w) {
				ball.x = this.x + this.w + ball.r;
				ball.xv *= -1;
			}
			else if(NearestY == this.y) {
				ball.y = this.y - ball.r;
				ball.yv *= -1;
			}
			else {
				ball.y = this.y + this.h + ball.r;
				ball.yv *= -1;
			}
			this.l--;
		}
	}

	this.drop = function(type) {
		drops.push(new dropItem(this.x + this.w/2, this.y + this.h, type));
	}
}

function player(x, xv, w, h) {
	this.x = x;
	this.xv = xv;
	this.w = w;
	this.h = h;
	this.y = canvas.height - (this.h + 1);
	this.life = 5;

	this.show = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x-this.w/2, this.y, this.w, this.h);
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

function ball(x, y, xv, yv) {
	this.x = x;	
	this.y = y;
	this.r = bRad;
	this.xv = xv;	
	this.yv = yv;
	this.destroy = false;

	this.show = function() {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.strokeStyle = "rgba(1, 1, 1, 0)";
		ctx.stroke();
	}

	this.update = function() {
		this.x += this.xv;
		this.y += this.yv;
		if(this.xv > 9) {
			this.xv = 9;
		}
		if(this.xv < -9) {
			this.xv = -9;
		} 
		//border right left
		if(this.x < this.r) {
			this.x = this.r;
			this.xv *= -1;
		}
		if(this.x > canvas.width - this.r) {
			this.x = canvas.width - this.r;
			this.xv *= -1;
		}
		//border top bot
		if(this.y < this.r) {
			this.y = this.r;
			this.yv *= -1;
		}
		if(this.y > canvas.height + this.r) {
			this.destroy = true;
		}
	}

	this.collide = function(player) {
		if(this.y + this.r > canvas.height - (player.h + 1) && this.x > player.x - player.w/2 && this.x < player.x + player.w/2) {

			this.y = canvas.height - (player.h + 1) - this.r;
			this.yv *= -1;

			for(var i = this.r; i < player.w/2; i++) {
				if(this.x >= player.x + i && this.x < player.x + i + 1) {
					this.xv += 0.05*i;
				}
				if(this.x <= player.x - i && this.x > player.x - i - 1) {
					this.xv -= 0.05*i;
				}
			}
		}
	}
}

function dropItem(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.r = dRad;
	this.speed = dSpeed;
	this.destroy = false;

	this.show = function() {
		if(this.type == 0) {
			ctx.drawImage(sizeP, this.x - this.r, this.y - this.r, 2*this.r, 2*this.r);
		}
		else if(this.type == 1) {
			ctx.drawImage(sizeM, this.x - this.r, this.y - this.r, 2*this.r, 2*this.r);
		}
		else if(this.type == 2) {
			ctx.drawImage(speedP, this.x - this.r, this.y - this.r, 2*this.r, 2*this.r);
		}
		else if(this.type == 3) {
			ctx.drawImage(speedM, this.x - this.r, this.y - this.r, 2*this.r, 2*this.r);
		}
		else if(this.type == 4) {
			ctx.drawImage(double, this.x - this.r, this.y - this.r, 2*this.r, 2*this.r);
		}
	}
	
	this.update = function() {
		this.y += this.speed;
	}

	this.collide = function(player) {
		if(this.y + this.r > player.y && this.x > player.x - player.w/2 && this.x < player.x + player.w/2) {
			
			if(this.type == 0) {
				player.w += 10;
			}
			else if(this.type == 1) {
				player.w -= 10;
			}
			else if(this.type == 2) {
				for(var i = 0; i < balls.length; i++) {
					if(balls[i].yv < 0) balls[i].yv -= 3;
					else if(balls[i].yv >= 0) balls[i].yv += 3;
				}
				setTimeout(function(){
					for(var i = 0; i < balls.length; i++) {
						if(balls[i].yv < 0) balls[i].yv += 3;
						else if(balls[i].yv >= 0) balls[i].yv -= 3;
					}
				}, 2000);
			}
			else if(this.type == 3) {
				for(var i = 0; i < balls.length; i++) {
					if(balls[i].yv < 0) balls[i].yv += 2;
					else if(balls[i].yv >= 0)balls[i].yv -= 2;
				}
				setTimeout(function(){
					for(var i = 0; i < balls.length; i++) {
						if(balls[i].yv < 0) balls[i].yv -= 2;
						else if(balls[i].yv >= 0)balls[i].yv += 2;
					}
				}, 2000);
			}
			else if(this.type == 4) {
				balls.push(new ball(balls[0].x, balls[0].y, balls[0].xv, balls[0].yv*(-1)));
				balls.push(new ball(balls[0].x, balls[0].y, balls[0].xv*(-1), balls[0].yv));
				balls.push(new ball(balls[0].x, balls[0].y, balls[0].xv*(-1), balls[0].yv*(-1)));
			}
			this.destroy = true;
		}
	}
}
