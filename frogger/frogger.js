
var playGame, frameRate = 60;
var canvas, scoreCanv, mine;
var frogIMG, carLeft, carRight, logIMG;

var frog, cars = [], logs = [], bloods = [], waves = [];
var lilypads = [false, false, false, false, false, false];
var cols = 13;
var rows = 13;
var tileSize = 50;
var score = 0;


window.onload = function() {
	canvas = document.getElementById("screen");
	scoreCanv = document.getElementById("score");
	grassIMG = document.getElementById("grass");
	waterIMG = document.getElementById("water");
	frogIMG = document.getElementById("frog");
	carIMG = document.getElementById("car1");
	logIMG = document.getElementById("log");
	lily = document.getElementById("lily");
	bloodIMG = document.getElementById("blood");
	ctx = canvas.getContext("2d");
	ctxS = scoreCanv.getContext("2d");
	document.addEventListener("keydown", keyPush);
	playGame = setInterval(game, 1000/frameRate);

	frog = new frog(6, 12);

	spawnRate();
}

function game() {
	//backgrounds
	ctx.drawImage(grassIMG, 0, 6*tileSize, canvas.width, tileSize);
	ctx.drawImage(grassIMG, 0, 12*tileSize, canvas.width, tileSize);
	ctx.fillStyle = "DeepSkyBlue";
	ctx.fillRect(0, 0, canvas.width, tileSize*6);
	ctx.fillStyle = "silver";
	ctx.fillRect(0, 7*tileSize, canvas.width, tileSize);
	for(i = 2; i < 6; i++) {
		ctx.fillRect(0, (i+6)*tileSize + 1, canvas.width, tileSize - 1);
	}

	for(i = 1; i < cols-1; i+=2) {
		ctx.drawImage(lily, i*tileSize, 0, tileSize, tileSize);
	}
	for(i = 0; i < lilypads.length; i++) {
		if(lilypads[i]) {
			ctx.drawImage(frogIMG, ((2*i)+1)*tileSize + 5, 5, frog.w, frog.w);
		}
	}

	for(i = 0; i < waves.length; i++) {
		waves[i].show();
		waves[i].update();
		if(waves[i].destroy) {
			waves.splice(i, 1);
		}
	}

	for(i = 0; i < bloods.length; i++) {
		bloods[i].show();
	}

	for(i = logs.length - 1; i >= 0; i--) {
		logs[i].show();
		logs[i].update();
		if(frog.stepOn(logs[i])) {
			frog.attach = logs[i].speed;
		}
	}

	if(frog.isDrowing(logs) || (frog.i%2 == 0 && frog.j == 0)) {
		frog.reset(2);
	}
	if(frog.i%2 == 1 && frog.j == 0) {
		lilypads[(frog.i-1)/2] = true;
		frog.reset(0);
	}
	frog.update();
	frog.show();

	for(i = cars.length - 1; i >= 0; i--) {
		cars[i].show();
		cars[i].update();
		frog.collide(cars[i]);
	}

	win = true;
	for(i = 0; i < lilypads.length; i++) {
		if(lilypads[i] == false) {
			win = false;
		}
	}

	//vie + score
	ctxS.fillStyle = "white";
	ctxS.fillRect(0, 0, scoreCanv.width, scoreCanv.height);
	ctxS.fillStyle = "black";
	ctxS.font = "bold 30px Arial";
	ctxS.textAlign = "left";
	ctxS.fillText("Score: " + frog.score, 10, scoreCanv.height*3/4);
	ctxS.textAlign = "right";
	ctxS.fillText("Life: " + frog.life, scoreCanv.width - 10, scoreCanv.height*3/4);

	if(win) {
		gameOver(1);
	}
}

function spawnRate() {
	//(type, row, dir, speed, nb, space, width)
	spawn("log",  1,  1,   3, 3, 5, 150);
	spawn("log",  2, -1,   3, 2, 3, 75);
	spawn("log",  3,  1, 3.5, 2, 7, 250);
	spawn("log",  4,  1, 2.5, 4, 3, 100);
	spawn("log",  5, -1, 2.5, 2, 3, 100);
	spawn("car",  7, -1,   3, 3, 3, 0);
	spawn("car",  8,  1,   3, 3, 3, 0);
	spawn("car",  9, -1,   2, 3, 3, 0);
	spawn("car", 10,  1, 2.5, 3, 4, 0);
	spawn("car", 11, -1, 2.5, 3, 3, 0);
}

