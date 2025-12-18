---
layout: opencs
title: Memory Game
permalink: /javascript/project/memory
---

<style>
.memoryCanvas { 
    border: 10px solid #0b1c3d;
    display: block;
    margin: 0 auto 20px auto;
}

h2, p { text-align: center; }

button {
    border: none;
    border-radius: 10px;
    padding: 8px 14px;
    margin: 8px;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
    font-weight: bold;
}

/* Difficulty buttons */
.easy {
    background-color: #64B5F6;
    color: green;
}

.medium {
    background-color: #64B5F6;
    color: orange;
}

.hard {
    background-color: #64B5F6;
    color: red;
}

.end-btn {
    background-color: #ADD8E6;
    color: black;
}

/* Difficulty box */
.difficulty-box {
    border: 3px solid #000;
    padding: 10px 20px;
    background-color: #ADD8E6;
    border-radius: 12px;
    text-align: center;
}

.difficulty-box h3 {
    color: black !important;      /* FIXED */
    font-weight: bold;
    margin-bottom: 10px;
}

.difficulty-container {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
</style>

<h2>Memory Game</h2>
<p>Score: <span class="score">0</span></p>
<p>Attempts: <span class="attempts">0</span></p>

<canvas class="memoryCanvas" id="memoryCanvas" width="600" height="400"></canvas>

<div class="difficulty-container">
    <div class="difficulty-box">
        <h3>Difficulty Modes</h3>
        <button class="easy" onclick="startGame(4)">Easy</button>
        <button class="medium" onclick="startGame(5)">Medium</button>
        <button class="hard" onclick="startGame(6)">Hard</button>
    </div>
</div>

<div style="text-align:center;">
    <button class="end-btn" onclick="endGame()">End Game</button>
</div>

<script>
const memCanvas = document.getElementById("memoryCanvas");
const memCtx = memCanvas.getContext("2d");

const scoreDisplay = document.querySelector(".score");
const attemptsDisplay = document.querySelector(".attempts");

let gridSize = 4;
let score = 0;
let attempts = 0;
let revealedCells = [];
let matchedCells = [];
let emojiList = [];
let totalPairs = 0;

let isMemorizing = false;
let gameOver = false;

/* Lock difficulty buttons */
function setDifficultyButtonsDisabled(disabled) {
    document.querySelectorAll(".easy, .medium, .hard").forEach(btn => {
        btn.disabled = disabled;
        btn.style.cursor = disabled ? "not-allowed" : "pointer";
        btn.style.opacity = disabled ? "0.6" : "1";
    });
}

/* Grid */
function drawGrid(cols, rows) {
    memCtx.strokeStyle = "#0b1c3d";
    memCtx.lineWidth = 10;

    for (let i = 0; i <= cols; i++) {
        memCtx.beginPath();
        memCtx.moveTo((memCanvas.width / cols) * i, 0);
        memCtx.lineTo((memCanvas.width / cols) * i, memCanvas.height);
        memCtx.stroke();
    }

    for (let i = 0; i <= rows; i++) {
        memCtx.beginPath();
        memCtx.moveTo(0, (memCanvas.height / rows) * i);
        memCtx.lineTo(memCanvas.width, (memCanvas.height / rows) * i);
        memCtx.stroke();
    }
}

/* Shuffle */
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/* Emojis */
function generateEmojis(size) {
    const emojiPool = [
        "😀","🎉","🍕","🐶","🌟","🚀","🍎","🦄",
        "⚽","🎮","🎧","📱","🐱","🍔","🍩","🪐",
        "🌈","🛹","🎹","🐸","🍉","🍌"
    ];

    totalPairs = Math.floor((size * size) / 2);
    const selected = emojiPool.slice(0, totalPairs);
    emojiList = [...selected, ...selected];

    if ((size * size) % 2 !== 0) emojiList.push("❓");

    shuffle(emojiList);
}

/* Draw emojis */
function drawEmojis(cols, rows) {
    const cellW = memCanvas.width / cols;
    const cellH = memCanvas.height / rows;

    memCtx.font = `${Math.min(cellW, cellH) * 0.6}px serif`;
    memCtx.textAlign = "center";
    memCtx.textBaseline = "middle";

    let i = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            memCtx.fillText(
                emojiList[i],
                c * cellW + cellW / 2,
                r * cellH + cellH / 2
            );
            i++;
        }
    }
}

function hideEmojis(cols, rows) {
    const cellW = memCanvas.width / cols;
    const cellH = memCanvas.height / rows;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            memCtx.fillStyle = "#ccc";
            memCtx.fillRect(
                c * cellW + 5,
                r * cellH + 5,
                cellW - 10,
                cellH - 10
            );
        }
    }
}

/* Reveal */
function revealEmoji(col, row) {
    const cellW = memCanvas.width / gridSize;
    const cellH = memCanvas.height / gridSize;
    const index = row * gridSize + col;

    memCtx.fillStyle = "#ADD8E6";
    memCtx.fillRect(
        col * cellW + 5,
        row * cellH + 5,
        cellW - 10,
        cellH - 10
    );

    memCtx.font = `${Math.min(cellW, cellH) * 0.6}px serif`;
    memCtx.textAlign = "center";
    memCtx.textBaseline = "middle";
    memCtx.fillStyle = "#000";

    memCtx.fillText(
        emojiList[index],
        col * cellW + cellW / 2,
        row * cellH + cellH / 2
    );

    return emojiList[index];
}

/* Game */
function startGame(size) {
    gridSize = size;
    score = 0;
    attempts = 0;
    revealedCells = [];
    matchedCells = [];
    gameOver = false;

    scoreDisplay.textContent = score;
    attemptsDisplay.textContent = attempts;

    memCtx.clearRect(0, 0, memCanvas.width, memCanvas.height);

    isMemorizing = true;
    setDifficultyButtonsDisabled(true);

    generateEmojis(size);
    drawGrid(size, size);
    drawEmojis(size, size);

    setTimeout(() => {
        hideEmojis(size, size);
        isMemorizing = false;
        setDifficultyButtonsDisabled(false);
    }, 3000);
}

function endGame() {
    gameOver = true;

    memCtx.clearRect(0, 0, memCanvas.width, memCanvas.height);
    memCtx.fillStyle = "rgba(0,0,0,0.85)";
    memCtx.fillRect(0, 0, memCanvas.width, memCanvas.height);

    memCtx.fillStyle = "#fff";
    memCtx.textAlign = "center";
    memCtx.font = "40px Arial";
    memCtx.fillText("Game Over", memCanvas.width / 2, 160);

    memCtx.font = "24px Arial";
    memCtx.fillText(
        `Score: ${score} pairs in ${attempts} attempts`,
        memCanvas.width / 2,
        210
    );
}

/* Click */
memCanvas.addEventListener("click", e => {
    if (isMemorizing || gameOver || revealedCells.length >= 2) return;

    const rect = memCanvas.getBoundingClientRect();
    const col = Math.floor((e.clientX - rect.left) / (memCanvas.width / gridSize));
    const row = Math.floor((e.clientY - rect.top) / (memCanvas.height / gridSize));

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

    if (score === totalPairs) endGame();
});

startGame(4);
</script>
