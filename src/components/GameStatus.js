export class GameStatus {
    constructor(element) {
        this.element = element;
    }

    update(chess) {
        this.element.textContent = chess.isGameOver() 
            ? this.getGameStatus(chess) 
            : `${chess.turn() === 'w' ? 'White' : 'Black'}'s turn`;
    }

    getGameStatus(chess) {
        if (chess.isCheckmate()) return 'Checkmate!';
        if (chess.isDraw()) return 'Draw!';
        if (chess.isStalemate()) return 'Stalemate!';
        return 'Game Over!';
    }
}