function spawn(type, row, dir, speed, nb, space, width) {
	if(type == "car") {
		for(i = 0; i < nb; i++) {
			cars.push(new car((space+1)*i, row, dir, speed));
		}
	} else if (type == "log") {
		for(i = 0; i < nb; i++) {
			logs.push(new log((space+1)*i, row, dir, speed, width));
		}
	}
}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 32: //SPACE
			
			break;

		case 38: //UP
			if(!frog.reseting) {
				frog.up();
			}
			frog.attach = 0;
			break;

		case 40:  //DOWN
			if(!frog.reseting) {
				frog.down();
			}
			frog.attach = 0;
			break;

		case 37: //LEFT
			if(!frog.reseting) {
				frog.left();
			}
			frog.attach = 0;
			break;

		case 39: //RIGHT
			if(!frog.reseting) {
				frog.right();
			}
			frog.attach = 0;
			break;
	}
}

function frog(i, j) {
	this.i = i;
	this.j = j;
	this.x = this.i*tileSize;
	this.y = this.j*tileSize;
	this.dir = 0;
	this.w = tileSize - 10;
	this.life = 5;
	this.score = 0;
	this.attach = 0;
	this.reseting = false;

	this.show = function() {
		if(this.dir == 0) { //TOP
			deg = 0;
		} else if(this.dir == 1) { //RIGHT
			deg = Math.PI/2;
		} else if(this.dir == 2) { //BOT
			deg = Math.PI;
		} else if(this.dir == 3) { //LEFT
			deg = 3*Math.PI/2;
		}
		ctx.save();
	    ctx.translate(this.x + 5 + this.w/2, this.y + 5 + this.w/2);
	    ctx.rotate(deg);
	    ctx.drawImage(frogIMG, -this.w/2, -this.w/2, this.w, this.w);
	    ctx.restore();
	}

	this.update = function() {
		if(this.attach != 0) {
			this.x += this.attach;
			this.i = Math.floor(this.x/tileSize);
			if(this.i < 0) {
				this.x = 0;
			} else if (this.i >= cols - 1) {
				this.x = (cols-1) * tileSize;
			}
			this.i = Math.round(this.x/tileSize);
		}
	}

	this.up = function() {
		if(this.j > 0) {
			if(this.j == 1) {
				this.x = this.i*tileSize;
			}
			this.j--;
			this.y -= tileSize;
		}
		this.dir = 0;
	}

	this.down = function() {
		if(this.j < rows - 1) {
			if(this.j == 5) {
				this.x = this.i*tileSize;
			}
			this.j++;
			this.y += tileSize;
		}
		this.dir = 2;
	}

	this.left = function() {
		if(this.i > 0) {
			this.i--;
			if(this.j >= 1 && this.j <= 5) {
				this.x -= tileSize;
			} else {
				this.x = this.i*tileSize;
			}
		}
		this.dir = 3;
	}

	this.right = function() {
		if(this.i < cols - 1) {
			this.i++;
			if(this.j >= 1 && this.j <= 5) {
				this.x += tileSize;
			} else {
				this.x = this.i*tileSize;
			}
		}
		this.dir = 1;
	}

	this.collide = function(car) {
		if(this.j == car.j) {
			if(this.x + 5 + this.w > car.x && this.x + 5 < car.x + car.w) {
				this.reset(1);
			}
		}
	}

	this.stepOn = function(log) {
		if(this.j == log.j) {
			if(this.x + 5 + this.w/2 > log.x && this.x + 5 + this.w/2 < log.x + log.w) {
				return true;
			}
		}
		return false;
	}

	this.isDrowing = function(logs) {
		if(frog.j >= 1 && frog.j <= 5) {	
			var drowing = true;
			for(var i = 0; i < logs.length; i++) {
				if(frog.j >= 1 && frog.j <= 5 && frog.stepOn(logs[i])) {
					drowing = false;
				}	
			}
			if(drowing == true) {
				return true;
			}
		}
		return false;
	}

	this.reset = function(death) {
		if(!this.reseting) {
			this.reseting = true;
			if(death > 0) {
				this.life--;
				if(death == 1) {
					bloods.push(new bloodStain(this.x + 5 + this.w/2, this.y + 5 + this.w/2));
				} else {
					waves.push(new waterWave(this.x + 5 + this.w/2, this.y + 5 + this.w/2));
				}
			}
			setTimeout(() => {
				this.i = 6;
				this.j = 12;
				this.x = this.i*tileSize;
				this.y = this.j*tileSize;
				this.dir = 0;
				this.attach = 0;
				this.reseting = false;
				if(this.life < 0) {
					gameOver(0);
				}
			}, 100);
		}
	}
}

