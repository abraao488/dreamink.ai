// Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_SPEED = 3;
const PIPE_GAP = 150;
const PIPE_INTERVAL = 1500; // milliseconds

// Game state
let cube = {
    y: 0,
    velocity: 0
};

let pipes = [];
let score = 0;
let gameRunning = false;
let gameLoopId;
let pipeGeneratorId;

// DOM Elements
const gameArea = document.getElementById('game-area');
const cubeElement = document.getElementById('cube');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const gameOverElement = document.getElementById('game-over');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    resetCube();
});

// Set up event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    backBtn.addEventListener('click', () => {
        window.location.href = '../../public/index.html';
    });
    
    // Jump on click or spacebar
    document.addEventListener('click', jump);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            jump();
        }
    });
}

// Reset cube position
function resetCube() {
    cube.y = gameArea.offsetHeight / 2 - cubeElement.offsetHeight / 2;
    cube.velocity = 0;
    cubeElement.style.top = `${cube.y}px`;
    cubeElement.className = 'cube';
}

// Start game
function startGame() {
    // Reset game state
    resetCube();
    pipes = [];
    score = 0;
    scoreElement.textContent = score;
    
    // Clear existing pipes
    document.querySelectorAll('.pipe, .ground').forEach(el => el.remove());
    
    // Hide screens
    startScreen.style.display = 'none';
    gameOverElement.classList.remove('show');
    
    // Start game loop
    gameRunning = true;
    gameLoopId = requestAnimationFrame(gameLoop);
    
    // Start generating pipes
    pipeGeneratorId = setInterval(generatePipe, PIPE_INTERVAL);
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Apply gravity
    cube.velocity += GRAVITY;
    cube.y += cube.velocity;
    
    // Update cube position
    cubeElement.style.top = `${cube.y}px`;
    
    // Rotate cube based on velocity
    if (cube.velocity > 0) {
        cubeElement.className = 'cube falling';
    } else {
        cubeElement.className = 'cube jumping';
    }
    
    // Move pipes
    movePipes();
    
    // Check collisions
    checkCollisions();
    
    // Continue game loop
    gameLoopId = requestAnimationFrame(gameLoop);
}

// Jump
function jump() {
    if (!gameRunning) return;
    cube.velocity = JUMP_FORCE;
}

// Generate pipe
function generatePipe() {
    if (!gameRunning) return;
    
    // Random height for top pipe
    const topHeight = Math.floor(Math.random() * (gameArea.offsetHeight - PIPE_GAP - 100)) + 50;
    const bottomHeight = gameArea.offsetHeight - topHeight - PIPE_GAP;
    
    // Create top pipe
    const topPipe = document.createElement('div');
    topPipe.className = 'pipe top';
    topPipe.style.height = `${topHeight}px`;
    topPipe.style.right = '-60px';
    gameArea.appendChild(topPipe);
    
    // Create bottom pipe
    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'pipe bottom';
    bottomPipe.style.height = `${bottomHeight}px`;
    bottomPipe.style.right = '-60px';
    gameArea.appendChild(bottomPipe);
    
    // Add to pipes array
    pipes.push({
        top: topPipe,
        bottom: bottomPipe,
        passed: false
    });
}

// Move pipes
function movePipes() {
    pipes.forEach((pipe, index) => {
        // Move pipes to the left
        const currentRight = parseInt(pipe.top.style.right) || 0;
        const newRight = currentRight + PIPE_SPEED;
        pipe.top.style.right = `${newRight}px`;
        pipe.bottom.style.right = `${newRight}px`;
        
        // Check if pipe has passed the cube
        if (!pipe.passed && newRight > 100) {
            pipe.passed = true;
            score++;
            scoreElement.textContent = score;
        }
        
        // Remove pipes that are off-screen
        if (newRight > gameArea.offsetWidth) {
            pipe.top.remove();
            pipe.bottom.remove();
            pipes.splice(index, 1);
        }
    });
}

// Check collisions
function checkCollisions() {
    const cubeRect = {
        x: 100,
        y: cube.y,
        width: cubeElement.offsetWidth,
        height: cubeElement.offsetHeight
    };
    
    // Check ground and ceiling collision
    if (cube.y <= 0 || cube.y + cubeElement.offsetHeight >= gameArea.offsetHeight) {
        gameOver();
        return;
    }
    
    // Check pipe collisions
    for (const pipe of pipes) {
        const topPipeRect = {
            x: gameArea.offsetWidth - parseInt(pipe.top.style.right) - pipe.top.offsetWidth,
            y: 0,
            width: pipe.top.offsetWidth,
            height: pipe.top.offsetHeight
        };
        
        const bottomPipeRect = {
            x: gameArea.offsetWidth - parseInt(pipe.bottom.style.right) - pipe.bottom.offsetWidth,
            y: gameArea.offsetHeight - pipe.bottom.offsetHeight,
            width: pipe.bottom.offsetWidth,
            height: pipe.bottom.offsetHeight
        };
        
        if (
            // Top pipe collision
            cubeRect.x < topPipeRect.x + topPipeRect.width &&
            cubeRect.x + cubeRect.width > topPipeRect.x &&
            cubeRect.y < topPipeRect.y + topPipeRect.height
        ) {
            gameOver();
            return;
        }
        
        if (
            // Bottom pipe collision
            cubeRect.x < bottomPipeRect.x + bottomPipeRect.width &&
            cubeRect.x + cubeRect.width > bottomPipeRect.x &&
            cubeRect.y + cubeRect.height > bottomPipeRect.y
        ) {
            gameOver();
            return;
        }
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(gameLoopId);
    clearInterval(pipeGeneratorId);
    
    finalScoreElement.textContent = score;
    gameOverElement.classList.add('show');
}