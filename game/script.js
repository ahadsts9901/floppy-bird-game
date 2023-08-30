// Pre Defined Variables For Board 
let board;
let boardWidth = 360;
let boardHeight = 570;
let context;
//Pre Defined Variables For Bird
let birdWidth = 35;
let birdHeight = 30;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}
//Pre Defined Variables For Bird Pipes
let pipeArray = [];
let pipeWidth = 54; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//Bird and pipe Moving logic
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;


// Game Sounds 
let gameOverTune = new Audio('../sound/gameOverTune.mp3');
let pointTune = new Audio('../sound/pointTune.mp3');
let reset_btn_sound = new Audio('../sound/click.mp3');
let themeSong = new Audio('../sound/theme.mp3');

// theme song on any key press 
document.addEventListener('touchstart', () => {
    setTimeout(() => {
        themeSong.loop = true;
        themeSong.play();
    });
});
document.addEventListener('keypress', () => {
    setTimeout(() => {
        themeSong.loop = true;
        themeSong.play();
    });
});



let restart = document.getElementById('restart');


// Logics
window.onload = function () {
    board = document.getElementById("board");  // getting the canvas by id board 
    // selecting the height and width 
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board


    //load Bird image
    birdImg = new Image();
    birdImg.src = "../images/floppybird.png";
    birdImg.onload = function () {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    // load Pipe image 
    topPipeImg = new Image();
    topPipeImg.src = "../images/toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "../images/bottompipe.png";



    // Calling Function
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //1500 is delay at every 1.5 seconds
    document.addEventListener("keydown", moveBird);
    document.addEventListener('touchstart', moveBird);
}

// Function to update Every frame on canvas 
function update() {
    // run canvas frame by frame 
    requestAnimationFrame(update);
    // if gameOver stop updating canvas 
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // making bird fall 
    velocityY += gravity;

    // limiting the height 
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //Looping the pipe
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            // paly audio 
            pointTune.play()
            if (!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
                pipe.passed = true;
            }
        }
        // calling collision function 
        if (detectCollision(bird, pipe)) {
            // play audio 
            gameOverTune.play();
            gameOver = true;
        }
    }

    // Reset the transformation matrix to identity
    context.setTransform(1, 0, 0, 1, 0, 0);

    // Generating Score Dynamically
    context.fillStyle = "white";
    context.font = "45px 'Space Mono'";
    context.fillText(score, 5, 45);

    // Dynamically generates Game Over text 
    if (gameOver) {
        context.fillStyle = "red";
        context.fillText("GAME OVER", 5, 90);
        gameOverTune.play();
        restart.style.display = 'block'
    }
    // button for restart 
    if (gameOver == false) {
        restart.style.display = 'none'
    }
}

function placePipes() {
    // if gameOver stop generate pipes
    if (gameOver) {
        return;
    }
    // Math.random() give us random value(0-2)to move the position of pipes  
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    // space between top and bottom pipe 
    let openingSpace = board.height / 4.5;

    // Top Pipe parameters 
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    // pushing top pipe in over empty array 
    pipeArray.push(topPipe);

    // Bottom Pipe parameters 
    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    // pushing Bottom pipe in over empty array 
    pipeArray.push(bottomPipe);

}

function moveBird() {
    //jump
    velocityY = -7;
    //reset game
    restart.addEventListener('click', () => {
        reset_btn_sound.play();
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    });
}

// checking the collision of bird 
// a for bird, b for pipe 
function detectCollision(a, b) {
    // condition for collision 
    // testing
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
        a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
        a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
        a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

