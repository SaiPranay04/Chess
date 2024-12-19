import { Chess } from 'chess.js';
import { evaluatePosition, findBestMove } from './ai.js';

const chess = new Chess();
let selectedSquare = null;
let playerColor = 'w';

function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    
    for (let i = 0; i < 64; i++) {
        const square = document.createElement('div');
        const row = Math.floor(i / 8);
        const col = i % 8;
        
        square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
        square.dataset.square = `${String.fromCharCode(97 + col)}${8 - row}`;
        
        square.addEventListener('click', handleSquareClick);
        board.appendChild(square);
    }
    updateBoard();
}

function updateBoard() {
    const squares = document.querySelectorAll('.square');
    squares.forEach(square => {
        const piece = chess.get(square.dataset.square);
        square.textContent = piece ? getPieceSymbol(piece) : '';
    });
    
    document.getElementById('status').textContent = 
        chess.isGameOver() ? getGameStatus() : `${chess.turn() === 'w' ? 'White' : 'Black'}'s turn`;
}

function getPieceSymbol(piece) {
    const symbols = {
        'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
        'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
    };
    return symbols[piece.type];
}

function handleSquareClick(event) {
    const square = event.target.dataset.square;
    
    if (chess.turn() !== playerColor) return;
    
    if (selectedSquare === null) {
        const piece = chess.get(square);
        if (piece && piece.color === playerColor) {
            selectedSquare = square;
            highlightSquare(square);
            highlightValidMoves(square);
        }
    } else {
        makeMove(selectedSquare, square);
        clearHighlights();
        selectedSquare = null;
    }
}

function highlightSquare(square) {
    document.querySelector(`[data-square="${square}"]`).classList.add('selected');
}

function highlightValidMoves(square) {
    const moves = chess.moves({ square: square, verbose: true });
    moves.forEach(move => {
        document.querySelector(`[data-square="${move.to}"]`).classList.add('valid-move');
    });
}

function clearHighlights() {
    document.querySelectorAll('.square').forEach(square => {
        square.classList.remove('selected', 'valid-move');
    });
}

function makeMove(from, to) {
    try {
        const move = chess.move({ from, to, promotion: 'q' });
        if (move) {
            updateBoard();
            setTimeout(makeComputerMove, 300);
        }
    } catch (e) {
        console.error(e);
    }
}

function makeComputerMove() {
    if (chess.isGameOver()) return;
    
    const bestMove = findBestMove(chess, 3);
    if (bestMove) {
        chess.move(bestMove);
        updateBoard();
    }
}

function getGameStatus() {
    if (chess.isCheckmate()) return 'Checkmate!';
    if (chess.isDraw()) return 'Draw!';
    if (chess.isStalemate()) return 'Stalemate!';
    return 'Game Over!';
}

document.getElementById('newGame').addEventListener('click', () => {
    chess.reset();
    selectedSquare = null;
    clearHighlights();
    updateBoard();
});

createBoard();