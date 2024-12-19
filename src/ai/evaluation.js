export const PIECE_VALUES = {
    'p': 1,
    'n': 3,
    'b': 3,
    'r': 5,
    'q': 9,
    'k': 0
};

export function evaluatePosition(chess) {
    if (chess.isCheckmate()) {
        return chess.turn() === 'w' ? -1000 : 1000;
    }
    
    if (chess.isDraw()) {
        return 0;
    }
    
    let score = 0;
    const board = chess.board();
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const value = PIECE_VALUES[piece.type.toLowerCase()];
                score += piece.color === 'w' ? value : -value;
            }
        }
    }
    
    return score;
}