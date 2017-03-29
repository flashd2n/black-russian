const canvas = document.getElementById("some-canvas");
const context = canvas.getContext("2d");

// default W = 300
// default H = 150

var score = 0;

//
canvas.width = 800;
canvas.height = 600;

// user mouse coordinates
var xMouse = 0;
var yMouse = 0;

// actual count is obstaclesCount ^ 2
var obstaclesCount = 4;

// ball data
// these change in the game loop and can be used for collision detection etc
var xCord = 700;
var yCord = 0;

// velocities determine how much per frame the ball moves on the x-axis and y-axis
var xVelocity = 0;
var yVelocity = 5;
var ballRadius = 10;
var arcStartAngle = 0;
var arcEndAngle = Math.PI * 2;

// starting point to draw obstacles, drawing needs improvement
// can fix draw obstacles function once there are images for bricks instead of Rect
var obstacleXCord = 80;
var obstacleYCord = 100;
var obstacleWidth = 50;
var obstacleHeight = 30;

var multipliers = [];

fillMultipliers();


// multipliers for the obstacles coordinates
function fillMultipliers() {
    for(let i = 0; i < obstaclesCount; i += 1) {
        for(let j = 0; j < obstaclesCount; j += 1) {
            multipliers.push({'x':i, 'y':j});
        }        
    }

    console.log(multipliers);
}


// checks whether current ball Cord has collided with any of the existing obstacles
// needs better precision as well for horizontal/vertical collision (currently on collisions acts as both)
function collidedWithObstacle() {
    for(let i = 0; i < obstaclesCount; i += 1) {
        for(let j = 0; j < obstaclesCount; j += 1) {
            if(multipliers.findIndex(smth => smth.x === i && smth.y === j) === -1) {
                continue;
            }

            let obstacleLeftX = obstacleXCord + (obstacleXCord + obstacleWidth) * i;
            let obstacleRightX = obstacleXCord + (obstacleXCord + obstacleWidth) * i + obstacleWidth;
            let obstacleTopY = obstacleYCord + (obstacleYCord + obstacleHeight) * j;
            let obstacleBottomY = obstacleYCord + (obstacleYCord + obstacleHeight) * j + obstacleHeight;

            if((xCord + ballRadius >= obstacleLeftX && xCord - ballRadius <= obstacleRightX) &&
                (yCord + ballRadius >= obstacleTopY && yCord - ballRadius <= obstacleBottomY)) {
                    // removes given obstacle after collision
                    multipliers.splice(multipliers.findIndex(smth => smth.x === i && smth.y === j), 1);
                    document.getElementById("score").innerHTML = "Score: " + (++score);
                    return true;
                }
        }
    }

    return false;
}


// needs better precision overall
function collidedWithPlatform() {
    if(yCord >= canvas.height - 10) {
        if(xCord <= xMouse - 150 || xCord >= xMouse + 150) {
            return false;
        }
        else {
            // modify angles upon bouncing @ platform
            // might do more cases for a more precise bouncing
            if(xCord >= xMouse - 150 && xCord <= xMouse - 100) {
                xVelocity = -5;
                yVelocity = -3;
            }
            else if(xCord >= xMouse - 101 && xCord <= xMouse -50) {
                xVelocity = -4;
                yVelocity = -4;
            }            
            else if(xCord >= xMouse - 51 && xCord <= xMouse) {
                xVelocity = -3;
                yVelocity = -5;
            }            
            else if(xCord >= xMouse + 1  && xCord <= xMouse + 50) {
                xVelocity = 0;
                yVelocity = -8;
            }
            
            else if(xCord >= xMouse + 51 && xCord <= xMouse + 100) {
                xVelocity = 3;
                yVelocity = -5;
            }
            else {
                xVelocity = 4;
                yVelocity = -4;
            }
        }
    }

    return true;
}


// based on multipliers above draws obstacles on the canvas
// draws only ones existing in  multipliers array
function drawObstacles(obstaclesCount) {
    for(let i = 0; i < obstaclesCount; i += 1) {
        for(let j = 0; j < obstaclesCount; j += 1) {            
            if(multipliers.findIndex(smth => smth.x === i && smth.y === j) === -1) {
                continue;
            }
            context.fillRect(obstacleXCord + (obstacleXCord + obstacleWidth) * i, obstacleYCord + (obstacleYCord + obstacleHeight) * j, obstacleWidth, obstacleHeight);
        }
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "Red";  
    drawObstacles(obstaclesCount);

    // draws the ball with respective x, y cords
    context.beginPath();
    context.fillStyle = "Green";
    context.arc(xCord, yCord, ballRadius, arcStartAngle, arcEndAngle);
    context.fill();    
    context.stroke();

    // upon clearing all obstacles
    if(multipliers.length === 0) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.font = "40px Arial";
        context.fillText("YOU WIN! SCORE: " + score, canvas.width / 4, canvas.height / 2, 500);
        return;
    }

    // no collision with platform && ball down there = lose >> display score, stop game loop
    if(!collidedWithPlatform()) {
        context.font = "40px Arial";
        context.fillText("RIP! SCORE: " + score, canvas.width / 4, canvas.height / 2, 500);
        return;
    }


    // reverses ball x-velocity upon collision with left wall or right wall
    if(xCord + xVelocity <= 0 || xCord + xVelocity >= canvas.width) {
        xVelocity *= -1;
    }

    // reverses ball y-velocity upon collision with top or bottom
    if(yCord + yVelocity <= 0 || yCord + yVelocity >= canvas.height) {
        yVelocity *= -1;
    }

    // reverses ball direction upon hitting obstacle
    if(collidedWithObstacle()) {
        xVelocity *= -1;
        yVelocity *= -1;
    }


    // moves the ball for the next frame
    xCord += xVelocity;
    yCord += yVelocity;

    // draws the platform based on mouse position
    context.fillRect(xMouse - 150, canvas.height - 15, 300, 20);


    // request next frame
    window.requestAnimationFrame(draw);
}

draw();

// fillRect(xCord, yCord, width, height)
// clearRect(xCord, yCord, width, height)


// detect mouse coordinates



function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }


canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

        xMouse = mousePos.x;
        yMouse = mousePos.y;
      }, false);