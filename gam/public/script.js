// Game data
const games = [
    {
        id: 'snake',
        title: 'Cobrinha',
        icon: 'fa-snake',
        category: 'reflexo',
        description: 'Controle a cobrinha e coma a maior quantidade de frutas possível!'
    },
    {
        id: 'memory',
        title: 'Jogo da Memória',
        icon: 'fa-brain',
        category: 'memoria',
        description: 'Encontre todos os pares de cartas iguais no menor tempo possível.'
    },
    {
        id: 'flappy',
        title: 'Flappy Cube',
        icon: 'fa-cube',
        category: 'habilidade',
        description: 'Ajude o cubo a voar entre os obstáculos sem cair!'
    },
    {
        id: 'reflex',
        title: 'Reflexo Rápido',
        icon: 'fa-bolt',
        category: 'reflexo',
        description: 'Clique no botão que aparece o mais rápido que conseguir!'
    },
    {
        id: '2048',
        title: '2048 Lite',
        icon: 'fa-puzzle-piece',
        category: 'quebra-cabeca',
        description: 'Combine os números até chegar no 2048!'
    }
];

// DOM Elements
const gamesGrid = document.getElementById('games-grid');
const categoryButtons = document.querySelectorAll('.category-btn');
const searchInput = document.getElementById('search-input');
const profileModal = document.getElementById('profile-modal');
const openProfileBtn = document.getElementById('open-profile');
const closeProfileBtn = document.querySelector('.close');
const saveProfileBtn = document.getElementById('save-profile');
const playerNameInput = document.getElementById('player-name');
const playerAvatarSelect = document.getElementById('player-avatar');
const playerDisplay = document.getElementById('player-display');
const loadingScreen = document.getElementById('loading-screen');

// Player data
let playerData = {
    name: 'Jogador',
    avatar: 'fa-user',
    scores: {}
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load player data from localStorage
    loadPlayerData();
    
    // Render games
    renderGames(games);
    
    // Set up event listeners
    setupEventListeners();
    
    // Hide loading screen after a delay
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
    }, 1500);
});

// Load player data from localStorage
function loadPlayerData() {
    const savedData = localStorage.getItem('miniplayPlayerData');
    if (savedData) {
        playerData = JSON.parse(savedData);
    }
    updatePlayerDisplay();
}

// Save player data to localStorage
function savePlayerData() {
    localStorage.setItem('miniplayPlayerData', JSON.stringify(playerData));
    updatePlayerDisplay();
}

// Update player display in header
function updatePlayerDisplay() {
    playerDisplay.innerHTML = `<i class="fas ${playerData.avatar}"></i> ${playerData.name}`;
}

// Render games to the grid
function renderGames(gamesToShow) {
    gamesGrid.innerHTML = '';
    
    gamesToShow.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-icon">
                <i class="fas ${game.icon}"></i>
            </div>
            <div class="game-info">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
                <button class="play-btn" data-game="${game.id}">Jogar</button>
            </div>
        `;
        gamesGrid.appendChild(gameCard);
    });
    
    // Add event listeners to play buttons
    document.querySelectorAll('.play-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const gameId = e.target.getAttribute('data-game');
            playGame(gameId);
        });
    });
}

// Filter games by category
function filterGamesByCategory(category) {
    if (category === 'all') {
        renderGames(games);
    } else {
        const filteredGames = games.filter(game => game.category === category);
        renderGames(filteredGames);
    }
}

// Search games
function searchGames(query) {
    if (!query) {
        renderGames(games);
        return;
    }
    
    const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase())
    );
    renderGames(filteredGames);
}

// Play a game
function playGame(gameId) {
    // Show loading screen
    loadingScreen.style.opacity = '1';
    loadingScreen.style.visibility = 'visible';
    
    // Simulate loading time
    setTimeout(() => {
        window.location.href = `../games/${gameId}/index.html`;
    }, 1000);
}

// Set up event listeners
function setupEventListeners() {
    // Category filtering
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter games
            const category = button.getAttribute('data-category');
            filterGamesByCategory(category);
        });
    });
    
    // Search functionality
    searchInput.addEventListener('input', () => {
        searchGames(searchInput.value);
    });
    
    // Profile modal
    openProfileBtn.addEventListener('click', () => {
        playerNameInput.value = playerData.name;
        playerAvatarSelect.value = playerData.avatar;
        profileModal.style.display = 'block';
    });
    
    closeProfileBtn.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
    
    // Save profile
    saveProfileBtn.addEventListener('click', () => {
        playerData.name = playerNameInput.value || 'Jogador';
        playerData.avatar = playerAvatarSelect.value;
        savePlayerData();
        profileModal.style.display = 'none';
    });
}