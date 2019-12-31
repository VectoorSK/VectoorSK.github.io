
var playGame;
var candy;

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	candy = document.getElementById("candy");
	ctx = canvas.getContext("2d");
	document.addEventListener("keydown", keyPush);
}

function startGame(difficulty) {
	playGame = setInterval(game, 1000/difficulty);
	document.getElementById("easy").hidden = true;
	document.getElementById("normal").hidden = true;
	document.getElementById("hard").hidden = true;
}

xPos = yPos = 10;
xVel = yVel = 0;
gridSize = tileCount = 22;
xFood = yFood = 15;

trail = [];
tail = 3;
highscore = currentScore = lose = started = lostPos = 0;

function game() {
	document.getElementById("currentScore").innerHTML = currentScore;
	document.getElementById("highscore").innerHTML = highscore;

	xPos += xVel;
	yPos += yVel;

	if(xPos < 0) {
		xPos = tileCount - 1;
	}
	if(xPos > tileCount - 1) {
		xPos = 0;
	}
	if(yPos < 0) {
		yPos = tileCount - 1;
	}
	if(yPos > tileCount - 1) {
		yPos = 0;
	}

	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for(var i = 0; i < trail.length; i++) {
		if(i === trail.length - 1) {
			ctx.fillStyle = "lime";
		}
		else {
			ctx.fillStyle = "green";
		}
		ctx.fillRect(trail[i].x * gridSize + 1, trail[i].y * gridSize + 1, gridSize - 2, gridSize - 2);

		if(trail[i].x == xPos && trail[i].y == yPos) {
			tail = 3;
			lose++;
			lostPos = i-1;
		}
	}
	trail.push({x:xPos, y:yPos});
	while(trail.length > tail) {
		trail.shift();
	}	

	if(xPos == xFood && yPos == yFood) {
		wrongPos = true;
		tail++;
		currentScore++;
		
		while(wrongPos) {
			wrongPos = false;
			xFood = Math.floor(Math.random() * tileCount);
			yFood = Math.floor(Math.random() * tileCount);
			for(var i = 0; i < trail.length; i++) {
				if (trail[i].x == xFood && trail[i].y == yFood) {
					wrongPos = true;
				}
			}
		}
	}

	ctx.fillStyle = "red";
	ctx.fillRect(xFood*gridSize + 1, yFood*gridSize + 1, gridSize - 2, gridSize - 2);
	//ctx.drawImage(candy, xFood*gridSize + 1, yFood*gridSize + 1, gridSize - 2, gridSize - 2);

	if(tail > highscore) {
		highscore = tail;
	}

	if(lose > 0 && started > 0) {
		//alert("Good job, you've got " + currentScore + " points.");
		lose = started = xVel = yVel = 0;
		xPos = yPos = 10;
		ctx.fillStyle = "Orange";
		ctx.fillRect(trail[lostPos].x * gridSize + 1, trail[lostPos].y * gridSize + 1, gridSize - 2, gridSize - 2);
		clearInterval(playGame);
		document.getElementById("easy").hidden = false;
		document.getElementById("normal").hidden = false;
		document.getElementById("hard").hidden = false;
		document.getElementById("title").innerHTML = "PLAY AGAIN:";
	}

	currentScore = tail;
}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 37: //LEFT
			if(xPos-1 != trail[trail.length-2].x) {
				xVel = -1;
				yVel = 0;
				lose = 0;
				started = 1;
			}
			break;

		case 38: //UP
			if(yPos-1 != trail[trail.length-2].y) {
				xVel = 0;
				yVel = -1;
				lose = 0;
				started = 1;
			}
			break;

		case 39: //RIGHT
			if(xPos+1 != trail[trail.length-2].x) {
				xVel = 1;
				yVel = 0;
				lose = 0;
				started = 1;
			}
			break;

		case 40: //DOWN
			if(yPos+1 != trail[trail.length-2].y) {
				xVel = 0;
				yVel = 1;
				lose = 0;
				started = 1;
			}
			break;
	}
}