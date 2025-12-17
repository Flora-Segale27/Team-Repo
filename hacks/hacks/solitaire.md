---
layout: opencs
title: Solitaire Game
permalink: /solitaire/
---

<style>
  body {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background:
      radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 40%),
      radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 45%),
      linear-gradient(135deg, #083108, #0f5a18);
    color: #f1f1f1;
    margin: 0;
    padding: 0;
  }

  .wrap { margin-left:auto; margin-right:auto; max-width:1000px; }

  .container.bg-secondary {
    background: rgba(0,0,0,0.22) !important;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.12);
    text-align:center;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }

  .game-container {
    display: none;
    padding: 20px;
    background: linear-gradient(145deg, rgba(18, 114, 18, 0.85), rgba(10, 82, 10, 0.85));
    border-radius: 12px;
    min-height: 600px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .game-container:focus { outline: none; }

  #gameover p, #menu p { font-size: 20px; margin: 8px 0; }

  #gameover a, #menu a {
    font-size: 28px;
    display: inline-block;
    margin: 10px 15px;
    padding: 8px 14px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.1);
    transition: all 0.2s ease-in-out;
    color: #fff;
    text-decoration: none;
  }
  #gameover a:hover, #menu a:hover {
    cursor: pointer;
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
  #gameover a:hover::before, #menu a:hover::before {
    content: ">";
    margin-right: 10px;
    color: #ffd700;
  }

  #menu { display:block; }
  #gameover { display:none; }

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
    border-radius: 14px;
    position: relative;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
    border: 1px solid rgba(0,0,0,0.45);
    box-shadow:
      inset 0 1px 0 rgba(255,255,255,0.18),
      0 10px 20px rgba(0,0,0,0.25);
    overflow: hidden;
  }
  .card-pile:hover { transform: translateY(-3px); }

  .card-pile.empty {
    background: rgba(255, 255, 255, 0.05);
    border: 2px dashed rgba(255, 255, 255, 0.3);
    box-shadow: none;
  }
  .card-pile.foundation {
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.5);
  }

  .card {
    width: 76px;
    height: 106px;
    border-radius: 12px;
    background: linear-gradient(180deg, #ffffff, #f6f6f6);
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
    border: 1px solid rgba(0,0,0,0.35);
    box-shadow:
      0 10px 18px rgba(0,0,0,0.28),
      inset 0 1px 0 rgba(255,255,255,0.55);
  }
  .card:active { cursor: grabbing; transform: scale(1.05); }
  .card.red { color:#d40000; }
  .card.black { color:#000; }

  .card.face-down {
    background:
      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 45%),
      repeating-linear-gradient(45deg, rgba(255,255,255,.10) 0px, rgba(255,255,255,.10) 8px, rgba(255,255,255,.04) 8px, rgba(255,255,255,.04) 16px),
      linear-gradient(180deg, #0a4ea1, #063570);
    border: 1px solid #003366;
  }
  .card.face-down * { display:none; }

  .card.dragging { z-index: 1000; transform: rotate(4deg) scale(1.05); }
  .card.highlighted { box-shadow: 0 0 15px #ff0; }

  .card-top { text-align:left; }
  .card-bottom { text-align:right; transform: rotate(180deg); }
  .suit { font-size: 18px; }

  .tableau-pile { min-height: 320px; }
  .stock-pile, .waste-pile { width:80px; height:110px; }

  .game-controls {
    display:flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .score-display { color:#fff; font-size:18px; font-weight:bold; letter-spacing:1px; }
  .timer-display { color:#eee; font-size:16px; }
  .game-buttons { display:flex; gap:12px; }

  .btn-control, .game-buttons button {
    padding: 8px 18px;
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.25s ease;
  }
  .btn-control:hover, .game-buttons button:hover {
    background: linear-gradient(135deg, #27ae60, #219150);
    transform: scale(1.05);
  }

  .win-message {
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.95);
    color:#fff;
    padding: 35px;
    border-radius: 12px;
    text-align:center;
    font-size: 24px;
    z-index:2000;
    display:none;
    animation: popin 0.4s ease forwards;
  }
  @keyframes popin {
    from { transform: translate(-50%, -50%) scale(0.8); opacity:0; }
    to { transform: translate(-50%, -50%) scale(1); opacity:1; }
  }

  .modal {
    position: fixed;
    z-index: 2000;
    left: 0; top: 0;
    width: 100%; height: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.75);
  }
  .modal-content {
    background-color: #f8f9fa;
    margin: 5% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 700px;
    border-radius: 12px;
    max-height: 80vh;
    overflow-y: auto;
    color: #000;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
    animation: slidein 0.3s ease;
  }
  @keyframes slidein {
    from { transform: translateY(-20px); opacity:0; }
    to { transform: translateY(0); opacity:1; }
  }
  .close {
    color:#6c757d;
    float:right;
    font-size: 28px;
    font-weight:bold;
    cursor:pointer;
  }
  .close:hover { color:#000; }

  .instructions-container h4 { margin-top: 20px; color:#2c3e50; border-bottom: 1px solid #eee; padding-bottom:5px; }
  .instructions-container ul { padding-left:22px; line-height:1.6; }

  #instructions_modal, #instructions_modal * { color:#000 !important; }

  .game-title {
    text-align:center;
    font-size: 2.2rem;
    margin: 20px 0;
    font-weight:bold;
    color: #2ecc71;
    text-shadow: 1px 1px 4px rgba(0,0,0,0.4);
  }

  .menu-link {
    font-size: 1.4rem;
    display:block;
    margin: 12px 0;
    color:#fff;
    text-decoration:none;
    transition: all 0.3s ease;
  }
  .menu-link:hover { color:#2ecc71; transform: translateX(6px); }

  .fade-in { animation: fadeIn 0.6s ease forwards; }
  .bounce-in { animation: bounceIn 0.7s ease; }
  .slide-down { animation: slideDown 0.5s ease; }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes bounceIn {
    0% { transform: scale(0.7); opacity:0; }
    60% { transform: scale(1.05); opacity:1; }
    100% { transform: scale(1); }
  }
  @keyframes slideDown { from { transform: translateY(-20px); opacity:0; } to { transform: translateY(0); opacity:1; } }

  .highlight-box {
    background-color:#d4f7d4;
    padding: 6px;
    border-radius: 6px;
    border-left: 4px solid #27ae60;
  }

  @media (max-width: 820px) {
    .card-pile, .stock-pile, .waste-pile { width: 70px; height: 98px; }
    .card { width: 66px; height: 94px; }
    .game-board, .foundation-row { gap: 10px; }
  }
</style>

<h2 class="game-title">Solitaire</h2>
<div class="container">
  <div class="container bg-secondary">
    <div id="menu" class="py-4 text-light fade-in">
      <p class="intro-text">Welcome to <strong>Klondike Solitaire</strong></p>
      <p class="sub-text">Move all cards to the foundation piles, organized by suit from Ace to King</p>
      <a id="new_game" class="menu-link" href="#">➕ New Game</a>
      <a id="instructions" class="menu-link" href="#">📖 How to Play</a>
    </div>

    <div id="gameover" class="py-4 text-light fade-in">
      <p class="gameover-title">💀 Game Over!</p>
      <p id="final_score" class="result-text">Final Score: 0</p>
      <p id="final_time" class="result-text">Time: 00:00</p>
      <a id="new_game1" class="menu-link" href="#">🔄 New Game</a>
      <a id="menu_return" class="menu-link" href="#">🏠 Main Menu</a>
    </div>

    <div id="game_screen" class="game-container wrap" tabindex="1">
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

      <div id="win_message" class="win-message bounce-in">
        <h3>🎉 Congratulations!</h3>
        <p>You Won!</p>
        <p id="win_score"></p>
        <p id="win_time"></p>
        <button id="play_again_btn" class="btn-control">Play Again</button>
      </div>
    </div>
  </div>

  <div id="instructions_modal" class="modal" style="display:none;">
    <div class="modal-content slide-down">
      <span class="close">&times;</span>
      <h3>📖 How to Play Klondike Solitaire</h3>
      <div class="instructions-container">
        <h4>Objective</h4>
        <p class="highlight-box">Move all cards to the four foundation piles, building each suit in ascending order from Ace to King.</p>
        <h4>Rules</h4>
        <ul>
          <li>Only Kings can be placed on empty tableau piles</li>
          <li>Build tableau piles in descending order with alternating colors</li>
          <li>Build foundation piles in ascending order by suit</li>
          <li>Click stock to draw</li>
          <li>When stock is empty, reset from waste</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<script>
  // ===============================
  // SOLITAIRE (All-in-one) + FIXES
  // ✅ New Game works (wired correctly)
  // ✅ Timer bug fixed (no multiple intervals, uses startTime + raf-ish interval)
  // ===============================

  const suits = ['♠', '♥', '♦', '♣'];
  const suitColors = { '♠': 'black', '♣': 'black', '♥': 'red', '♦': 'red' };
  const values = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const valueRank = { 'A':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13 };

  const el = {
    menu: document.getElementById('menu'),
    gameover: document.getElementById('gameover'),
    gameScreen: document.getElementById('game_screen'),
    newGameBtn: document.getElementById('new_game'),
    newGameBtn1: document.getElementById('new_game1'),
    menuReturn: document.getElementById('menu_return'),
    instructions: document.getElementById('instructions'),
    instructionsModal: document.getElementById('instructions_modal'),
    closeBtn: document.querySelector('.close'),
    hintBtn: document.getElementById('hint_btn'),
    undoBtn: document.getElementById('undo_btn'),
    restartBtn: document.getElementById('restart_btn'),
    playAgainBtn: document.getElementById('play_again_btn'),
    scoreValue: document.getElementById('score_value'),
    timerValue: document.getElementById('timer_value'),
    winScore: document.getElementById('win_score'),
    winTime: document.getElementById('win_time'),
    winMessage: document.getElementById('win_message'),
    stockPile: document.getElementById('stock'),
    wastePile: document.getElementById('waste'),
    foundationPiles: [
      document.getElementById('foundation_0'),
      document.getElementById('foundation_1'),
      document.getElementById('foundation_2'),
      document.getElementById('foundation_3'),
    ],
    tableauPiles: [
      document.getElementById('tableau_0'),
      document.getElementById('tableau_1'),
      document.getElementById('tableau_2'),
      document.getElementById('tableau_3'),
      document.getElementById('tableau_4'),
      document.getElementById('tableau_5'),
      document.getElementById('tableau_6'),
    ],
  };

  let game = null;

  function freshGameState() {
    return {
      deck: [],
      tableau: [[],[],[],[],[],[],[]],
      foundations: [[],[],[],[]],
      stock: [],
      waste: [],
      score: 0,
      moves: [],
      highlightedCard: null,

      // TIMER FIX: use start timestamp + one interval
      startMs: null,
      timerInterval: null,
      elapsedSeconds: 0,
    };
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2,'0');
    const s = Math.floor(sec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function stopTimer() {
    if (game?.timerInterval) {
      clearInterval(game.timerInterval);
      game.timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    game.startMs = Date.now();
    game.elapsedSeconds = 0;
    el.timerValue.textContent = "00:00";

    game.timerInterval = setInterval(() => {
      if (!game.startMs) return;
      const sec = Math.floor((Date.now() - game.startMs) / 1000);
      if (sec !== game.elapsedSeconds) {
        game.elapsedSeconds = sec;
        el.timerValue.textContent = fmtTime(sec);
      }
    }, 250);
  }

  function createDeck() {
    game.deck = [];
    for (const s of suits) for (const v of values) game.deck.push({ suit: s, value: v, faceUp: false });
  }

  function shuffleDeck() {
    for (let i = game.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [game.deck[i], game.deck[j]] = [game.deck[j], game.deck[i]];
    }
  }

  function dealCards() {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j <= i; j++) {
        const card = game.deck.pop();
        if (j === i) card.faceUp = true;
        game.tableau[i].push(card);
      }
    }
    game.stock = game.deck;
    game.deck = [];
    saveState();
  }

  function deepCloneCard(c){ return { suit:c.suit, value:c.value, faceUp:c.faceUp }; }

  function saveState() {
    game.moves.push({
      tableau: game.tableau.map(p => p.map(deepCloneCard)),
      foundations: game.foundations.map(p => p.map(deepCloneCard)),
      stock: game.stock.map(deepCloneCard),
      waste: game.waste.map(deepCloneCard),
      score: game.score
    });
  }

  function restorePreviousState() {
    if (game.moves.length <= 1) return;
    game.moves.pop();
    const prev = game.moves[game.moves.length - 1];
    game.tableau = prev.tableau.map(p => p.map(deepCloneCard));
    game.foundations = prev.foundations.map(p => p.map(deepCloneCard));
    game.stock = prev.stock.map(deepCloneCard);
    game.waste = prev.waste.map(deepCloneCard);
    game.score = prev.score;
    updateScore();
    render();
  }

  function updateScore(){ el.scoreValue.textContent = game.score; }

  function initGame() {
    // ✅ ensures button always works and timer never duplicates
    stopTimer();
    game = freshGameState();

    createDeck();
    shuffleDeck();
    dealCards();

    game.score = 0;
    updateScore();
    startTimer();

    el.menu.style.display = 'none';
    el.gameover.style.display = 'none';
    el.gameScreen.style.display = 'block';
    el.winMessage.style.display = 'none';

    render();
  }

  function showMenu() {
    stopTimer();
    el.menu.style.display = 'block';
    el.gameover.style.display = 'none';
    el.gameScreen.style.display = 'none';
    el.winMessage.style.display = 'none';
  }

  function createCardElement(card, pileType, pileIndex, cardIndex=0) {
    const d = document.createElement('div');
    d.className = `card ${suitColors[card.suit]}`;
    d.dataset.pile = pileType;
    d.dataset.pileIndex = pileIndex;
    d.dataset.cardIndex = cardIndex;

    if (!card.faceUp) {
      d.classList.add('face-down');
      return d;
    }

    d.dataset.suit = card.suit;
    d.dataset.value = card.value;

    const top = document.createElement('div');
    top.className = 'card-top';
    top.innerHTML = `<span>${card.value}</span><span class="suit">${card.suit}</span>`;

    const bottom = document.createElement('div');
    bottom.className = 'card-bottom';
    bottom.innerHTML = `<span>${card.value}</span><span class="suit">${card.suit}</span>`;

    d.appendChild(top);
    d.appendChild(bottom);
    return d;
  }

  function renderStock() {
    el.stockPile.innerHTML = '';
    if (game.stock.length > 0) {
      el.stockPile.classList.remove('empty');
      const c = document.createElement('div');
      c.className = 'card face-down';
      el.stockPile.appendChild(c);
    } else {
      el.stockPile.classList.add('empty');
    }
  }

  function renderWaste() {
    el.wastePile.innerHTML = '';
    if (game.waste.length > 0) {
      el.wastePile.classList.remove('empty');
      const card = game.waste[game.waste.length - 1];
      el.wastePile.appendChild(createCardElement(card, 'waste', 0, 0));
    } else {
      el.wastePile.classList.add('empty');
    }
  }

  function renderFoundation(i) {
    const pile = el.foundationPiles[i];
    pile.innerHTML = '';
    const stack = game.foundations[i];
    if (stack.length > 0) pile.appendChild(createCardElement(stack[stack.length-1], 'foundation', i, stack.length-1));
  }

  function renderTableau(i) {
    const pile = el.tableauPiles[i];
    pile.innerHTML = '';
    const stack = game.tableau[i];
    if (stack.length === 0) { pile.classList.add('empty'); return; }
    pile.classList.remove('empty');

    for (let k = 0; k < stack.length; k++) {
      const cardEl = createCardElement(stack[k], 'tableau', i, k);
      cardEl.style.top = `${k * 20}px`;
      pile.appendChild(cardEl);
    }
  }

  function render() {
    renderStock();
    renderWaste();
    for (let i=0;i<4;i++) renderFoundation(i);
    for (let i=0;i<7;i++) renderTableau(i);
    checkWin();
  }

  function handleStockClick() {
    saveState();
    if (game.stock.length === 0) {
      while (game.waste.length > 0) {
        const c = game.waste.pop();
        c.faceUp = false;
        game.stock.push(c);
      }
    } else {
      const c = game.stock.pop();
      c.faceUp = true;
      game.waste.push(c);
      game.score -= 5;
      updateScore();
    }
    render();
  }

  function canMoveToFoundation(card, fIndex) {
    const f = game.foundations[fIndex];
    if (f.length === 0) return card.value === 'A';
    const top = f[f.length-1];
    return card.suit === top.suit && valueRank[card.value] === valueRank[top.value] + 1;
  }

  function canMoveToTableau(card, tIndex) {
    const pile = game.tableau[tIndex];
    if (pile.length === 0) return card.value === 'K';
    const top = pile[pile.length-1];
    if (!top.faceUp) return false;
    const diffColor = suitColors[card.suit] !== suitColors[top.suit];
    const nextVal = valueRank[card.value] === valueRank[top.value] - 1;
    return diffColor && nextVal;
  }

  function maybeFlipTop(tableauIndex) {
    const p = game.tableau[tableauIndex];
    if (p.length > 0 && !p[p.length-1].faceUp) {
      p[p.length-1].faceUp = true;
      game.score += 5;
      updateScore();
    }
  }

  function moveToFoundation(fromPile, pileIndex, cardIndex, foundationIndex) {
    saveState();

    if (fromPile === 'waste') {
      const c = game.waste.pop();
      game.foundations[foundationIndex].push(c);
    } else {
      const removed = game.tableau[pileIndex].splice(cardIndex, 1);
      game.foundations[foundationIndex].push(removed[0]);
      maybeFlipTop(pileIndex);
    }

    game.score += 10;
    updateScore();
    render();
  }

  function moveToTableau(fromPile, fromIndex, cardIndex, targetIndex) {
    saveState();

    let moving = [];
    if (fromPile === 'waste') {
      moving = [game.waste.pop()];
    } else {
      moving = game.tableau[fromIndex].splice(cardIndex);
      maybeFlipTop(fromIndex);
    }

    game.tableau[targetIndex].push(...moving);
    game.score += moving.length * 5;
    updateScore();
    render();
  }

  function checkWin() {
    const done = game.foundations.filter(f => f.length === 13).length;
    if (done === 4) {
      stopTimer();
      el.winScore.textContent = `Score: ${game.score}`;
      el.winTime.textContent = `Time: ${el.timerValue.textContent}`;
      el.winMessage.style.display = 'block';
    }
  }

  // Simple click-to-move logic (same style as your version)
  function onTableauClick(e, tableauIndex) {
    const clicked = e.target.closest('.card');
    if (clicked && !clicked.classList.contains('face-down')) {
      const pIndex = parseInt(clicked.dataset.pileIndex, 10);
      const cIndex = parseInt(clicked.dataset.cardIndex, 10);
      const card = game.tableau[pIndex][cIndex];

      // try foundation
      for (let f=0; f<4; f++) {
        if (canMoveToFoundation(card, f)) {
          moveToFoundation('tableau', pIndex, cIndex, f);
          return;
        }
      }

      // try other tableau
      for (let t=0; t<7; t++) {
        if (t === pIndex) continue;
        if (canMoveToTableau(card, t)) {
          moveToTableau('tableau', pIndex, cIndex, t);
          return;
        }
      }
    } else {
      // empty space: try waste -> tableau
      if (game.waste.length > 0) {
        const card = game.waste[game.waste.length-1];
        if (canMoveToTableau(card, tableauIndex)) moveToTableau('waste', 0, 0, tableauIndex);
      }
    }
  }

  function onWasteClick() {
    if (game.waste.length === 0) return;
    const card = game.waste[game.waste.length-1];

    for (let f=0; f<4; f++) {
      if (canMoveToFoundation(card, f)) { moveToFoundation('waste', 0, 0, f); return; }
    }
    for (let t=0; t<7; t++) {
      if (canMoveToTableau(card, t)) { moveToTableau('waste', 0, 0, t); return; }
    }
  }

  function undoMove() { restorePreviousState(); }

  function giveHint() {
    alert("Hint system not implemented in this combined version yet (but New Game + Timer are fixed).");
  }

  // ✅ IMPORTANT: wire events after DOM exists (fixes New Game)
  function bind(id, fn) {
    const node = document.getElementById(id);
    if (!node) return;
    node.addEventListener('click', (e) => { e.preventDefault(); fn(e); });
  }

  window.addEventListener('DOMContentLoaded', () => {
    bind('new_game', initGame);
    bind('new_game1', initGame);
    bind('restart_btn', initGame);
    bind('play_again_btn', initGame);
    bind('menu_return', showMenu);

    bind('instructions', () => { el.instructionsModal.style.display = 'block'; });
    el.closeBtn.addEventListener('click', () => { el.instructionsModal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target === el.instructionsModal) el.instructionsModal.style.display = 'none'; });

    el.stockPile.addEventListener('click', (e) => { e.preventDefault(); handleStockClick(); });
    el.wastePile.addEventListener('click', (e) => { e.preventDefault(); onWasteClick(); });

    el.foundationPiles.forEach((pile, idx) => {
      pile.addEventListener('click', (e) => {
        e.preventDefault();
        if (game?.waste?.length) {
          const c = game.waste[game.waste.length-1];
          if (canMoveToFoundation(c, idx)) moveToFoundation('waste', 0, 0, idx);
        }
      });
    });

    el.tableauPiles.forEach((pile, idx) => {
      pile.addEventListener('click', (e) => { e.preventDefault(); onTableauClick(e, idx); });
    });

    el.hintBtn.addEventListener('click', giveHint);
    el.undoBtn.addEventListener('click', undoMove);
  });

  // start on menu
  showMenu();
</script>