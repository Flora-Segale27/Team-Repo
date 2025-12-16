// Game state
let gameState = {
    deck: [],
    tableau: [[], [], [], [], [], [], []],
    foundations: [[], [], [], []],
    stock: [],
    waste: [],
    score: 0,
    timer: 0,
    timerInterval: null,
    moves: [], // For undo functionality
    isHintActive: false,
    highlightedCard: null
};
// DOM elements
const elements = {
    menu: document.getElementById('menu'),
    gameover: document.getElementById('gameover'),
    gameScreen: document.getElementById('game_screen'),
    newGameBtn: document.getElementById('new_game'),
    newGameBtn1: document.getElementById('new_game1'),
    menuReturn: document.getElementById('menu_return'),
    instructions: document.getElementById('instructions'),
    instructionsmodel: document.getElementById('instructions_model'),
    closeBtn: document.querySelector('.close'),
    hintBtn: document.getElementById('hint_btn'),
    undoBtn: document.getElementById('undo_btn'),
    restartBtn: document.getElementById('restart_btn'),
    playAgainBtn: document.getElementById('play_again_btn'),
    scoreValue: document.getElementById('score_value'),
    timerValue: document.getElementById('timer_value'),
    finalScore: document.getElementById('final_score'),
    finalTime: document.getElementById('final_time'),
    winScore: document.getElementById('win_score'),
    winTime: document.getElementById('win_time'),
    winMessage: document.getElementById('win_message'),
    stockPile: document.getElementById('stock'),
    wastePile: document.getElementById('waste'),
    foundationPiles: [
        document.getElementById('foundation_0'),
        document.getElementById('foundation_1'),
        document.getElementById('foundation_2'),
        document.getElementById('foundation_3')
    ],
    tableauPiles: [
        document.getElementById('tableau_0'),
        document.getElementById('tableau_1'),
        document.getElementById('tableau_2'),
        document.getElementById('tableau_3'),
        document.getElementById('tableau_4'),
        document.getElementById('tableau_5'),
        document.getElementById('tableau_6')
    ]
};
// Card suits and values
const suits = ['♠', '♥', '♦', '♣'];
const suitColors = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valueRank = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
// Initialize the game
function initGame() {
    // Reset game state
    gameState = {
        deck: [],
        tableau: [[], [], [], [], [], [], []],
        foundations: [[], [], [], []],
        stock: [],
        waste: [],
        score: 0,
        timer: 0,
        timerInterval: null,
        moves: [],
        isHintActive: false,
        highlightedCard: null
    };
    // Create a new deck
    createDeck();
    shuffleDeck();
    dealCards();
    // Update UI
    updateScore();
    startTimer();
    renderGame();
    // Show game screen
    elements.menu.style.display = 'none';
    elements.gameover.style.display = 'none';
    elements.gameScreen.style.display = 'block';
    elements.winMessage.style.display = 'none';
}
// Create a standard 52-card deck
function createDeck() {
    gameState.deck = [];
    for (let suit of suits) {
        for (let value of values) {
            gameState.deck.push({ suit, value, faceUp: false });
        }
    }
}
// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck() {
    for (let i = gameState.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
    }
}
// Deal cards to tableau
function dealCards() {
    // Deal to tableau piles
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = gameState.deck.pop();
            if (j === i) {
                card.faceUp = true;
            }
            gameState.tableau[i].push(card);
        }
    }
    // Remaining cards go to stock
    gameState.stock = gameState.deck;
    gameState.deck = [];
    // Save initial state for undo
    saveGameState();
}
// Save current game state for undo
function saveGameState() {
    // Create deep copies of all state arrays
    const stateCopy = {
        tableau: gameState.tableau.map(pile => [...pile]),
        foundations: gameState.foundations.map(pile => [...pile]),
        stock: [...gameState.stock],
        waste: [...gameState.waste],
        score: gameState.score
    };
    gameState.moves.push(stateCopy);
}
// Restore previous game state
function restorePreviousState() {
    if (gameState.moves.length <= 1) return;
    // Remove the current state
    gameState.moves.pop();
    // Get the previous state
    const previousState = gameState.moves[gameState.moves.length - 1];
    // Restore all state properties
    gameState.tableau = previousState.tableau.map(pile => [...pile]);
    gameState.foundations = previousState.foundations.map(pile => [...pile]);
    gameState.stock = [...previousState.stock];
    gameState.waste = [...previousState.waste];
    gameState.score = previousState.score;
    // Update UI
    updateScore();
    renderGame();
}
// Start the game timer
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    gameState.timer = 0;
    updateTimer();
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateTimer();
    }, 1000);
}
// Update timer display
function updateTimer() {
    const minutes = Math.floor(gameState.timer / 60).toString().padStart(2, '0');
    const seconds = (gameState.timer % 60).toString().padStart(2, '0');
    elements.timerValue.textContent = `${minutes}:${seconds}`;
}
// Update score display
function updateScore() {
    elements.scoreValue.textContent = gameState.score;
}