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