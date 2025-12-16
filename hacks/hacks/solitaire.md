---
layout: opencs
title: Solitaire Game
permalink: /solitaire/
---

<style>
  :root{
    --green1:#083108;
    --green2:#0f5a18;
    --glass: rgba(0,0,0,0.22);
    --stroke: rgba(255,255,255,0.12);
    --accent:#2ecc71;
    --accent2:#27ae60;
    --shadow: 0 8px 25px rgba(0,0,0,0.4);
  }

  /* Global */
  *{ box-sizing:border-box; }
  body{
    font-family:"Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    margin:0; padding:0;
    color:#f1f1f1;
    background:
      radial-gradient(circle at 20% 10%, rgba(255,255,255,0.08), transparent 40%),
      radial-gradient(circle at 80% 0%, rgba(255,255,255,0.06), transparent 45%),
      linear-gradient(135deg, var(--green1), var(--green2));
  }

  .wrap{ margin:0 auto; max-width:1000px; }

  /* Header */
  .game-title{
    text-align:center;
    font-size:2.2rem;
    margin:20px 0;
    font-weight:800;
    color:var(--accent);
    text-shadow:1px 1px 4px rgba(0,0,0,0.4);
  }

  .container.bg-secondary{
    text-align:center;
    border-radius:12px;
    padding:20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    background: var(--glass) !important;
    backdrop-filter: blur(6px);
    border: 1px solid var(--stroke);
  }

  /* Screens */
  #menu, #gameover, #game_screen{
    will-change: opacity, transform;
  }

  .game-container{
    display:none;
    padding:20px;
    border-radius:12px;
    min-height:600px;
    box-shadow: var(--shadow);
    background: linear-gradient(145deg, rgba(18,114,18,0.85), rgba(10,82,10,0.85));
    border:1px solid var(--stroke);
    animation: screenIn .35s ease both;
  }
  @keyframes screenIn{
    from{ opacity:0; transform: translateY(8px) scale(0.99); }
    to{ opacity:1; transform: translateY(0) scale(1); }
  }

  /* Menu + links */
  #gameover p, #menu p{ font-size:20px; margin:8px 0; }

  .menu-link{
    font-size:1.4rem;
    display:block;
    margin:12px 0;
    color:#fff;
    text-decoration:none;
    transition: all .25s ease;
    padding:10px 12px;
    border-radius:10px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.10);
  }
  .menu-link:hover{
    color:var(--accent);
    transform: translateX(6px);
    background: rgba(255,255,255,0.14);
  }
  .menu-link:focus-visible{
    outline: 3px solid rgba(46,204,113,0.55);
    outline-offset: 3px;
  }

  /* Game Controls */
  .game-controls{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    margin-bottom:20px;
    flex-wrap:wrap;
  }
  .score-display{
    color:#fff;
    font-size:18px;
    font-weight:800;
    letter-spacing:1px;
  }
  .timer-display{ color:#eee; font-size:16px; }

  .game-buttons{ display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }

  .btn-control{
    padding:8px 18px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color:#fff;
    border:none;
    border-radius:10px;
    cursor:pointer;
    font-weight:800;
    transition: all .2s ease;
  }
  .btn-control:hover{ transform: translateY(-2px) scale(1.02); }
  .btn-control:active{ transform: translateY(0) scale(0.99); }
  .btn-control:focus-visible{
    outline: 3px solid rgba(255,215,0,0.6);
    outline-offset: 3px;
  }

  /* Board */
  .foundation-row, .game-board{
    display:grid;
    grid-template-columns: repeat(7, 1fr);
    gap:12px;
  }
  .game-board{ margin-top:20px; }

  .card-pile{
    width:80px; height:110px;
    border-radius:14px;
    position:relative;
    cursor:pointer;
    background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06));
    border: 1px solid rgba(0,0,0,0.45);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 20px rgba(0,0,0,0.25);
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .card-pile:hover{ transform: translateY(-3px); }
  .card-pile.empty{
    background: rgba(255,255,255,0.05);
    border: 2px dashed rgba(255,255,255,0.30);
    box-shadow:none;
  }
  .card-pile.foundation{
    background: rgba(255,255,255,0.12);
    border: 2px solid rgba(255,255,255,0.40);
  }

  .tableau-pile{ min-height:320px; }
  .stock-pile, .waste-pile{ width:80px; height:110px; }

  /* Cards */
  .card{
    width:76px; height:106px;
    border-radius:12px;
    position:absolute;
    cursor:grab;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    padding:4px;
    font-size:13px;
    font-weight:900;
    user-select:none;
    border:1px solid rgba(0,0,0,0.35);
    background: linear-gradient(180deg, #ffffff, #f6f6f6);
    box-shadow: 0 10px 18px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.55);
    transition: transform .15s ease, filter .15s ease;
    animation: dealPop .22s ease both;
  }
  @keyframes dealPop{
    from{ opacity:0; transform: translateY(-6px) scale(0.98); }
    to{ opacity:1; transform: translateY(0) scale(1); }
  }

  .card:active{ cursor:grabbing; transform: scale(1.05); }
  .card.red{ color:#d40000; }
  .card.black{ color:#000; }

  .card.face-down{
    background:
      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 45%),
      repeating-linear-gradient(45deg, rgba(255,255,255,.10) 0px, rgba(255,255,255,.10) 8px, rgba(255,255,255,.04) 8px, rgba(255,255,255,.04) 16px),
      linear-gradient(180deg, #0a4ea1, #063570);
    border:1px solid #003366;
  }
  .card.face-down *{ display:none; }

  .card.dragging{ z-index:1000; transform: rotate(4deg) scale(1.05); }
  .card.highlighted{ box-shadow: 0 0 15px #ff0; filter: brightness(1.05); }

  .card-top{ text-align:left; }
  .card-bottom{ text-align:right; transform: rotate(180deg); }
  .suit{ font-size:18px; }

  /* Win */
  .win-message{
    position:absolute;
    top:50%; left:50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.95);
    color:#fff;
    padding:35px;
    border-radius:12px;
    text-align:center;
    font-size:24px;
    z-index:2000;
    display:none;
    animation: popin .4s ease forwards;
  }
  @keyframes popin{
    from{ transform: translate(-50%, -50%) scale(0.8); opacity:0; }
    to{ transform: translate(-50%, -50%) scale(1); opacity:1; }
  }

  /* Modal */
  .modal{
    position:fixed;
    z-index:2000;
    left:0; top:0;
    width:100%; height:100%;
    background-color: rgba(0,0,0,0.75);
    display:none;
    animation: modalFade .2s ease both;
  }
  @keyframes modalFade{
    from{ opacity:0; } to{ opacity:1; }
  }
  .modal-content{
    background-color:#f8f9fa;
    margin:5% auto;
    padding:20px;
    border:1px solid #888;
    width:80%;
    max-width:700px;
    border-radius:12px;
    max-height:80vh;
    overflow-y:auto;
    color:#000;
    box-shadow:0 6px 20px rgba(0,0,0,0.4);
    animation: slidein .25s ease;
  }
  @keyframes slidein{
    from{ transform: translateY(-20px); opacity:0; }
    to{ transform: translateY(0); opacity:1; }
  }
  .close{
    color:#6c757d;
    float:right;
    font-size:28px;
    font-weight:bold;
    cursor:pointer;
    transition: color .2s ease;
  }
  .close:hover, .close:focus{ color:#000; text-decoration:none; }

  .instructions-container h4{
    margin-top:20px;
    color:#2c3e50;
    border-bottom:1px solid #eee;
    padding-bottom:5px;
  }
  .instructions-container ul{ padding-left:22px; line-height:1.6; }

  #instructions_modal, #instructions_modal *{ color:#000 !important; }

  /* Animations */
  .fade-in{ animation: fadeIn .6s ease forwards; }
  .bounce-in{ animation: bounceIn .7s ease; }
  .slide-down{ animation: slideDown .5s ease; }
  @keyframes fadeIn{ from{ opacity:0; } to{ opacity:1; } }
  @keyframes bounceIn{
    0%{ transform: scale(0.7); opacity:0; }
    60%{ transform: scale(1.05); opacity:1; }
    100%{ transform: scale(1); }
  }
  @keyframes slideDown{
    from{ transform: translateY(-20px); opacity:0; }
    to{ transform: translateY(0); opacity:1; }
  }

  .highlight-box{
    background-color:#d4f7d4;
    padding:6px;
    border-radius:6px;
    border-left:4px solid var(--accent2);
  }

  /* Responsive */
  @media (max-width: 820px){
    .card-pile, .stock-pile, .waste-pile{ width:70px; height:98px; }
    .card{ width:66px; height:94px; }
    .foundation-row, .game-board{ gap:10px; }
  }

  /* Accessibility: reduced motion */
  @media (prefers-reduced-motion: reduce){
    *{ animation: none !important; transition: none !important; }
  }
</style>

<h2 class="game-title">Solitaire</h2>
<div class="container">
  <div class="container bg-secondary">
    <!-- Main Menu -->
    <div id="menu" class="py-4 text-light fade-in">
      <p class="intro-text">Welcome to <strong>Klondike Solitaire</strong></p>
      <p class="sub-text">Move all cards to the foundation piles, organized by suit from Ace to King</p>

      <!-- Make anchors reliable -->
      <a id="new_game" class="menu-link" href="#">➕ New Game</a>
      <a id="instructions" class="menu-link" href="#">📖 How to Play</a>
      <p style="opacity:.85; margin-top:12px; font-size:14px;">
        Shortcuts: <b>N</b>=New, <b>H</b>=Hint, <b>U</b>=Undo, <b>R</b>=Restart, <b>Esc</b>=Close modal
      </p>
    </div>

    <!-- Game Over -->
    <div id="gameover" class="py-4 text-light fade-in" style="display:none;">
      <p class="gameover-title">💀 Game Over!</p>
      <p id="final_score" class="result-text">Final Score: 0</p>
      <p id="final_time" class="result-text">Time: 00:00</p>
      <a id="new_game1" class="menu-link" href="#">🔄 New Game</a>
      <a id="menu_return" class="menu-link" href="#">🏠 Main Menu</a>
    </div>

    <!-- Game Screen -->
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

  <!-- Instructions Modal -->
  <div id="instructions_modal" class="modal">
    <div class="modal-content slide-down">
      <span class="close" role="button" aria-label="Close">&times;</span>
      <h3>📖 How to Play Klondike Solitaire</h3>
      <div class="instructions-container">
        <h4>Objective</h4>
        <p class="highlight-box">
          Move all cards to the four foundation piles, building each suit in ascending order from Ace to King.
        </p>
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
          <li>You can move face-up cards from one table
