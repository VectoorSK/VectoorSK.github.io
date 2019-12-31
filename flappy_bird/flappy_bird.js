
var playGame, addPipe, background;
var canvas, canvasScore;

window.onload = function() {
	bird1 = document.getElementById("bird");
	bird2 = document.getElementById("bird2");
	cloud1 = document.getElementById("cloud1");
	cloud2 = document.getElementById("cloud2");
	cloud3 = document.getElementById("cloud3");
	cloud4 = document.getElementById("cloud4");
	cloud5 = document.getElementById("cloud5");
	cloud6 = document.getElementById("cloud6");
	pipeHaut = document.getElementById("pipeHaut");
	pipeBas = document.getElementById("pipeBas");

	canvas = document.getElementById("gameCanvas");
	scoreCanv = document.getElementById("gameScore");
	ctx = canvas.getContext("2d");
	ctxS = scoreCanv.getContext("2d");
	document.addEventListener("keydown", keyPush);
	playGame = setInterval(game, 1000/60);
	background = setInterval(background, 500);

	ding = new sound("./ding.mp3");
	started = false;

	bird = new bird();
	angleMin = -20;
	angleMax = 50;
	cntAnimate = 0;
	temp = 0;

	yVel =  5;
	gravity = 0.4;
	jump = 6;

	pipes = [];
	pW = 50;

	clouds = [];
	
	grass = [];
	for(var i = 0; i <= canvas.width; i+=3) {
		rand = Math.floor(Math.random()*5);
		grass.push({x:i, rand:rand});
	}
}

function background() {
	if(Math.floor(Math.random()*5) == 0) {
		var height = Math.floor(Math.random()*(canvas.height/4));
		var speed = Math.floor(Math.random()*3 + 0.5);
		var img = Math.floor(Math.random()*5 + 1);
		clouds.push(new cloud(canvas.width, height, speed, img));
	}
}

function addPipe() {
	var height = Math.floor(Math.random()*(canvas.height-260) + 10);
	pipes.push(new pipe(height));
}

function game() {
	//BACKGROUND:
	ctx.fillStyle = "lightblue";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "black";
	ctx.lineWeight = 5;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	//SCORE:
	ctxS.fillStyle = "white";
	ctxS.fillRect(0, 0, scoreCanv.width, scoreCanv.height);
	ctxS.font = "bold 30px Arial";
	ctxS.textAlign = "center";
	ctxS.fillStyle = "black";
	ctxS.fillText(bird.score, scoreCanv.width/2, scoreCanv.height/2);

	//CLOUDS:
	for(var i = clouds.length - 1; i >= 0; i--) {
		clouds[i].show();
		clouds[i].update();
		if(clouds[i].destroy) {
			clouds.splice(i,1);
		}
	}

	//BIRD:
	//bird.showHitbox();
	bird.show();
	bird.update();

	//PIPES:
	for(var i = pipes.length - 1; i >= 0; i--) {
		//pipes[i].showHitbox();
		pipes[i].show();
		pipes[i].update();
		pipes[i].collide(bird);
		if(pipes[i].destroy) {
			pipes.shift();
		}
	}

	//GRASS:
	ctx.fillStyle = "green";
	for(var i = 0; i < grass.length; i++) {
		ctx.fillRect(grass[i].x, canvas.height - (15-grass[i].rand), 3, 15-grass[i].rand);
		if(grass[i].x < 0) {
			grass.shift();
			rand = Math.floor(Math.random()*5);
			grass.push({x:canvas.width, rand:rand});
		}
		grass[i].x -= 3;
	}
	ctx.fillRect(0, canvas.height - 12, 4, 12);
}

function gameOver() {
	ctxS.fillStyle = "white";
	ctxS.fillRect(0, 0, scoreCanv.width, scoreCanv.height);
	ctxS.font = "bold 30px Arial";
	ctxS.textAlign = "center";
	ctxS.fillStyle = "black";
	ctxS.fillText("GAME OVER", scoreCanv.width/2, 30);
	ctxS.font = "20px Arial";
	ctxS.fillText("Score: " + bird.score, scoreCanv.width/2, scoreCanv.height/2 + 10);
	ctxS.font = "15px Arial";
	ctxS.fillText("Reload the page to play again.", scoreCanv.width/2, scoreCanv.height/2 + 40);
	clearInterval(playGame);
}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 32: //SPACE BAR
			if(!started) {
				addPipe = setInterval(addPipe, 1500);
				started = true;
				yVel = 0;
				yVel -= jump;
				bird.animate = true;
			}
			if(bird.angle > angleMin + 20) {
				yVel = 0;
				yVel -= jump;
				bird.angle = angleMin;
				bird.animate = true;
			}
			break;
	}
}

