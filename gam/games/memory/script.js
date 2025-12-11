// Game constants
const ICONS = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍒', '🍑', '🥝'];
const PAIRS = 8;
const TOTAL_CARDS = PAIRS * 2;

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let timerEnabled = false;
let gameStarted = false;

// DOM Elements
const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const startBtn = document.getElementById('start-btn');
const timerToggle = document.getElementById('timer-toggle');
const winMessage = document.getElementById('win-message');
const winTimeElement = document.getElementById('win-time');
const winMovesElement = document.getElementById('win-moves');
const playAgainBtn = document.getElementById('play-again-btn');
const backBtn = document.getElementById('back-btn');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    timerToggle.addEventListener('change', toggleTimer);
    playAgainBtn.addEventListener('click', startGame);
    backBtn.addEventListener('click', () => {
        window.location.href = '../../public/index.html';
    });
}

// Toggle timer
function toggleTimer() {
    timerEnabled = timerToggle.checked;
}

// Start game
function startGame() {
    // Reset game state
    resetGame();
    
    // Create cards
    createCards();
    
    // Shuffle and display cards
    shuffleCards();
    renderCards();
    
    // Start timer if enabled
    if (timerEnabled) {
        startTimer();
    }
    
    // Update UI
    gameStarted = true;
    startBtn.textContent = 'Reiniciar Jogo';
    winMessage.classList.remove('show');
}

// Reset game state
function resetGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Update UI
    timerElement.textContent = '0s';
    movesElement.textContent = '0';
}

// Create cards
function createCards() {
    // Create pairs of cards
    for (let i = 0; i < PAIRS; i++) {
        const icon = ICONS[i];
        cards.push({ id: i, icon: icon });
        cards.push({ id: i, icon: icon });
    }
}

// Shuffle cards
function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
}

// Render cards
function renderCards() {
    gameBoard.innerHTML = '';
    
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${card.icon}</div>
                <div class="card-back"></div>
            </div>
        `;
        
        cardElement.addEventListener('click', () => flipCard(index));
        gameBoard.appendChild(cardElement);
    });
}

// Flip card
function flipCard(index) {
    // Don't flip if game hasn't started or card is already flipped/matched
    if (!gameStarted || flippedCards.length >= 2 || 
        cards[index].flipped || cards[index].matched) {
        return;
    }
    
    // Flip the card
    const cardElement = document.querySelector(`.card[data-index="${index}"]`);
    cardElement.classList.add('flipped');
    cards[index].flipped = true;
    flippedCards.push(index);
    
    // Check for match when two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        
        const firstIndex = flippedCards[0];
        const secondIndex = flippedCards[1];
        
        if (cards[firstIndex].id === cards[secondIndex].id) {
            // Match found
            setTimeout(() => {
                document.querySelector(`.card[data-index="${firstIndex}"]`).classList.add('matched');
                document.querySelector(`.card[data-index="${secondIndex}"]`).classList.add('matched');
                
                cards[firstIndex].matched = true;
                cards[secondIndex].matched = true;
                
                flippedCards = [];
                matchedPairs++;
                
                // Check for win
                if (matchedPairs === PAIRS) {
                    endGame();
                }
            }, 500);
        } else {
            // No match, flip cards back
            setTimeout(() => {
                document.querySelector(`.card[data-index="${firstIndex}"]`).classList.remove('flipped');
                document.querySelector(`.card[data-index="${secondIndex}"]`).classList.remove('flipped');
                
                cards[firstIndex].flipped = false;
                cards[secondIndex].flipped = false;
                
                flippedCards = [];
            }, 1000);
        }
    }
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = `${timer}s`;
    }, 1000);
}

// End game
function endGame() {
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Show win message
    winTimeElement.textContent = timer;
    winMovesElement.textContent = moves;
    winMessage.classList.add('show');
    
    // Save score
    saveScore();
}

// Save score to localStorage
function saveScore() {
    const scores = JSON.parse(localStorage.getItem('memoryScores') || '[]');
    scores.push({
        time: timer,
        moves: moves,
        date: new Date().toISOString()
    });
    
    // Sort by time and keep only top 5
    scores.sort((a, b) => a.time - b.time);
    if (scores.length > 5) {
        scores.splice(5);
    }
    
    localStorage.setItem('memoryScores', JSON.stringify(scores));
}