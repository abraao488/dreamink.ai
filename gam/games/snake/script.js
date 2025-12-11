// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

// Game state
let snake = [];
let food = {};
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameInterval;
let gameRunning = false;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const finalScoreElement = document.getElementById('final-score');
const gameOverElement = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    createGameBoard();
    initGame();
    setupEventListeners();
});

// Create game board
function createGameBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`;
    
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${Math.floor(i / GRID_SIZE)}-${i % GRID_SIZE}`;
        gameBoard.appendChild(cell);
    }
}

// Initialize game state
function initGame() {
    // Reset snake
    snake = [
        {x: 10, y: 10},
        {x: 9, y: 10},
        {x: 8, y: 10}
    ];
    
    // Reset direction
    direction = 'right';
    nextDirection = 'right';
    
    // Reset score
    score = 0;
    scoreElement.textContent = score;
    
    // Generate food
    generateFood();
    
    // Draw initial state
    draw();
    
    // Hide game over screen
    gameOverElement.classList.remove('show');
}

// Start the game
function startGame() {
    if (gameRunning) return;
    
    gameRunning = true;
    gameInterval = setInterval(moveSnake, INITIAL_SPEED);
}

// Stop the game
function stopGame() {
    gameRunning = false;
    clearInterval(gameInterval);
}

// Generate food at random position
function generateFood() {
    let newFood;
    let foodOnSnake;
    
    do {
        foodOnSnake = false;
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        
        // Check if food is on snake
        for (let segment of snake) {
            if (segment.x === newFood.x && segment.y === newFood.y) {
                foodOnSnake = true;
                break;
            }
        }
    } while (foodOnSnake);
    
    food = newFood;
}

// Move snake
function moveSnake() {
    // Update direction
    direction = nextDirection;
    
    // Calculate new head position
    const head = {...snake[0]};
    
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }
    
    // Check collision with walls
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return;
    }
    
    // Check collision with self
    for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
            gameOver();
            return;
        }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
        // Increase score
        score += 10;
        scoreElement.textContent = score;
        
        // Generate new food
        generateFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }
    
    // Draw updated state
    draw();
}

// Draw game state
function draw() {
    // Clear board
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.className = 'cell';
    });
    
    // Draw snake
    snake.forEach((segment, index) => {
        const cell = document.getElementById(`cell-${segment.y}-${segment.x}`);
        if (cell) {
            cell.classList.add('snake');
        }
    });
    
    // Draw food
    const foodCell = document.getElementById(`cell-${food.y}-${food.x}`);
    if (foodCell) {
        foodCell.classList.add('food');
    }
}

// Game over
function gameOver() {
    stopGame();
    finalScoreElement.textContent = score;
    gameOverElement.classList.add('show');
}

// Handle keyboard input
function handleKeydown(e) {
    if (!gameRunning && e.key === ' ') {
        startGame();
        return;
    }
    
    switch (e.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeydown);
    
    // Restart button
    restartBtn.addEventListener('click', () => {
        initGame();
        startGame();
    });
    
    // Back button
    backBtn.addEventListener('click', () => {
        window.location.href = '../../public/index.html';
    });
    
    // Start game on first key press
    document.addEventListener('keydown', () => {
        if (!gameRunning) {
            startGame();
        }
    }, { once: true });
}