function car(i, j, dir, speed) {
	this.i = i;
	this.j = j;
	this.x = this.i*tileSize;
	this.y = this.j*tileSize;
	this.w = 50;
	this.h = 40;
	this.speed = speed;	
	if(dir == -1) {
		this.speed *= -1;	
	}

	this.show = function() {
	//	ctx.fillStyle = "red";
	//	ctx.fillRect(this.x, this.y + 5, this.w, this.h);
		if(this.j == 7) {
			carIMG = document.getElementById("car1");
		}
		else if(this.j == 8) {
			carIMG = document.getElementById("car2");
		}
		else if(this.j == 9) {
			carIMG = document.getElementById("car3");
		}
		else if(this.j == 10) {
			carIMG = document.getElementById("car4");
		}
		else if(this.j == 11) {
			carIMG = document.getElementById("car5");
		}
		ctx.drawImage(carIMG, this.x, this.y + 5, this.w, this.h);
	}

	this.update = function() {
		this.x += this.speed;

		if(this.x < -this.w - tileSize) {
			this.x = canvas.height + tileSize;
		}
		if(this.x > canvas.height + tileSize) {
			this.x = -this.w - tileSize;
		}
	}
}

function log(i, j, dir, speed, width) {
	this.i = i;
	this.j = j;
	this.x = this.i*tileSize;
	this.y = this.j*tileSize;
	this.w = width;
	this.h = 40;
	this.speed = speed;	
	if(dir == -1) {
		this.speed *= -1;	
	}

	this.show = function() {
		//ctx.fillStyle = "SaddleBrown";
		//ctx.fillRect(this.x, this.y + 5, this.w, this.h);
		ctx.drawImage(logIMG, 0, 0, logIMG.width, logIMG.height, this.x, this.y + 5, this.w, this.h);
	}

	this.update = function() {
		this.x += this.speed;

		if(this.x < -this.w - tileSize) {
			this.x = canvas.height + tileSize;
		}
		if(this.x > canvas.height + tileSize) {
			this.x = -this.w - tileSize;
		}
	}
}

function bloodStain(x, y) {
	this.x = x;
	this.y = y;
	this.w = 25;

	this.show = function() {
		ctx.drawImage(bloodIMG, this.x - this.w/2, this.y - this.w/2, this.w, this.w);
	}
}

function waterWave(x, y) {
	this.x = x;
	this.y = y;
	this.r = 0;
	this.destroy = false;

	this.show = function() {
		ctx.strokeStyle = "aqua";
		ctx.lineWeight = 3;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI, false);
		ctx.stroke();
	}

	this.update = function() {
		this.r++;
		if(this.r > 25) {
			this.destroy = true;
		}
	}
}

function gameOver(win) {
	ctxS.fillStyle = "white";
	ctxS.fillRect(0, 0, scoreCanv.width, scoreCanv.height);
	ctxS.font = "bold 40px Arial";
	ctxS.textAlign = "center";
	ctxS.fillStyle = "red";
	if(win == 1) {
		ctxS.fillText("VICTORY", scoreCanv.width/2, scoreCanv.height*3/4);
	}
	else {
		ctxS.fillText("GAME OVER", scoreCanv.width/2, scoreCanv.height*3/4);
	}
	clearInterval(playGame);
}
