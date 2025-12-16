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
    moves: [],
    isHintActive: false,
    highlightedCard: null
};

// Card suits and values
const suits = ['♠', '♥', '♦', '♣'];
const suitColors = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const valueRank = { 'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };

// Declare elements (will be initialized after DOM loads)
let elements;

// Initialize the game
function initGame() {
    // Reset game state (do NOT replace the entire gameState object to preserve reference)
    gameState.deck = [];
    gameState.tableau = [[], [], [], [], [], [], []];
    gameState.foundations = [[], [], [], []];
    gameState.stock = [];
    gameState.waste = [];
    gameState.score = 0;
    gameState.timer = 0;
    gameState.moves = [];
    gameState.isHintActive = false;
    gameState.highlightedCard = null;

    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }

    createDeck();
    shuffleDeck();
    dealCards();
    updateScore();
    startTimer();
    renderGame();

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
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            const card = gameState.deck.pop();
            if (j === i) {
                card.faceUp = true;
            }
            gameState.tableau[i].push(card);
        }
    }
    gameState.stock = gameState.deck;
    gameState.deck = [];
    saveGameState();
}

// Save current game state for undo
function saveGameState() {
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
    gameState.moves.pop();
    const previousState = gameState.moves[gameState.moves.length - 1];
    gameState.tableau = previousState.tableau.map(pile => [...pile]);
    gameState.foundations = previousState.foundations.map(pile => [...pile]);
    gameState.stock = [...previousState.stock];
    gameState.waste = [...previousState.waste];
    gameState.score = previousState.score;
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
    clearCardHighlights();
    renderStockPile();
    renderWastePile();
    for (let i = 0; i < 4; i++) {
        renderFoundationPile(i);
    }
    for (let i = 0; i < 7; i++) {
        renderTableauPile(i);
    }
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
    cardEl.dataset.pile = pileType;
    cardEl.dataset.pileIndex = pileIndex;
    cardEl.dataset.cardIndex = cardIndex;
    cardEl.dataset.suit = card.suit;
    cardEl.dataset.value = card.value;
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
    saveGameState();
    if (gameState.stock.length === 0) {
        while (gameState.waste.length > 0) {
            const card = gameState.waste.pop();
            card.faceUp = false;
            gameState.stock.push(card);
        }
    } else {
        const card = gameState.stock.pop();
        card.faceUp = true;
        gameState.waste.push(card);
        updateScore();
    }
    renderGame();
}

// Check if a card can be moved to a foundation
function canMoveToFoundation(card, foundationIndex) {
    const foundation = gameState.foundations[foundationIndex];
    if (foundation.length === 0) {
        return card.value === 'A';
    }
    const topCard = foundation[foundation.length - 1];
    return card.suit === topCard.suit && valueRank[card.value] === valueRank[topCard.value] + 1;
}

// Move card to foundation
function moveToFoundation(card, fromPile, pileIndex, cardIndex, foundationIndex) {
    saveGameState();
    if (fromPile === 'tableau') {
        const removedCards = gameState.tableau[pileIndex].splice(cardIndex);
        if (gameState.tableau[pileIndex].length > 0 && 
            !gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp) {
            gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp = true;
            gameState.score += 5;
        }
        const topCard = removedCards[0];
        gameState.foundations[foundationIndex].push(topCard);
        if (removedCards.length > 1) {
            gameState.tableau[pileIndex].push(...removedCards.slice(1));
        }
    } else if (fromPile === 'waste') {
        const card = gameState.waste.pop();
        gameState.foundations[foundationIndex].push(card);
    }
    gameState.score += 10;
    updateScore();
    renderGame();
}

// Check if a card can be moved to tableau
function canMoveToTableau(card, tableauIndex) {
    const pile = gameState.tableau[tableauIndex];
    if (pile.length === 0) {
        return card.value === 'K';
    }
    const topCard = pile[pile.length - 1];
    if (!topCard.faceUp) return false;
    const isDifferentColor = suitColors[card.suit] !== suitColors[topCard.suit];
    const isNextValue = valueRank[card.value] === valueRank[topCard.value] - 1;
    return isDifferentColor && isNextValue;
}

