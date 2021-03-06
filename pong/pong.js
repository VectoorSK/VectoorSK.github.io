
var playGame;
var canvas;
window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");
	document.addEventListener("keydown", keyPush);
	document.addEventListener("keyup", keyReleased);
	playGame = setInterval(game, 1000/60);
	wPlayer = 10;
	hPlayer = 100;

	p1 = new player(1, canvas.height/2, 0);
	p2 = new player(canvas.width - (wPlayer + 1), canvas.height/2, 0);

}

turn = Math.floor(Math.random()*2) + 1;

tileSize = tileCount = 35;

balls = [];
bRad = 8;

function game() {
	background();

	//gestion des joueurs
	p1.show();
	p2.show();
	p1.update();
	p2.update();
	
	//nombre de vie
	ctx.fillStyle = "red";
	ctx.font = "bold 30px Arial";
	ctx.textAlign = "center";
	ctx.fillText(p1.score, canvas.width/2 - 30, 30);
	ctx.fillText(p2.score, canvas.width/2 + 30, 30);
	
	//gestion des balles
	for(var i = 0; i < balls.length; i++) {
		balls[i].update();
		balls[i].show();
		balls[i].collide2(p2);
		balls[i].collide1(p1);
		if(balls[i].x < 0) {
			p2.score++;
			balls.splice(i, 1);
		}
		else if(balls[i].x > canvas.width + balls[i].r) {
			p1.score++;
			balls.splice(i, 1);
		}
	}

	//si nombre de vie = 0
	if(p1.score >= 3) {
		gameOver(p1, p2);
		clearInterval(playGame);
	}
	if(p2.score >= 3) {
		gameOver(p1, p2);
		clearInterval(playGame);
	}
}

function gameOver(p1, p2) {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "red";
	ctx.font = "bold 30px Arial";
	ctx.textAlign = "center";
	if(p1.score > p2.score) {
		ctx.fillText("P1 VICTORY", canvas.width/2, canvas.height/2 - 50);
	}
	else {
		ctx.fillText("P2 VICTORY", canvas.width/2, canvas.height/2 - 50);
	}		
	ctx.fillStyle = "silver";
	ctx.font = "bold 25px Arial";
	ctx.fillText(p1.score + " - " + p2.score, canvas.width/2, canvas.height/2);
	ctx.fillStyle = "white";
	ctx.font = "20px Arial";
	ctx.fillText("Reload the page to play again.", canvas.width/2, canvas.height/2 + 50);
}

function background() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "silver";
	ctx.fillRect(canvas.width/2 - 5, 0, 10, canvas.height);
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, 10, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.strokeStyle = "rgba(1, 1, 1, 0)";
	ctx.stroke();
	ctx.fillStyle = "silver";
	ctx.fillRect(canvas.width/2 - 5, 0, 10, canvas.height);
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, 75, 0, 2*Math.PI, false);
	ctx.lineWidth = 10;
	ctx.strokeStyle = "silver";
	ctx.stroke();
}

function player(x, y, yv) {
		this.x = x;
		this.y = y;
		this.yv = yv;
		this.score = 0;
		this.w = wPlayer;
		this.h = hPlayer;

		this.show = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y - this.h/2, this.w, this.h);
 	}

		this.update = function() {
		this.y += this.yv;
		if(this.y < this.h/2) {
			this.y = this.h/2 + 1;
		}
		if(this.y > canvas.height - this.h/2) {
			this.y = canvas.height - this.h/2 - 1;
		}
		}
	}

function ball(x, y, xv, yv) {
		this.x = x;
		this.y = y;
		this.xv = xv;
		this.yv = yv;
		this.r = bRad;

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

		if(this.yv > 9) {
			this.yv = 9;
		}
		if(this.yv < -9) {
			this.yv = -9;
		}

		if(this.y < this.r) {
			this.y = this.r;
			this.yv *= -1;
		}
		if(this.y > canvas.width - this.r) {
			this.y = canvas.width - this.r;
			this.yv *= -1;
		}
		}

		this.collide2 = function(p) {
			if(this.x + this.r > canvas.width - (p.w+1) && this.y > p.y - p.h/2 && this.y < p.y + p.h/2) {

			this.x = canvas.width - (p.w+1) - this.r;
			this.xv *= -1;

			for(var i = this.r; i < p.h/2; i++) {
				if(this.y >= p.y + i && this.y < p.y + i + 1) {
					this.yv += 0.05*i;
				}
				if(this.y <= p.y - i && this.y > p.y - i - 1) {
					this.yv -= 0.05*i;
				}
			}
		}
		}
		this.collide1 = function(p) {
		if(this.x - this.r < p.w + 1 && this.y > p.y - p.h/2 && this.y < p.y + p.h/2) {

			this.x = p.w + this.r + 1;
			this.xv *= -1;

			for(var i = this.r; i < p.h/2; i++) {
				if(this.y >= p.y + i && this.y < p.y + i + 1) {
					this.yv += 0.05*i;
				}
				if(this.y <= p.y - i && this.y > p.y - i - 1) {
					this.yv -= 0.05*i;
				}
			}
		}
		}
	}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 90: //Z
			p1.yv = -8;
			break;

		case 83: //Q
			p1.yv = 8;
			break;

		case 38: //UP
			p2.yv = -8;
			break;

		case 40: //DOWN
			p2.yv = 8;
			break;

		case 32: //SPACE BAR
			if(balls.length == 0) {
				if(turn == 1) {
					balls.push(new ball(p1.x, p1.y, 5, 0));
					turn = 2;
				}
				else {
					balls.push(new ball(p2.x-bRad, p2.y, -5, 0));
					turn = 1;
				}
			}
			break;
	}
}

function keyReleased(evt) {
	switch(evt.keyCode) {
		case 90: //Z
			p1.yv = 0;
			break;

		case 83: //S
			p1.yv = 0;
			break;

		case 38: //UP
			p2.yv = 0;
			break;

		case 40: //DOWN
			p2.yv = 0;
			break;
	}
}