/* =========================================
   A MOVE FOR YOU ♟
   Winterfell Edition
========================================= */

// STARTING POSITION

const startingPosition = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

const board = startingPosition.map(row => [...row]);

// The special knight begins on G1.

let knightPosition = { row: 7, col: 6 };
let selected = false;
let gameOver = false;
let moveCount = 0;


// HTML ELEMENTS

const chessboard = document.getElementById("chessboard");
const moveMessage = document.getElementById("moveMessage");
const queenReveal = document.getElementById("queenReveal");
const claimButton = document.getElementById("claimButton");
const letterContainer = document.getElementById("letterContainer");
const envelope = document.getElementById("envelope");

if (
    !chessboard ||
    !moveMessage ||
    !queenReveal ||
    !claimButton ||
    !letterContainer ||
    !envelope
) {
    throw new Error("A required HTML element is missing. Check index.html.");
}


// PERSONAL MESSAGES
// Each move gets a different message.

const moveMessages = [
    "An interesting choice...",
    "I see you're thinking strategically.",
    "Some things are worth taking a chance on.",
    "You're getting closer...",

    "Every journey begins somewhere.",
    "Perhaps the best things are worth pursuing.",
    "A little courage can change everything.",
    "I wonder where your next move will take you.",
    "Some paths are meant to be discovered.",
    "There is something beautiful about the unexpected.",
    "One step at a time, we're getting somewhere.",
    "Not every important move is obvious.",
    "A little patience can reveal a lot.",
    "I hope you enjoy the journey as much as the destination.",
    "Sometimes the smallest moves matter most.",
    "Keep going. There is more to this story.",
    "A thoughtful move. I like that.",
    "The best stories rarely follow a straight line.",
    "Every choice brings a new possibility.",
    "I wonder if you can see where this is leading.",
    "Some things are worth the extra effort.",
    "A little closer to something wonderful.",
    "The journey is becoming interesting.",
    "There is always another way forward.",
    "Perhaps fate has a move of its own.",
    "I like the way you're finding your way.",
    "A quiet move, but an important one.",
    "Some moments deserve to be remembered.",
    "The story is yours to unfold.",
    "I have a feeling this journey is worth it.",
    "There is still so much waiting ahead.",
    "Every move adds something to the story.",
    "A little determination goes a long way.",
    "The next chapter is waiting.",
    "I hope you know how special this journey is.",
    "Not all treasures are easy to find.",
    "The most meaningful things take time.",
    "A new possibility has just opened.",
    "Keep following your curiosity.",
    "Some destinations are worth every step."
];

// Messages used after the first 40 moves.
// The move number makes every later message unique.

const laterMessages = [
    "The story continues to unfold.",
    "There is still another possibility.",
    "A new chapter begins with every choice.",
    "The North has more secrets to reveal.",
    "Your journey is far from over.",
    "Every move has its own meaning.",
    "The next discovery is yours to make."
];

function getMoveMessage() {
    if (moveCount <= moveMessages.length) {
        return moveMessages[moveCount - 1];
    }

    const index =
        (moveCount - moveMessages.length - 1) % laterMessages.length;

    return `Move ${moveCount}: ${laterMessages[index]}`;
}


// CHESS PIECE INFORMATION

const pieces = {
    K: { name: "White king", type: "king", color: "white" },
    Q: { name: "White queen", type: "queen", color: "white" },
    R: { name: "White rook", type: "rook", color: "white" },
    B: { name: "White bishop", type: "bishop", color: "white" },
    N: { name: "White knight", type: "knight", color: "white" },
    P: { name: "White pawn", type: "pawn", color: "white" },

    k: { name: "Black king", type: "king", color: "black" },
    q: { name: "Black queen", type: "queen", color: "black" },
    r: { name: "Black rook", type: "rook", color: "black" },
    b: { name: "Black bishop", type: "bishop", color: "black" },
    n: { name: "Black knight", type: "knight", color: "black" },
    p: { name: "Black pawn", type: "pawn", color: "black" }
};


// INDIVIDUAL SVG DESIGNS

