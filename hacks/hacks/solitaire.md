---
layout: opencs
title: Solitaire Game
permalink: /solitaire/
---

<!-- Here is the styling -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solitaire Game</title>
    <style>
        /* [Exact same CSS as in original – omitted here for brevity but must be included] */
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
    <h2 class="game-title">Klondike Solitaire</h2>
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

    <!-- Load external JS -->
    <script src="solitaire.js"></script>
</body>
</html>