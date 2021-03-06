
var playGame;
var canvas;

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasScore = document.getElementById("gameScore");
	ctx = canvas.getContext("2d");
	ctx2 = canvasScore.getContext("2d");
	document.addEventListener("keydown", keyPush);
	document.addEventListener("keyup", keyUp);
	playGame = setInterval(game, 1000/15);
	wPlayer = 40;
	hPlayer = 30;
	xPos = 0;
	yPos = 6;

	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 6; j++) {
			grid[i].push({x:i*gridSize, y:j*gridSize, c:0});
		}
	}
}

grid = [[],[],[],[],[],[],[]];
gridSize = 50;

currentPlayer = 1;

function game() {
	//background
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//gestion du joueur
	if(currentPlayer == 1) {
		ctx.fillStyle = "red";
	}
	else {
		ctx.fillStyle = "yellow";
	}
	ctx.beginPath();
    ctx.moveTo(xPos * gridSize - gridSize/2 + 25, yPos * gridSize + gridSize/4 + 25);
    ctx.lineTo(xPos * gridSize - gridSize/2 + 75, yPos * gridSize + gridSize/4 + 25);
    ctx.lineTo(xPos * gridSize - gridSize/2 + 50, yPos * gridSize + gridSize/4 + 0);
    ctx.lineTo(xPos * gridSize - gridSize/2 + 25, yPos * gridSize + gridSize/4 + 25);
    ctx.fill();
    ctx.stroke();

	if(xPos < 0) {
		xPos = 0;
	}
	if(xPos > 6) {
		xPos = 6;
	}

	//switch des joueurs
	if(currentPlayer > 2) {
		currentPlayer = 1;
	}

	ctx.fillStyle = "white";
	ctx.fillRect(0, canvas.height - 20, canvas.width, 25);
	ctx.font = "20px Calibri";
	ctx.textAlign = "center";
	if(currentPlayer == 1) {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeText("Red turn", canvas.width/2, canvas.height - 5);
		ctx.fillStyle = "red";
		ctx.fillText("Red turn", canvas.width/2, canvas.height - 5);
	}
	else {
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.strokeText("Yellow turn", canvas.width/2, canvas.height - 5);
		ctx.fillStyle = "yellow";
		ctx.fillText("Yellow turn", canvas.width/2, canvas.height - 5);
	}

	//grille de jeu
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 6; j++) {
			ctx.fillStyle = "gray";
			ctx.fillRect(grid[i][j].x + 1, grid[i][j].y + 1, gridSize - 1, gridSize - 1);
		
			if(grid[i][j].c == 0) {
				ctx.fillStyle = "black";
			}
			if(grid[i][j].c == 1) {
				ctx.fillStyle = "red";
			}
			else if(grid[i][j].c == 2) {
				ctx.fillStyle = "yellow";
			}
			ctx.beginPath();
			ctx.arc(grid[i][j].x + gridSize/2, grid[i][j].y + gridSize/2, gridSize/2 - 5, 0, 2*Math.PI, false);
			ctx.fill();
			ctx.strokeStyle = "rgba(1, 1, 1, 0)";
			ctx.stroke();
		}
	}

	//detection égalité
	equality = true;
	for(var i = 0; i < 7; i++) {
		for(var j = 0; j < 6; j++) {
			if(grid[i][j].c == 0) {
				equality = false
			}
		}
	}
	if(equality) {
		gameOver(0);
	}

	//detection alignement horizontal
	for(var i = 0; i < 6; i++) {
		for(var test = 0; test < 4; test++) {
			if(grid[test][i].c == grid[test+1][i].c && grid[test+1][i].c == grid[test+2][i].c && grid[test+2][i].c == grid[test+3][i].c) {
				if(grid[test][i].c != 0) {
					gameOver(grid[test][i].c);
					clearInterval(playGame);
				}
			}
		}
	}

	//detection alignement vertical
	for(var i = 0; i < 7; i++) {
		for(var test = 0; test < 3; test++) {
			if(grid[i][test].c == grid[i][test+1].c && grid[i][test+1].c == grid[i][test+2].c && grid[i][test+2].c == grid[i][test+3].c) {
				if(grid[i][test].c != 0) {
					gameOver(grid[i][test].c);
					clearInterval(playGame);
				}
			}
		}
	}

	//detection alignement diagonal \
	for(var i = 0; i < 4; i++) {
		for(var test = 0; test < 3; test++) {
			if(grid[i][test].c == grid[i+1][test+1].c && grid[i+1][test+1].c == grid[i+2][test+2].c && grid[i+2][test+2].c == grid[i+3][test+3].c) {
				if(grid[i][test].c != 0) {
					gameOver(grid[i][test].c);
					clearInterval(playGame);
				}
			}
		}
	}

	//detection alignement diagonal /
	for(var i = 0; i < 4; i++) {
		for(var test = 3; test < 6; test++) {
			if(grid[i][test].c == grid[i+1][test-1].c && grid[i+1][test-1].c == grid[i+2][test-2].c && grid[i+2][test-2].c == grid[i+3][test-3].c) {
				if(grid[i][test].c != 0) {
					gameOver(grid[i][test].c);
					clearInterval(playGame);
				}
			}
		}
	}
}

function gameOver(player) {
	ctx.fillStyle = "white";
	ctx.fillRect(0, canvas.height - 20, canvas.width, 25);
	ctx2.fillStyle = "white";
	ctx2.fillRect(0, 0, canvasScore.width, canvasScore.height);
	ctx2.font = "bold 30px Arial";
	ctx2.textAlign = "center";
	if(player == 1) {
		ctx2.strokeStyle = "black";
		ctx2.lineWidth = 4;
		ctx2.strokeText("RED VICTORY", canvasScore.width/2, 30);
		ctx2.fillStyle = "red";
		ctx2.fillText("RED VICTORY", canvasScore.width/2, 30);
	}
	else if (player == 2) {
		ctx2.strokeStyle = "black";
		ctx2.lineWidth = 4;
		ctx2.strokeText("YELLOW VICTORY", canvasScore.width/2, 30);
		ctx2.fillStyle = "yellow";
		ctx2.fillText("YELLOW VICTORY", canvasScore.width/2, 30);
	}
	else {
		ctx2.fillStyle = "gray";
		ctx2.fillText("DRAW", canvasScore.width/2, 30);
	}
	ctx2.fillStyle = "black";
	ctx2.font = "20px Arial";
	ctx2.fillText("Reload the page to play again.", canvasScore.width/2, canvasScore.height/2+20);
}

function keyPush(evt) {
	switch(evt.keyCode) {
		case 37: //LEFT
			xPos -= 1;
			break;

		case 39: //RIGHT
			xPos += 1;
			break;
	}
}

function keyUp(evt) {
	switch(evt.keyCode) {
		case 32: //SPACE BAR
			y = 5;
			while(grid[xPos][y].c != 0 && y > 0) {
				y--;
			}
			if(y >= 0 && grid[xPos][y].c == 0) {
				grid[xPos][y].c = currentPlayer;
				currentPlayer++;
			}
			break;
	}
}