function createPieceArtwork(type, fill, stroke) {
    const designs = {

        king: `
            <path d="M22 88 L27 78 H73 L78 88 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M32 77 L38 49 H62 L68 77 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M42 49 L44 38 H56 L58 49"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M50 8 V32 M39 20 H61"
                fill="none" stroke="${stroke}" stroke-width="6"
                stroke-linecap="round"/>
            <path d="M44 36 H56"
                stroke="${stroke}" stroke-width="3"/>
            <path d="M31 68 H69"
                stroke="${stroke}" stroke-width="2" opacity="0.7"/>
        `,

        queen: `
            <path d="M22 88 L27 78 H73 L78 88 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M34 77 L39 53 H61 L66 77 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M29 53 L23 29 L39 41 L50 17 L61 41 L77 29 L71 53 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"
                stroke-linejoin="round"/>
            <circle cx="23" cy="26" r="5"
                fill="${fill}" stroke="${stroke}" stroke-width="2"/>
            <circle cx="50" cy="14" r="5"
                fill="${fill}" stroke="${stroke}" stroke-width="2"/>
            <circle cx="77" cy="26" r="5"
                fill="${fill}" stroke="${stroke}" stroke-width="2"/>
            <path d="M34 63 H66"
                stroke="${stroke}" stroke-width="2" opacity="0.7"/>
        `,

        rook: `
            <path d="M21 88 L26 78 H74 L79 88 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M30 77 V36 H70 V77 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M27 36 V21 H37 V29 H44 V21 H56 V29 H63 V21 H73 V36 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"
                stroke-linejoin="round"/>
            <path d="M39 45 V70 M50 45 V70 M61 45 V70"
                stroke="${stroke}" stroke-width="2" opacity="0.65"/>
            <path d="M30 62 H70"
                stroke="${stroke}" stroke-width="2"/>
        `,

        bishop: `
            <path d="M22 88 L27 78 H73 L78 88 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M34 77 L39 59 L32 43
                C30 26 41 15 50 12
                C59 15 70 26 68 43
                L61 59 L66 77 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M39 43 L61 23"
                stroke="${stroke}" stroke-width="4"
                stroke-linecap="round"/>
            <path d="M40 61 H60"
                stroke="${stroke}" stroke-width="2" opacity="0.7"/>
            <circle cx="50" cy="11" r="4"
                fill="${fill}" stroke="${stroke}" stroke-width="2"/>
        `,

        knight: `
            <path d="M22 88 L27 78 H73 L78 88 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M31 78
                L37 60
                L31 49
                L35 35
                L46 17
                L65 20
                L76 37
                L67 43
                L73 54
                L64 62
                L69 78 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"
                stroke-linejoin="round"/>
            <path d="M46 18 L43 7 L56 18"
                fill="${fill}" stroke="${stroke}" stroke-width="3"
                stroke-linejoin="round"/>
            <path d="M57 30 L68 32"
                stroke="${stroke}" stroke-width="2"
                stroke-linecap="round"/>
            <circle cx="62" cy="27" r="2.8"
                fill="${stroke}"/>
            <path d="M40 53 L54 61"
                stroke="${stroke}" stroke-width="2" opacity="0.7"/>
        `,

        pawn: `
            <path d="M22 88 L27 78 H73 L78 88 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M35 77
                C37 66 42 59 43 54
                C35 48 37 36 43 31
                C48 26 57 27 62 32
                C68 38 66 49 57 54
                C59 62 64 69 66 77 Z"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <circle cx="50" cy="19" r="12"
                fill="${fill}" stroke="${stroke}" stroke-width="3"/>
            <path d="M37 65 H63"
                stroke="${stroke}" stroke-width="2" opacity="0.7"/>
        `
    };

    return designs[type];
}


// DRAW PIECES

