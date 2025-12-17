---
layout: opencs
title: Memory Game
permalink: /javascript/project/memory
---

<style>
    .memoryCanvas { 
        border: 10px solid #0b1c3d; /* dark blue border */
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20px; /* space below canvas */
    }

    h2, p {
        text-align: center;
    }

    button {
        border: none; /* removed black border */
        border-radius: 8px; /* rounded corners */
        padding: 8px 14px;
        margin: 8px;
        font-size: 16px;
        cursor: pointer;
        box-sizing: border-box;
    }

    /* Make all difficulty buttons same background, different text colors */
    .easy, .medium, .hard { 
        background-color: #64B5F6; /* same blue for all */
        font-weight: bold;
    }

    .easy { color: green; }
    .medium { color: orange; }
    .hard { color: red; }

    .end-btn { 
        background-color: #ADD8E6; 
        color: #000; 
        border-radius: 10px; 
        font-weight: bold;
    }

    /* Box styling for difficulty modes */
    .difficulty-box {
        border: 3px solid #000;
        display: inline-block;
        padding: 10px 20px;
        text-align: center;
        margin-bottom: 15px;
        background-color: #ADD8E6; /* light blue background */
        border-radius: 10px; /* rounded corners */
    }

    .difficulty-box h3 {
        margin: 0 0 10px 0;
        font-size: 18px;
        color: black !important;
        font-weight: bold;
    }

    /* Center the box */
    .difficulty-container {
        display: flex;
        justify-content: center;
        margin-bottom: 20px; /* extra space below */
    }
</style>

<h2>Memory Game</h2>
<p>Score: <span class="score">0</span></p>
<p>Attempts: <span class="attempts">0</span></p>

<canvas class="memoryCanvas" id="memoryCanvas" width="600" height="400"></canvas>

<!-- Centered Difficulty Modes Box -->
<div class="difficulty-container">
    <div class="difficulty-box">
        <h3>Difficulty Modes</h3>
        <button class="easy" onclick="startGame(4)">Easy</button>
        <button class="medium" onclick="startGame(5)">Medium</button>
        <button class="hard" onclick="startGame(6)">Hard</button>
    </div>
</div>

<div style="text-align:center; margin-top:10px;">
    <button class="end-btn" onclick="endGame()">End Game</button>
</div>

<script>
const memCanvas = document.getElementById('memoryCanvas');
const memCtx = memCanvas.getContext('2d');

const scoreDisplay = document.querySelector('.score');
const attemptsDisplay = document.querySelector('.attempts');

let gridSize = 4;
let score = 0;
let attempts = 0;
let revealedCells = [];
let matchedCells = [];
let emojiList = [];
let totalPairs = 0;

// ---------- GRID ----------
function drawGrid(cols, rows) {
    memCtx.strokeStyle = '#0b1c3d'; // dark blue grid lines
    memCtx.lineWidth = 10;

    const w = memCanvas.width;
    const h = memCanvas.height;

    for (let x = 0; x <= w; x += w / cols) {
        memCtx.beginPath();
        memCtx.moveTo(x, 0);
        memCtx.lineTo(x, h);
        memCtx.stroke();
    }

    for (let y = 0; y <= h; y += h / rows) {
        memCtx.beginPath();
        memCtx.moveTo(0, y);
        memCtx.lineTo(w, y);
        memCtx.stroke();
    }
}

// ---------- EMOJIS ----------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generateEmojis(size) {
    // Enough emojis for up to 6x6 grid (36 cells => 18 pairs)
    const emojiPool = [
        "😀","🎉","🍕","🐶","🌟","🚀","🍎","🦄",
        "⚽","🎮","🎧","📱","🐱","🍔","🍩","🪐",
        "🌈","🛹","🎹","🐸","🍉","🍌"
    ];

    totalPairs = Math.floor((size * size) / 2);
    const selected = emojiPool.slice(0, totalPairs);
    emojiList = [...selected, ...selected];

    if (size % 2 !== 0) {
        emojiList.push("❓");
    }

    shuffle(emojiList);
}

// ---------- DRAW ----------
function drawEmojis(cols, rows) {
    const cellW = memCanvas.width / cols;
    const cellH = memCanvas.height / rows;

    memCtx.font = `${Math.min(cellW, cellH) * 0.6}px serif`;
    memCtx.textAlign = "center";
    memCtx.textBaseline = "middle";

    let index = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            memCtx.fillText(
                emojiList[index],
                c * cellW + cellW / 2,
                r * cellH + cellH / 2
            );
            index++;
        }
    }
}

function hideEmojis(cols, rows) {
    const cellW = memCanvas.width / cols;
    const cellH = memCanvas.height / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!matchedCells.some(m => m.col === c && m.row === r)) {
                memCtx.fillStyle = "#CCC";
                memCtx.fillRect(
                    c * cellW + 5,
                    r * cellH + 5,
                    cellW - 10,
                    cellH - 10
                );
            }
        }
    }
}

function revealEmoji(col, row) {
    const cellW = memCanvas.width / gridSize;
    const cellH = memCanvas.height / gridSize;
    const index = row * gridSize + col;

    memCtx.fillStyle = "#ADD8E6"; // light blue background
    memCtx.fillRect(
        col * cellW + 5,
        row * cellH + 5,
        cellW - 10,
        cellH - 10
    );

    memCtx.fillStyle = "#000";
    memCtx.fillText(
        emojiList[index],
        col * cellW + cellW / 2,
        row * cellH + cellH / 2
    );

    return emojiList[index];
}

// ---------- GAME ----------
function startGame(size) {
    gridSize = size;
    score = 0;
    attempts = 0;
    revealedCells = [];
    matchedCells = [];

    scoreDisplay.textContent = score;
    attemptsDisplay.textContent = attempts;

    memCtx.clearRect(0, 0, memCanvas.width, memCanvas.height);

    generateEmojis(size);
    drawGrid(size, size);
    drawEmojis(size, size);

    setTimeout(() => hideEmojis(size, size), 3000);
}

function endGame() {
    memCtx.clearRect(0, 0, memCanvas.width, memCanvas.height);

    memCtx.fillStyle = "rgba(0,0,0,0.85)";
    memCtx.fillRect(0, 0, memCanvas.width, memCanvas.height);

    memCtx.fillStyle = "#FFFFFF";
    memCtx.textAlign = "center";

    memCtx.font = "40px Arial";
    memCtx.fillText("Game Over", memCanvas.width / 2, 170);

    memCtx.font = "24px Arial";
    memCtx.fillText(
        `Score: ${score} pairs in ${attempts} attempts`,
        memCanvas.width / 2,
        220
    );
}

memCanvas.addEventListener("click", e => {
    if (revealedCells.length >= 2) return;

    const rect = memCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / (memCanvas.width / gridSize));
    const row = Math.floor(y / (memCanvas.height / gridSize));

    if (
        matchedCells.some(m => m.col === col && m.row === row) ||
        revealedCells.some(r => r.col === col && r.row === row)
    ) return;

    const emoji = revealEmoji(col, row);
    revealedCells.push({ col, row, emoji });

    if (revealedCells.length === 2) {
        attempts++;
        attemptsDisplay.textContent = attempts;

        if (revealedCells[0].emoji === revealedCells[1].emoji) {
            matchedCells.push(...revealedCells);
            score++;
            scoreDisplay.textContent = score;
            revealedCells = [];
        } else {
            setTimeout(() => {
                hideEmojis(gridSize, gridSize);
                revealedCells = [];
            }, 800);
        }
    }

    if (score === totalPairs) {
        endGame();
    }
});

startGame(4);
</script>
