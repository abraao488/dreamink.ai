// Game state
let gameState = 'ready'; // ready, waiting, active, result
let startTime = 0;
let reactionTime = 0;
let bestScore = Infinity;
let timeoutId;

// DOM Elements
const gameArea = document.getElementById('game-area');
const target = document.getElementById('target');
const readyScreen = document.getElementById('ready-screen');
const waitScreen = document.getElementById('wait-screen');
const resultsScreen = document.getElementById('results');
const reactionTimeElement = document.getElementById('reaction-time');
const bestScoreElement = document.getElementById('best-score');
const resultTimeElement = document.getElementById('result-time');
const resultMessageElement = document.getElementById('result-message');
const nextRoundBtn = document.getElementById('next-round-btn');
const backBtn = document.getElementById('back-btn');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    loadBestScore();
    setupEventListeners();
    showReadyScreen();
});

// Load best score from localStorage
function loadBestScore() {
    const savedScore = localStorage.getItem('reflexBestScore');
    if (savedScore !== null) {
        bestScore = parseInt(savedScore);
        bestScoreElement.textContent = `${bestScore}ms`;
    }
}

// Save best score to localStorage
function saveBestScore() {
    if (reactionTime < bestScore) {
        bestScore = reactionTime;
        bestScoreElement.textContent = `${bestScore}ms`;
        localStorage.setItem('reflexBestScore', bestScore.toString());
    }
}

// Set up event listeners
function setupEventListeners() {
    target.addEventListener('click', handleTargetClick);
    nextRoundBtn.addEventListener('click', startNextRound);
    backBtn.addEventListener('click', () => {
        window.location.href = '../../public/index.html';
    });
}

// Show ready screen
function showReadyScreen() {
    gameState = 'ready';
    readyScreen.style.display = 'flex';
    waitScreen.style.display = 'none';
    target.style.display = 'none';
    resultsScreen.classList.remove('show');
}

// Start next round
function startNextRound() {
    showReadyScreen();
}

// Start waiting phase
function startWaitingPhase() {
    gameState = 'waiting';
    readyScreen.style.display = 'none';
    waitScreen.style.display = 'flex';
    target.style.display = 'none';
    
    // Random delay between 1 and 5 seconds
    const delay = Math.floor(Math.random() * 4000) + 1000;
    
    timeoutId = setTimeout(() => {
        startActivePhase();
    }, delay);
}

// Start active phase
function startActivePhase() {
    gameState = 'active';
    waitScreen.style.display = 'none';
    
    // Position target randomly within game area
    const maxX = gameArea.offsetWidth - target.offsetWidth;
    const maxY = gameArea.offsetHeight - target.offsetHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    target.style.left = `${randomX}px`;
    target.style.top = `${randomY}px`;
    target.style.display = 'block';
    
    // Record start time
    startTime = Date.now();
}

// Handle target click
function handleTargetClick() {
    if (gameState !== 'active') return;
    
    // Calculate reaction time
    const endTime = Date.now();
    reactionTime = endTime - startTime;
    
    // Update UI
    reactionTimeElement.textContent = `${reactionTime}ms`;
    
    // Show results
    showResults();
}

// Show results
function showResults() {
    gameState = 'result';
    target.style.display = 'none';
    resultTimeElement.textContent = reactionTime;
    
    // Determine message based on reaction time
    let message = '';
    if (reactionTime < 200) {
        message = 'Excelente! Você tem reflexos incríveis!';
    } else if (reactionTime < 300) {
        message = 'Muito bom! Seus reflexos são rápidos.';
    } else if (reactionTime < 400) {
        message = 'Bom trabalho! Continue praticando.';
    } else {
        message = 'Continue treinando seus reflexos!';
    }
    
    resultMessageElement.textContent = message;
    
    // Save best score
    saveBestScore();
    
    // Show results screen
    resultsScreen.classList.add('show');
}

// Event listener for game area click (to start waiting phase)
gameArea.addEventListener('click', () => {
    if (gameState === 'ready') {
        startWaitingPhase();
    }
});