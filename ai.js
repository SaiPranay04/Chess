const PIECE_VALUES = {
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

export function findBestMove(chess, depth = 3) {
    const moves = chess.moves({ verbose: true });
    let bestMove = null;
    let bestValue = -Infinity;
    
    for (const move of moves) {
        chess.move(move);
        const value = -minimax(chess, depth - 1, -Infinity, Infinity, false);
        chess.undo();
        
        if (value > bestValue) {
            bestValue = value;
            bestMove = move;
        }
    }
    
    return bestMove;
}

function minimax(chess, depth, alpha, beta, maximizingPlayer) {
    if (depth === 0 || chess.isGameOver()) {
        return evaluatePosition(chess);
    }
    
    const moves = chess.moves();
    
    if (maximizingPlayer) {
        let maxValue = -Infinity;
        for (const move of moves) {
            chess.move(move);
            const value = minimax(chess, depth - 1, alpha, beta, false);
            chess.undo();
            maxValue = Math.max(maxValue, value);
            alpha = Math.max(alpha, value);
            if (beta <= alpha) break;
        }
        return maxValue;
    } else {
        let minValue = Infinity;
        for (const move of moves) {
            chess.move(move);
            const value = minimax(chess, depth - 1, alpha, beta, true);
            chess.undo();
            minValue = Math.min(minValue, value);
            beta = Math.min(beta, value);
            if (beta <= alpha) break;
        }
        return minValue;
    }
}