function createPiece(piece, row, col) {
    const details = pieces[piece];

    const wrapper = document.createElement("div");

    wrapper.className =
        `piece-symbol ${details.color}-symbol`;

    if (
        piece === "N" &&
        row === knightPosition.row &&
        col === knightPosition.col
    ) {
        wrapper.classList.add("special-knight");
    }

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("class", "piece-art");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", details.name);
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

    const fill =
        details.color === "white" ? "#e9edf0" : "#1b2a36";

    const stroke =
        details.color === "white" ? "#536979" : "#bdcbd4";

    svg.innerHTML = createPieceArtwork(
        details.type,
        fill,
        stroke
    );

    wrapper.appendChild(svg);

    return wrapper;
}


// KNIGHT MOVEMENT

const knightDirections = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1]
];

function isInsideBoard(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function getKnightMoves() {
    const moves = [];

    for (const [rowChange, colChange] of knightDirections) {
        const row = knightPosition.row + rowChange;
        const col = knightPosition.col + colChange;

        if (!isInsideBoard(row, col)) {
            continue;
        }

        const destination = board[row][col];

        const canMove =
            destination === null ||
            (
                destination === destination.toLowerCase() &&
                destination !== "k"
            );

        if (canMove) {
            moves.push({ row, col });
        }
    }

    return moves;
}


// CREATE THE CHESSBOARD

function createChessboard() {
    chessboard.innerHTML = "";

    const possibleMoves = selected ? getKnightMoves() : [];

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");

            square.classList.add("chess-square");

            const isDark = (row + col) % 2 === 1;

            square.classList.add(
                isDark ? "stone-square" : "ivory-square"
            );

            const piece = board[row][col];

            if (
                selected &&
                row === knightPosition.row &&
                col === knightPosition.col
            ) {
                square.classList.add("selected-piece");
            }

            const isPossibleMove = possibleMoves.some(
                move => move.row === row && move.col === col
            );

            if (isPossibleMove) {
                square.classList.add("possible-move");

                if (piece !== null) {
                    square.classList.add("occupied-square");
                }
            }

            if (piece !== null) {
                square.appendChild(
                    createPiece(piece, row, col)
                );
            }

            square.addEventListener("click", () => {
                handleSquareClick(row, col);
            });

            chessboard.appendChild(square);
        }
    }
}


// SELECT AND MOVE THE KNIGHT

function handleSquareClick(row, col) {
    if (gameOver) {
        return;
    }

    if (
        row === knightPosition.row &&
        col === knightPosition.col
    ) {
        selected = !selected;

        moveMessage.textContent = selected
            ? "Choose your next move, my love."
            : "The knight awaits your command.";

        createChessboard();
        return;
    }

    if (!selected) {
        moveMessage.textContent =
            "Select the white knight to continue.";

        return;
    }

    const possibleMoves = getKnightMoves();

    const validMove = possibleMoves.some(
        move => move.row === row && move.col === col
    );

    if (!validMove) {
        moveMessage.textContent =
            "That square is out of the knight's reach.";

        return;
    }

    makeMove(row, col);
}


// MAKE A MOVE

function makeMove(row, col) {
    const capturedPiece = board[row][col];

    board[knightPosition.row][knightPosition.col] = null;
    board[row][col] = "N";

    knightPosition = { row, col };

    selected = false;
    moveCount++;

    createChessboard();

    // Special ending: capture the black queen.

    if (capturedPiece === "q") {
        gameOver = true;

        moveMessage.textContent =
            "The Black Queen has fallen.";

        queenReveal.hidden = false;

        queenReveal.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }

    // Every ordinary move gets its own message.

    if (capturedPiece !== null) {
        moveMessage.textContent =
            `${pieces[capturedPiece].name} captured. ${getMoveMessage()}`;
    } else {
        moveMessage.textContent = getMoveMessage();
    }
}


// OPEN THE LOVE LETTER

claimButton.addEventListener("click", () => {
    queenReveal.hidden = true;
    letterContainer.hidden = false;

    envelope.classList.remove("open");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            envelope.classList.add("open");
        });
    });

    letterContainer.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});


// START THE EXPERIENCE

queenReveal.hidden = true;
letterContainer.hidden = true;

moveMessage.textContent =
    "Choose your knight and let the story begin.";

createChessboard();