function cloud(x, y, speed, img) {
	this.x = canvas.width;
	this.y = y;
	this.speed = speed;
	this.img = img;
	this.width = 100;
	this.destroy = false;
	
	this.show = function() {
		if(this.img == 1) {
			ctx.drawImage(cloud1, this.x, this.y, cloud1.width, cloud1.height);
			this.width = cloud1.width;
		}
		else if(this.img == 2) {
			ctx.drawImage(cloud2, this.x, this.y, cloud2.width, cloud2.height);
			this.width = cloud2.width;
		}
		else if(this.img == 3) {
			ctx.drawImage(cloud3, this.x, this.y, cloud3.width, cloud3.height);
			this.width = cloud3.width;
		}
		else if(this.img == 4) {
			ctx.drawImage(cloud4, this.x, this.y, cloud4.width, cloud4.height);
			this.width = cloud4.width;
		}
		else if(this.img == 5) {
			ctx.drawImage(cloud5, this.x, this.y, cloud5.width, cloud5.height);
			this.width = cloud5.width;
		}
	}

	this.update = function() {
		this.x -= this.speed;

		if(this.x < -this.width) {
			this.destroy = true;
		}
	}
}

function bird(x, y, w, h, ) {
	this.x = canvas.width/4;
	this.y = canvas.height/2;
	this.w = 50;
	this.h = 32;
	this.angle = 0;
	this.animate = false;
	this.score = 0;

	this.show = function() {
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle * Math.PI / 180);
		if(this.animate) {
			ctx.drawImage(bird2, -this.w/2, -this.h/2, this.w, this.h);
			cntAnimate++;
			if(cntAnimate > 10) {
				this.animate = false;
				cntAnimate = 0;
			}
		}
		else {
			ctx.drawImage(bird1, -this.w/2, -this.h/2, this.w, this.h);
		}
		ctx.restore();
	}

	this.showHitbox = function() {
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		ctx.beginPath();
		ctx.arc(this.x, this.y, (this.w-10)/2, 0, 2*Math.PI, false);
		ctx.fill();
		ctx.strokeStyle = "rgba(1, 1, 1, 0)";
		ctx.stroke();
	}

	this.update = function() {
		if(this.y - this.h/2 < 0) {
			this.y = this.h/2;
			yVel = 0;
		}
		if(this.y + (this.w-10)/2 > canvas.height - 15) {
			this.y = canvas.height - (this.w-10)/2 - 15;
			yVel = 0;
			gameOver();
		}

		if(started) {
			this.angle+=2;
			if(this.angle > angleMax) {
				this.angle = angleMax;
			}
			this.y +=  yVel;
			yVel += gravity;
		}
	}
}

function pipe(h) {
	this.x = canvas.width;
	this.h = h;
	this.w = pW;
	this.space = 110;
	this.destroy = false;

	this.show = function() {
		ctx.drawImage(pipeBas, 0, pipeBas.height-this.h, pipeBas.width, this.h, this.x, 0, this.w, this.h);
		ctx.drawImage(pipeHaut, 0, 0, pipeBas.width, canvas.height - (this.h + this.space), this.x, this.h + this.space, this.w, canvas.height - (this.h + this.space));
	}

	this.showHitbox = function() {
		ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
		ctx.fillRect(this.x, 0, this.w, this.h);
		ctx.fillRect(this.x, this.h + this.space, this.w, canvas.height - (this.h + this.space));
	}

	this.update = function() {
		this.x -= 3;

		if(this.x + this.w/2 < canvas.width/4 && temp == 0) {
			bird.score++;
			ding.play();
			temp = 1;
		}

		if(this.x < -this.w) {
			this.destroy = true;
			temp = 0;
		}
	}

	this.collide = function(bird) {
		NearestX = Math.max(this.x, Math.min(bird.x, this.x + this.w));
	 	NearestY = Math.max(0, Math.min(bird.y, this.h));
		DeltaX = bird.x - NearestX;
		DeltaY = bird.y - NearestY;
		if((DeltaX * DeltaX + DeltaY * DeltaY) < ((bird.w-10)/2*(bird.w-10)/2)) {
			gameOver();
			//clearInterval(playGame);
		}

		NearestX = Math.max(this.x, Math.min(bird.x, this.x + this.w));
	 	NearestY = Math.max(this.h + this.space, Math.min(bird.y, canvas.height));
		DeltaX = bird.x - NearestX;
		DeltaY = bird.y - NearestY;
		if((DeltaX * DeltaX + DeltaY * DeltaY) < ((bird.w-10)/2*(bird.w-10)/2)) {
			gameOver();
			//clearInterval(playGame);
		}
	}
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
    this.sound.play();
  }
  this.pause = function() {
    this.sound.pause();
  }
}