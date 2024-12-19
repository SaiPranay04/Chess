export class Board {
    constructor(container, onSquareClick) {
        this.container = container;
        this.onSquareClick = onSquareClick;
    }

    create() {
        this.container.innerHTML = '';
        
        for (let i = 0; i < 64; i++) {
            const square = document.createElement('div');
            const row = Math.floor(i / 8);
            const col = i % 8;
            
            square.className = `square ${(row + col) % 2 === 0 ? 'white' : 'black'}`;
            square.dataset.square = `${String.fromCharCode(97 + col)}${8 - row}`;
            
            square.addEventListener('click', (e) => this.onSquareClick(e));
            this.container.appendChild(square);
        }
    }

    updateSquares(chess) {
        const squares = document.querySelectorAll('.square');
        squares.forEach(square => {
            const piece = chess.get(square.dataset.square);
            square.textContent = piece ? this.getPieceSymbol(piece) : '';
        });
    }

    getPieceSymbol(piece) {
        const symbols = {
            'p': '♟', 'n': '♞', 'b': '♝', 'r': '♜', 'q': '♛', 'k': '♚',
            'P': '♙', 'N': '♘', 'B': '♗', 'R': '♖', 'Q': '♕', 'K': '♔'
        };
        return symbols[piece.type];
    }

    highlightSquare(square) {
        document.querySelector(`[data-square="${square}"]`).classList.add('selected');
    }

    highlightValidMoves(chess, square) {
        const moves = chess.moves({ square: square, verbose: true });
        moves.forEach(move => {
            document.querySelector(`[data-square="${move.to}"]`).classList.add('valid-move');
        });
    }

    clearHighlights() {
        document.querySelectorAll('.square').forEach(square => {
            square.classList.remove('selected', 'valid-move');
        });
    }
}