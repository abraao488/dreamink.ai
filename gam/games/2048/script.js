// Game constants
const GRID_SIZE = 4;
const CELL_SIZE = 100;

// Game state
let grid = [];
let score = 0;
let bestScore = 0;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const newGameBtn = document.getElementById('new-game-btn');
const retryBtn = document.getElementById('retry-btn');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');
const backBtn = document.getElementById('back-btn');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadBestScore();
    setupEventListeners();
    initGame();
});

// Load best score from localStorage
function loadBestScore() {
    const savedScore = localStorage.getItem('2048BestScore');
    if (savedScore !== null) {
        bestScore = parseInt(savedScore);
        bestScoreElement.textContent = bestScore;
    }
}

// Save best score to localStorage
function saveBestScore() {
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        localStorage.setItem('2048BestScore', bestScore.toString());
    }
}

// Set up event listeners
function setupEventListeners() {
    document.addEventListener('keydown', handleKeyPress);
    newGameBtn.addEventListener('click', initGame);
    retryBtn.addEventListener('click', initGame);
    backBtn.addEventListener('click', () => {
        window.location.href = '../../public/index.html';
    });
}

// Initialize game
function initGame() {
    // Reset grid
    grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
    
    // Reset score
    score = 0;
    scoreElement.textContent = score;
    
    // Hide game message
    gameMessage.classList.remove('show');
    
    // Add two initial tiles
    addRandomTile();
    addRandomTile();
    
    // Render grid
    renderGrid();
}

// Add a random tile to the grid
function addRandomTile() {
    // Find empty cells
    const emptyCells = [];
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    // If there are empty cells, add a new tile
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        // 90% chance for 2, 10% chance for 4
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Render grid
function renderGrid() {
    // Clear board
    gameBoard.innerHTML = '';
    
    // Create grid cells
    for (let row = 0; row < GRID_SIZE; row++) {
        const rowElement = document.createElement('div');
        rowElement.className = 'grid-row';
        
        for (let col = 0; col < GRID_SIZE; col++) {
            const cellElement = document.createElement('div');
            cellElement.className = 'grid-cell';
            rowElement.appendChild(cellElement);
        }
        
        gameBoard.appendChild(rowElement);
    }
    
    // Add tiles
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] !== 0) {
                addTile(row, col, grid[row][col]);
            }
        }
    }
}

// Add tile to the board
function addTile(row, col, value) {
    const tile = document.createElement('div');
    tile.className = `tile tile-${value}`;
    tile.textContent = value;
    tile.style.width = `${CELL_SIZE - 20}px`;
    tile.style.height = `${CELL_SIZE - 20}px`;
    tile.style.top = `${row * CELL_SIZE + 10}px`;
    tile.style.left = `${col * CELL_SIZE + 10}px`;
    
    gameBoard.appendChild(tile);
}

// Handle key press
function handleKeyPress(e) {
    let moved = false;
    
    switch (e.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        default:
            return;
    }
    
    if (moved) {
        // Add a new tile
        addRandomTile();
        
        // Render updated grid
        renderGrid();
        
        // Check for win or loss
        checkGameStatus();
    }
}

// Move tiles up
function moveUp() {
    let moved = false;
    
    for (let col = 0; col < GRID_SIZE; col++) {
        // Get column values
        const column = [];
        for (let row = 0; row < GRID_SIZE; row++) {
            if (grid[row][col] !== 0) {
                column.push(grid[row][col]);
            }
        }
        
        // Merge tiles
        const merged = mergeTiles(column);
        
        // Update grid
        for (let row = 0; row < GRID_SIZE; row++) {
            const newValue = merged[row] || 0;
            if (grid[row][col] !== newValue) {
                moved = true;
            }
            grid[row][col] = newValue;
        }
    }
    
    return moved;
}

// Move tiles down
function moveDown() {
    let moved = false;
    
    for (let col = 0; col < GRID_SIZE; col++) {
        // Get column values
        const column = [];
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
            if (grid[row][col] !== 0) {
                column.push(grid[row][col]);
            }
        }
        
        // Merge tiles
        const merged = mergeTiles(column);
        
        // Update grid
        for (let row = GRID_SIZE - 1; row >= 0; row--) {
            const newValue = merged[GRID_SIZE - 1 - row] || 0;
            if (grid[row][col] !== newValue) {
                moved = true;
            }
            grid[row][col] = newValue;
        }
    }
    
    return moved;
}

// Move tiles left
function moveLeft() {
    let moved = false;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        // Get row values
        const rowData = [];
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] !== 0) {
                rowData.push(grid[row][col]);
            }
        }
        
        // Merge tiles
        const merged = mergeTiles(rowData);
        
        // Update grid
        for (let col = 0; col < GRID_SIZE; col++) {
            const newValue = merged[col] || 0;
            if (grid[row][col] !== newValue) {
                moved = true;
            }
            grid[row][col] = newValue;
        }
    }
    
    return moved;
}

// Move tiles right
function moveRight() {
    let moved = false;
    
    for (let row = 0; row < GRID_SIZE; row++) {
        // Get row values
        const rowData = [];
        for (let col = GRID_SIZE - 1; col >= 0; col--) {
            if (grid[row][col] !== 0) {
                rowData.push(grid[row][col]);
            }
        }
        
        // Merge tiles
        const merged = mergeTiles(rowData);
        
        // Update grid
        for (let col = GRID_SIZE - 1; col >= 0; col--) {
            const newValue = merged[GRID_SIZE - 1 - col] || 0;
            if (grid[row][col] !== newValue) {
                moved = true;
            }
            grid[row][col] = newValue;
        }
    }
    
    return moved;
}

// Merge tiles
function mergeTiles(line) {
    const merged = [];
    
    for (let i = 0; i < line.length; i++) {
        if (i < line.length - 1 && line[i] === line[i + 1]) {
            // Merge tiles
            const newValue = line[i] * 2;
            merged.push(newValue);
            score += newValue;
            scoreElement.textContent = score;
            i++; // Skip next tile
        } else {
            merged.push(line[i]);
        }
    }
    
    // Pad with zeros to maintain grid size
    while (merged.length < GRID_SIZE) {
        merged.push(0);
    }
    
    return merged;
}

// Check game status (win or lose)
function checkGameStatus() {
    // Check for win (2048 tile)
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 2048) {
                showMessage('Você venceu!', true);
                saveBestScore();
                return;
            }
        }
    }
    
    // Check for possible moves
    if (isGameOver()) {
        showMessage('Fim de jogo!', false);
        saveBestScore();
    }
}

// Check if game is over
function isGameOver() {
    // Check for empty cells
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            if (grid[row][col] === 0) {
                return false;
            }
        }
    }
    
    // Check for possible merges horizontally
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE - 1; col++) {
            if (grid[row][col] === grid[row][col + 1]) {
                return false;
            }
        }
    }
    
    // Check for possible merges vertically
    for (let col = 0; col < GRID_SIZE; col++) {
        for (let row = 0; row < GRID_SIZE - 1; row++) {
            if (grid[row][col] === grid[row + 1][col]) {
                return false;
            }
        }
    }
    
    return true;
}

// Show message
function showMessage(text, isWin) {
    messageText.textContent = text;
    messageText.style.color = isWin ? '#6a5acd' : '#ff6b6b';
    gameMessage.classList.add('show');
}