// Move card(s) to tableau
function moveToTableau(card, fromPile, pileIndex, cardIndex, targetTableauIndex) {
    saveGameState();
    let cardsToMove = [];
    if (fromPile === 'tableau') {
        cardsToMove = gameState.tableau[pileIndex].slice(cardIndex);
        gameState.tableau[pileIndex] = gameState.tableau[pileIndex].slice(0, cardIndex);
        if (gameState.tableau[pileIndex].length > 0 && 
            !gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp) {
            gameState.tableau[pileIndex][gameState.tableau[pileIndex].length - 1].faceUp = true;
            gameState.score += 5;
        }
    } else if (fromPile === 'waste') {
        cardsToMove = [gameState.waste.pop()];
    }
    gameState.tableau[targetTableauIndex].push(...cardsToMove);
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
    if (gameState.moves.length <= 1) return;
    restorePreviousState();
}

// Give a hint
function giveHint() {
    clearCardHighlights();
    gameState.isHintActive = true;
    for (let i = 0; i < 4; i++) {
        if (gameState.foundations[i].length === 13) continue;
        if (gameState.waste.length > 0) {
            const card = gameState.waste[gameState.waste.length - 1];
            if (canMoveToFoundation(card, i)) {
                const wasteCards = elements.wastePile.querySelectorAll('.card');
                if (wasteCards.length > 0) {
                    wasteCards[0].classList.add('highlighted');
                    gameState.highlightedCard = wasteCards[0];
                    setTimeout(clearCardHighlights, 2000);
                    return;
                }
            }
        }
        for (let j = 0; j < 7; j++) {
            const pile = gameState.tableau[j];
            if (pile.length === 0) continue;
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
    for (let i = 0; i < 7; i++) {
        const pile = gameState.tableau[i];
        if (pile.length === 0) continue;
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
    alert("No moves available! Try drawing from the stock or undoing a move.");
}

// Initialize DOM and event listeners once page is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    elements = {
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

    // Initial UI state
    elements.menu.style.display = 'block';
    elements.gameScreen.style.display = 'none';
    elements.gameover.style.display = 'none';

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

    // Instructions modal
    elements.instructions.addEventListener('click', () => {
        elements.instructionsmodel.style.display = 'flex';
    });
    elements.closeBtn.addEventListener('click', () => {
        elements.instructionsmodel.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === elements.instructionsmodel) {
            elements.instructionsmodel.style.display = 'none';
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
            if (gameState.waste.length > 0) {
                const card = gameState.waste[gameState.waste.length - 1];
                if (canMoveToFoundation(card, index)) {
                    moveToFoundation(card, 'waste', 0, 0, index);
                    return;
                }
            }
            for (let i = 0; i < 7; i++) {
                const tableauPile = gameState.tableau[i];
                if (tableauPile.length === 0) continue;
                let topFaceUpIndex = -1;
                for (let k = tableauPile.length - 1; k >= 0; k--) {
                    if (tableauPile[k].faceUp) {
                        topFaceUpIndex = k;
                        break;
                    }
                }
                if (topFaceUpIndex === -1) continue;
                const card = tableauPile[topFaceUpIndex];
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
                const pileIndex = parseInt(clickedCard.dataset.pileIndex);
                const cardIndex = parseInt(clickedCard.dataset.cardIndex);
                const card = gameState.tableau[pileIndex][cardIndex];
                for (let i = 0; i < 7; i++) {
                    if (i === pileIndex) continue;
                    if (canMoveToTableau(card, i)) {
                        moveToTableau(card, 'tableau', pileIndex, cardIndex, i);
                        return;
                    }
                }
                for (let i = 0; i < 4; i++) {
                    if (canMoveToFoundation(card, i)) {
                        moveToFoundation(card, 'tableau', pileIndex, cardIndex, i);
                        return;
                    }
                }
            } else {
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
        for (let i = 0; i < 4; i++) {
            if (canMoveToFoundation(card, i)) {
                moveToFoundation(card, 'waste', 0, 0, i);
                return;
            }
        }
        for (let i = 0; i < 7; i++) {
            if (canMoveToTableau(card, i)) {
                moveToTableau(card, 'waste', 0, 0, i);
                return;
            }
        }
    });
});