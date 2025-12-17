---
layout: opencs
title: Solitaire Game
permalink: /solitaire/
---

<!-- Here is the styling -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solitaire Game</title>
    <style>
        /* Global Styles */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #0b3d0b, #145214);
            color: #f1f1f1;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }
        .wrap {
            margin-left: auto;
            margin-right: auto;
            max-width: 1000px;
            width: 100%;
        }
        /* Header */
        .game-title {
            text-align: center;
            font-size: 2.5rem;
            margin: 20px 0;
            font-weight: bold;
            color: #2ecc71;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.4);
            padding: 10px;
        }
        /* Container */
        .container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(10px);
            width: 100%;
            max-width: 1000px;
        }
        .game-container {
            display: none;
            padding: 20px;
            background: linear-gradient(145deg, #0f7b0f, #0c630c);
            border-radius: 12px;
            min-height: 600px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        }
        .game-container:focus {
            outline: none;
        }
        /* Menus & text */
        #gameover p, #menu p {
            font-size: 20px;
            margin: 8px 0;
            text-align: center;
        }
        #gameover a, #menu a {
            font-size: 24px;
            display: inline-block;
            margin: 15px 10px;
            padding: 12px 24px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease-in-out;
            text-decoration: none;
            color: #fff;
            font-weight: bold;
            letter-spacing: 1px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
        #gameover a:hover, #menu a:hover {
            cursor: pointer;
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        #gameover a:hover::before, #menu a:hover::before {
            content: ">";
            margin-right: 10px;
            color: #ffd700;
        }
        #menu {
            display: block;
        }
        #gameover {
            display: none;
        }
        /* Game Board Styles */
        .game-board {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 12px;
            margin-top: 20px;
        }
        .foundation-row {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 12px;
            margin-bottom: 20px;
        }
        .card-pile {
            width: 80px;
            height: 110px;
            position: relative;
            background: transparent;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
        }
        .card-pile:hover {
            transform: translateY(-4px);
        }
        .card-pile.empty {
            background: rgba(255, 255, 255, 0.05);
            border: 2px dashed rgba(255, 255, 255, 0.3);
        }
        .card-pile.foundation {
            background: rgba(255, 255, 255, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.5);
        }
        .card {
            width: 76px;
            height: 106px;
            border: 1px solid #111;
            border-radius: 8px;
            background: #fff;
            position: absolute;
            cursor: grab;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 4px;
            font-size: 13px;
            font-weight: bold;
            user-select: none;
            transition: transform 0.15s ease;
            z-index: 10;
        }
        .card:active {
            cursor: grabbing;
            transform: scale(1.08);
            z-index: 1000;
        }
        .card.red {
            color: #d40000;
        }
        .card.black {
            color: #000;
        }
        .card.face-down {
            background: #004d9f;
            background-image: repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(255,255,255,.15) 10px,
                rgba(255,255,255,.15) 20px
            );
            border: 1px solid #003366;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .card.face-down::before {
            content: "";
            width: 30px;
            height: 30px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255,255,255,0.2);
        }
        .card.face-down * {
            display: none;
        }
        .card.dragging {
            z-index: 1000;
            transform: rotate(4deg) scale(1.1);
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .card.highlighted {
            box-shadow: 0 0 15px #ff0;
            border: 2px solid gold;
        }
        .card-top {
            text-align: left;
        }
        .card-bottom {
            text-align: right;
            transform: rotate(180deg);
        }
        .suit {
            font-size: 18px;
            line-height: 1;
        }
        .tableau-pile {
            min-height: 320px;
        }
        .stock-pile, .waste-pile {
            width: 80px;
            height: 110px;
        }
        .game-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .score-display {
            color: #fff;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .timer-display {
            color: #eee;
            font-size: 16px;
        }
        .game-buttons {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .game-buttons button {
            padding: 10px 18px;
            background: linear-gradient(135deg, #4CAF50, #3a9440);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            transition: all 0.2s ease;
            min-width: 100px;
        }
        .game-buttons button:hover {
            background: linear-gradient(135deg, #45a049, #327c36);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        .win-message {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 35px;
            border-radius: 16px;
            text-align: center;
            font-size: 24px;
            z-index: 2000;
            display: none;
            animation: popin 0.5s ease forwards;
            box-shadow: 0 0 30px rgba(255,215,0,0.7);
            border: 2px solid gold;
        }
        .win-message h3 {
            color: gold;
            margin-bottom: 15px;
            font-size: 28px;
        }
        .win-message p {
            margin: 8px 0;
        }
        @keyframes popin {
            from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        /* model Styles */
        .model {
            position: fixed;
            z-index: 2000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.85);
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .model-content {
            background-color: #f8f9fa; 
            margin: 5% auto;
            padding: 30px;
            border: 1px solid #888;
            width: 90%;
            max-width: 700px;
            border-radius: 16px;
            max-height: 80vh;
            overflow-y: auto;
            color: #000;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            animation: slidein 0.4s ease;
        }
        @keyframes slidein {
            from { transform: translateY(-30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .close {
            color: #6c757d;
            float: right;
            font-size: 36px;
            font-weight: bold;
            cursor: pointer;
            transition: color 0.2s ease;
        }
        .close:hover,
        .close:focus {
            color: #d40000;
            text-decoration: none;
        }
        .instructions-container h4 {
            margin-top: 20px;
            color: #2c3e50;
            border-bottom: 2px solid #eee;
            padding-bottom: 8px;
            font-size: 18px;
        }
        .instructions-container ul {
            padding-left: 22px;
            line-height: 1.7;
            margin: 10px 0;
        }
        .highlight-box {
            background-color: #d4f7d4;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #27ae60;
            margin: 15px 0;
        }
        /* Responsive Design */
        @media (max-width: 768px) {
            .game-title {
                font-size: 2rem;
            }
            .foundation-row, .game-board {
                grid-template-columns: repeat(7, 1fr);
                gap: 8px;
            }
            .card-pile {
                width: 60px;
                height: 82px;
            }
            .card {
                width: 58px;
                height: 78px;
                font-size: 11px;
                padding: 3px;
            }
            .suit {
                font-size: 14px;
            }
            .game-controls {
                flex-direction: column;
                align-items: stretch;
            }
            .score-display, .timer-display {
                text-align: center;
            }
            .game-buttons {
                justify-content: center;
            }
            .win-message {
                width: 90%;
                padding: 25px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Main Menu -->
        <div id="menu" class="py-4 text-light">
            <p class="intro-text">Welcome to <strong>Klondike Solitaire</strong></p>
            <p class="sub-text">Move all cards to the foundation piles, organized by suit from Ace to King</p>
            <a id="new_game" class="menu-link">➕ New Game</a>
            <a id="instructions" class="menu-link">📖 How to Play</a>
        </div>
        <!-- Game Over -->
        <div id="gameover" class="py-4 text-light">
            <p class="gameover-title">💀 Game Over!</p>
            <p id="final_score" class="result-text">Final Score: 0</p>
            <p id="final_time" class="result-text">Time: 00:00</p>
            <a id="new_game1" class="menu-link">🔄 New Game</a>
            <a id="menu_return" class="menu-link">🏠 Main Menu</a>
        </div>
        <!-- Game Screen -->
        <div id="game_screen" class="game-container" tabindex="1">
            <div class="game-controls">
                <div class="score-display">⭐ Score: <span id="score_value">0</span></div>
                <div class="timer-display">⏱ Time: <span id="timer_value">00:00</span></div>
                <div class="game-buttons">
                    <button id="hint_btn" class="btn-control">💡 Hint</button>
                    <button id="undo_btn" class="btn-control">↩ Undo</button>
                    <button id="restart_btn" class="btn-control">🔄 Restart</button>
                </div>
            </div>
            <div class="foundation-row">
                <div id="stock" class="card-pile stock-pile" data-pile="stock"></div>
                <div id="waste" class="card-pile waste-pile empty" data-pile="waste"></div>
                <div class="card-pile empty"></div>
                <div id="foundation_0" class="card-pile foundation" data-pile="foundation" data-index="0"></div>
                <div id="foundation_1" class="card-pile foundation" data-pile="foundation" data-index="1"></div>
                <div id="foundation_2" class="card-pile foundation" data-pile="foundation" data-index="2"></div>
                <div id="foundation_3" class="card-pile foundation" data-pile="foundation" data-index="3"></div>
            </div>
            <div class="game-board">
                <div id="tableau_0" class="card-pile tableau-pile" data-pile="tableau" data-index="0"></div>
                <div id="tableau_1" class="card-pile tableau-pile" data-pile="tableau" data-index="1"></div>
                <div id="tableau_2" class="card-pile tableau-pile" data-pile="tableau" data-index="2"></div>
                <div id="tableau_3" class="card-pile tableau-pile" data-pile="tableau" data-index="3"></div>
                <div id="tableau_4" class="card-pile tableau-pile" data-pile="tableau" data-index="4"></div>
                <div id="tableau_5" class="card-pile tableau-pile" data-pile="tableau" data-index="5"></div>
                <div id="tableau_6" class="card-pile tableau-pile" data-pile="tableau" data-index="6"></div>
            </div>
            <div id="win_message" class="win-message">
                <h3>🎉 Congratulations!</h3>
                <p>You Won!</p>
                <p id="win_score"></p>
                <p id="win_time"></p>
                <button id="play_again_btn" class="btn-control">Play Again</button>
            </div>
        </div>
    </div>
    <!-- Instructions model -->
    <div id="instructions_model" class="model" style="display: none;">
        <div class="model-content">
            <span class="close">&times;</span>
            <h3>📖 How to Play Klondike Solitaire</h3>
            <div class="instructions-container">
                <h4>Objective</h4>
                <div class="highlight-box">
                    Move all cards to the four foundation piles, building each suit in ascending order from Ace to King.
                </div>
                <h4>Game Layout</h4>
                <ul>
                    <li><strong>Tableau:</strong> Seven piles where you build descending sequences of alternating colors</li>
                    <li><strong>Foundations:</strong> Four piles where you build ascending sequences by suit (Ace to King)</li>
                    <li><strong>Stock:</strong> The deck of remaining cards (click to draw)</li>
                    <li><strong>Waste:</strong> Where drawn cards from the stock are placed</li>
                </ul>
                <h4>Rules</h4>
                <ul>
                    <li>Only Kings can be placed on empty tableau piles</li>
                    <li>Build tableau piles in descending order (King to Ace) with alternating colors</li>
                    <li>Build foundation piles in ascending order (Ace to King) by suit</li>
                    <li>You can move face-up cards from one tableau pile to another</li>
                    <li>You can move cards from the waste pile to tableau or foundation piles</li>
                    <li>Click the stock pile to draw new cards</li>
                    <li>When the stock is empty, you can reset it from the waste pile</li>
                </ul>
                <h4>Scoring</h4>
                <ul>
                    <li>+5 points for each card moved to tableau</li>
                    <li>+10 points for each card moved to foundation</li>
                    <li>+5 points for turning over a face-down card in tableau</li>
                    <li>-100 points for reshuffling the deck</li>
                </ul>
                <h4>Controls</h4>
                <ul>
                    <li><strong>Click:</strong> Select and move cards (or draw from stock)</li>
                    <li><strong>Drag & Drop:</strong> Move cards between piles</li>
                    <li><strong>Hint Button:</strong> Get a suggestion for a move</li>
                    <li><strong>Undo Button:</strong> Reverse your last move</li>
                    <li><strong>Restart Button:</strong> Start a new game</li>
                </ul>
            </div>
        </div>
    </div>
<body>
<head>
 
<script>
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
    instructionsModal: document.getElementById('instructions_model'),
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

// Render the game state
function renderGame() {
    // Clear any existing highlights
    clearCardHighlights();
    
    // Render stock pile
    renderStockPile();
    
    // Render waste pile
    renderWastePile();
    
    // Render foundation piles
    for (let i = 0; i < 4; i++) {
        renderFoundationPile(i);
    }
    
    // Render tableau piles
    for (let i = 0; i < 7; i++) {
        renderTableauPile(i);
    }
    
    // Check for win
    checkWin();
}

// Render stock pile
function renderStockPile() {
    elements.stockPile.innerHTML = '';
    if (gameState.stock.length > 0) {
        const card = document.createElement('div');
        card.className = 'card face-down';
        card.dataset.pile = 'stock';
        elements.stockPile.appendChild(card);
    } else {
        elements.stockPile.classList.add('empty');
    }
}

// Render waste pile
function renderWastePile() {
    elements.wastePile.innerHTML = '';
    if (gameState.waste.length > 0) {
        const card = gameState.waste[gameState.waste.length - 1];
        const cardEl = createCardElement(card, 'waste', 0);
        elements.wastePile.appendChild(cardEl);
        elements.wastePile.classList.remove('empty');
    } else {
        elements.wastePile.classList.add('empty');
    }
}

// Render a foundation pile
function renderFoundationPile(index) {
    const pile = elements.foundationPiles[index];
    pile.innerHTML = '';
    
    if (gameState.foundations[index].length > 0) {
        const card = gameState.foundations[index][gameState.foundations[index].length - 1];
        const cardEl = createCardElement(card, 'foundation', index);
        pile.appendChild(cardEl);
    }
}

// Render a tableau pile
function renderTableauPile(index) {
    const pile = elements.tableauPiles[index];
    pile.innerHTML = '';
    
    const pileCards = gameState.tableau[index];
    if (pileCards.length === 0) {
        pile.classList.add('empty');
        return;
    }
    
    pile.classList.remove('empty');
    
    // Render each card in the pile
    for (let i = 0; i < pileCards.length; i++) {
        const card = pileCards[i];
        const cardEl = createCardElement(card, 'tableau', index, i);
        cardEl.style.top = `${i * 20}px`;
        pile.appendChild(cardEl);
    }
}

// Create a card element
function createCardElement(card, pileType, pileIndex, cardIndex = 0) {
    const cardEl = document.createElement('div');
    cardEl.className = `card ${suitColors[card.suit]}`;
    
    if (!card.faceUp) {
        cardEl.classList.add('face-down');
        cardEl.dataset.pile = pileType;
        cardEl.dataset.pileIndex = pileIndex;
        cardEl.dataset.cardIndex = cardIndex;
        return cardEl;
    }
    
    // Add card data attributes
    cardEl.dataset.pile = pileType;
    cardEl.dataset.pileIndex = pileIndex;
    cardEl.dataset.cardIndex = cardIndex;
    cardEl.dataset.suit = card.suit;
    cardEl.dataset.value = card.value;
    
    // Create card content
    const top = document.createElement('div');
    top.className = 'card-top';
    top.innerHTML = `<span>${card.value}</span><span class="suit">${card.suit}</span>`;
    
    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';
    bottom.innerHTML = `<span>${card.value}</span><span class="suit">${card.suit}</span>`;
    
    cardEl.appendChild(top);
    cardEl.appendChild(bottom);
    
    return cardEl;
}

// Handle stock pile click (draw cards)
function handleStockClick() {
    // Save current state before making a move
    saveGameState();
    
    if (gameState.stock.length === 0) {
        // Move waste back to stock
        while (gameState.waste.length > 0) {
            const card = gameState.waste.pop();
            card.faceUp = false;
            gameState.stock.push(card);
        }
    } else {
        // Draw a card from stock to waste
        const card = gameState.stock.pop();
        card.faceUp = true;
        gameState.waste.push(card);
        gameState.score += 0; // Bonus for drawing
        updateScore();
    }
    
    renderGame();
}

// Check if a card can be moved to a foundation
function canMoveToFoundation(card, foundationIndex) {
    const foundation = gameState.foundations[foundationIndex];
    
    // Foundation must be empty and card must be Ace
    if (foundation.length === 0) {
        return card.value === 'A';
    }
    
    // Check if card is next in sequence and same suit
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && 
           valueRank[card.value] === valueRank[topCard.value] + 1;
}

// Move card to foundation
function moveToFoundation(card, fromPile, pileIndex, cardIndex, foundationIndex) {
    // Save current state before making a move
    saveGameState();
    
    // Remove card from source pile
    if (fromPile === 'tableau') {
        // Remove the card and all cards above it
        const removedCards = gameState.tableau[pileIndex].splice(cardIndex);
        
        // If we removed cards, check if we revealed a face-down card
        if (gameState.tableau[pileIndex].length > 0 && 
            !gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp) {
            gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp = true;
            gameState.score += 5;
        }
        
        // Add the top card to foundation
        const topCard = removedCards[0];
        gameState.foundations[foundationIndex].push(topCard);
        
        // Put the rest back (they shouldn't have been moved)
        if (removedCards.length > 1) {
            gameState.tableau[pileIndex].push(...removedCards.slice(1));
        }
    } else if (fromPile === 'waste') {
        const card = gameState.waste.pop();
        gameState.foundations[foundationIndex].push(card);
    }
    
    // Update score
    gameState.score += 10;
    updateScore();
    
    renderGame();
}

// Check if a card can be moved to tableau
function canMoveToTableau(card, tableauIndex) {
    const pile = gameState.tableau[tableauIndex];
    
    // Empty pile can only accept King
    if (pile.length === 0) {
        return card.value === 'K';
    }
    
    // Check alternating colors and descending order
    const topCard = pile[pile.length - 1];
    if (!topCard.faceUp) return false;
    
    const isDifferentColor = suitColors[card.suit] !== suitColors[topCard.suit];
    const isNextValue = valueRank[card.value] === valueRank[topCard.value] - 1;
    
    return isDifferentColor && isNextValue;
}

// Move card(s) to tableau
function moveToTableau(card, fromPile, pileIndex, cardIndex, targetTableauIndex) {
    // Save current state before making a move
    saveGameState();
    
    let cardsToMove = [];
    
    // Determine how many cards to move
    if (fromPile === 'tableau') {
        // Move all face-up cards from the selected index onward
        cardsToMove = gameState.tableau[pileIndex].slice(cardIndex);
        gameState.tableau[pileIndex] = gameState.tableau[pileIndex].slice(0, cardIndex);
        
        // Check if we revealed a face-down card
        if (gameState.tableau[pileIndex].length > 0 && 
            !gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp) {
            gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp = true;
            gameState.score += 5;
        }
    } else if (fromPile === 'waste') {
        cardsToMove = [gameState.waste.pop()];
    }
    
    // Add cards to target tableau
    gameState.tableau[targetTableauIndex].push(...cardsToMove);
    
    // Update score
    gameState.score += cardsToMove.length * 5;
    updateScore();
    
    renderGame();
}

// Check if player has won
function checkWin() {
    let completeFoundations = 0;
    for (let foundation of gameState.foundations) {
        if (foundation.length === 13) {
            completeFoundations++;
        }
    }
    
    if (completeFoundations === 4) {
        // Player has won!
        clearInterval(gameState.timerInterval);
        elements.winScore.textContent = `Score: ${gameState.score}`;
        elements.winTime.textContent = `Time: ${elements.timerValue.textContent}`;
        elements.winMessage.style.display = 'block';
    }
}

// Clear any highlighted cards
function clearCardHighlights() {
    if (gameState.highlightedCard) {
        gameState.highlightedCard.classList.remove('highlighted');
        gameState.highlightedCard = null;
    }
    gameState.isHintActive = false;
}

// Undo last move
function undoMove() {
    if (gameState.moves.length <= 1) {
        // Only initial state exists, nothing to undo
        return;
    }
    
    restorePreviousState();
}

// Give a hint
function giveHint() {
    // Clear any existing highlights
    clearCardHighlights();
    gameState.isHintActive = true;
    
    // First, check if any card can be moved to foundation (highest priority)
    for (let i = 0; i < 4; i++) {
        if (gameState.foundations[i].length === 13) continue;
        
        // Check waste
        if (gameState.waste.length > 0) {
            const card = gameState.waste[gameState.waste.length - 1];
            if (canMoveToFoundation(card, i)) {
                // Highlight the waste card
                const wasteCards = elements.wastePile.querySelectorAll('.card');
                if (wasteCards.length > 0) {
                    wasteCards[0].classList.add('highlighted');
                    gameState.highlightedCard = wasteCards[0];
                    setTimeout(clearCardHighlights, 2000);
                    return;
                }
            }
        }
        
        // Check tableau
        for (let j = 0; j < 7; j++) {
            const pile = gameState.tableau[j];
            if (pile.length === 0) continue;
            
            // Find the topmost face-up card
            let topFaceUpIndex = -1;
            for (let k = pile.length - 1; k >= 0; k--) {
                if (pile[k].faceUp) {
                    topFaceUpIndex = k;
                    break;
                }
            }
            
            if (topFaceUpIndex === -1) continue;
            
            const card = pile[topFaceUpIndex];
            if (canMoveToFoundation(card, i)) {
                // Highlight the card in tableau
                const tableauCards = elements.tableauPiles[j].querySelectorAll('.card');
                if (tableauCards.length > topFaceUpIndex) {
                    tableauCards[topFaceUpIndex].classList.add('highlighted');
                    gameState.highlightedCard = tableauCards[topFaceUpIndex];
                    setTimeout(clearCardHighlights, 2000);
                    return;
                }
            }
        }
    }
    
    // Then check if any card can be moved to tableau
    for (let i = 0; i < 7; i++) {
        const pile = gameState.tableau[i];
        if (pile.length === 0) continue;
        
        // Find the topmost face-up card
        let topFaceUpIndex = -1;
        for (let k = pile.length - 1; k >= 0; k--) {
            if (pile[k].faceUp) {
                topFaceUpIndex = k;
                break;
            }
        }
        
        if (topFaceUpIndex === -1) continue;
        
        const card = pile[topFaceUpIndex];
        
        for (let j = 0; j < 7; j++) {
            if (i === j) continue;
            if (canMoveToTableau(card, j)) {
                // Highlight the card in tableau
                const tableauCards = elements.tableauPiles[i].querySelectorAll('.card');
                if (tableauCards.length > topFaceUpIndex) {
                    tableauCards[topFaceUpIndex].classList.add('highlighted');
                    gameState.highlightedCard = tableauCards[topFaceUpIndex];
                    setTimeout(clearCardHighlights, 2000);
                    return;
                }
            }
        }
    }
    
    // Finally, check if stock can be drawn
    if (gameState.stock.length > 0) {
        elements.stockPile.classList.add('highlighted');
        gameState.highlightedCard = elements.stockPile;
        setTimeout(() => {
            elements.stockPile.classList.remove('highlighted');
            gameState.highlightedCard = null;
            gameState.isHintActive = false;
        }, 2000);
        return;
    }
    
    // No moves available
    alert("No moves available! Try drawing from the stock or undoing a move.");
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Menu buttons
    elements.newGameBtn.addEventListener('click', initGame);
    elements.newGameBtn1.addEventListener('click', initGame);
    elements.menuReturn.addEventListener('click', () => {
        elements.menu.style.display = 'block';
        elements.gameover.style.display = 'none';
        elements.gameScreen.style.display = 'none';
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
    });
    
    // Instructions model
    elements.instructions.addEventListener('click', () => {
        elements.instructionsModal.style.display = 'flex';
    });
    elements.closeBtn.addEventListener('click', () => {
        elements.instructionsModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === elements.instructionsModal) {
            elements.instructionsModal.style.display = 'none';
        }
    });
    
    // Game controls
    elements.hintBtn.addEventListener('click', giveHint);
    elements.undoBtn.addEventListener('click', undoMove);
    elements.restartBtn.addEventListener('click', initGame);
    elements.playAgainBtn.addEventListener('click', initGame);
    
    // Stock pile click
    elements.stockPile.addEventListener('click', handleStockClick);
    
    // Foundation pile click handling
    elements.foundationPiles.forEach((pile, index) => {
        pile.addEventListener('click', () => {
            // Check if we can move from waste to foundation
            if (gameState.waste.length > 0) {
                const card = gameState.waste[gameState.waste.length - 1];
                if (canMoveToFoundation(card, index)) {
                    moveToFoundation(card, 'waste', 0, 0, index);
                    return;
                }
            }
            
            // Check if we can move from tableau to foundation
            for (let i = 0; i < 7; i++) {
                const pile = gameState.tableau[i];
                if (pile.length === 0) continue;
                
                // Find the topmost face-up card
                let topFaceUpIndex = -1;
                for (let k = pile.length - 1; k >= 0; k--) {
                    if (pile[k].faceUp) {
                        topFaceUpIndex = k;
                        break;
                    }
                }
                
                if (topFaceUpIndex === -1) continue;
                
                const card = pile[topFaceUpIndex];
                if (canMoveToFoundation(card, index)) {
                    moveToFoundation(card, 'tableau', i, topFaceUpIndex, index);
                    return;
                }
            }
        });
    });
    
    // Tableau pile click handling
    elements.tableauPiles.forEach((pile, index) => {
        pile.addEventListener('click', (e) => {
            const clickedCard = e.target.closest('.card');
            
            if (clickedCard && !clickedCard.classList.contains('face-down')) {
                // Card was clicked directly
                const pileIndex = parseInt(clickedCard.dataset.pileIndex);
                const cardIndex = parseInt(clickedCard.dataset.cardIndex);
                const card = gameState.tableau[pileIndex][cardIndex];
                
                // Try to move this card to another tableau pile
                for (let i = 0; i < 7; i++) {
                    if (i === pileIndex) continue;
                    if (canMoveToTableau(card, i)) {
                        moveToTableau(card, 'tableau', pileIndex, cardIndex, i);
                        return;
                    }
                }
                
                // Try to move this card to foundation
                for (let i = 0; i < 4; i++) {
                    if (canMoveToFoundation(card, i)) {
                        moveToFoundation(card, 'tableau', pileIndex, cardIndex, i);
                        return;
                    }
                }
            } else {
                // Empty space or face-down card was clicked
                // Check if we can move from waste to this tableau
                if (gameState.waste.length > 0) {
                    const card = gameState.waste[gameState.waste.length - 1];
                    if (canMoveToTableau(card, index)) {
                        moveToTableau(card, 'waste', 0, 0, index);
                        return;
                    }
                }
            }
        });
    });
    
    // Waste pile click handling
    elements.wastePile.addEventListener('click', (e) => {
        if (gameState.waste.length === 0) return;
        
        const card = gameState.waste[gameState.waste.length - 1];
        
        // Try to move to foundation
        for (let i = 0; i < 4; i++) {
            if (canMoveToFoundation(card, i)) {
                moveToFoundation(card, 'waste', 0, 0, i);
                return;
            }
        }
        
        // Try to move to tableau
        for (let i = 0; i < 7; i++) {
            if (canMoveToTableau(card, i)) {
                moveToTableau(card, 'waste', 0, 0, i);
                return;
            }
        }
    });
});

// Start with menu visible
window.onload = () => {
    elements.menu.style.display = 'block';
    elements.gameScreen.style.display = 'none';
    elements.gameover.style.display = 'none';
};
<script>
