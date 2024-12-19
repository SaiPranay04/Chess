import { Chess } from 'chess.js';
import { Board } from '../components/Board.js';
import { GameStatus } from '../components/GameStatus.js';
import { findBestMove } from '../ai/minimax.js';

export class ChessGame {
    constructor() {
        this.chess = new Chess();
        this.selectedSquare = null;
        this.playerColor = 'w';
        
        this.board = new Board(
            document.getElementById('board'),
            this.handleSquareClick.bind(this)
        );
        
        this.status = new GameStatus(document.getElementById('status'));
        
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
    }

    init() {
        this.board.create();
        this.updateGameState();
    }

    handleSquareClick(event) {
        const square = event.target.dataset.square;
        
        if (this.chess.turn() !== this.playerColor) return;
        
        if (this.selectedSquare === null) {
            const piece = this.chess.get(square);
            if (piece && piece.color === this.playerColor) {
                this.selectedSquare = square;
                this.board.highlightSquare(square);
                this.board.highlightValidMoves(this.chess, square);
            }
        } else {
            this.makeMove(this.selectedSquare, square);
            this.board.clearHighlights();
            this.selectedSquare = null;
        }
    }

    makeMove(from, to) {
        try {
            const move = this.chess.move({ from, to, promotion: 'q' });
            if (move) {
                this.updateGameState();
                setTimeout(() => this.makeComputerMove(), 300);
            }
        } catch (e) {
            console.error(e);
        }
    }

    makeComputerMove() {
        if (this.chess.isGameOver()) return;
        
        const bestMove = findBestMove(this.chess, 3);
        if (bestMove) {
            this.chess.move(bestMove);
            this.updateGameState();
        }
    }

    updateGameState() {
        this.board.updateSquares(this.chess);
        this.status.update(this.chess);
    }

    newGame() {
        this.chess.reset();
        this.selectedSquare = null;
        this.board.clearHighlights();
        this.updateGameState();
    }
}