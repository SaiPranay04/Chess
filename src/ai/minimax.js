import { evaluatePosition } from './evaluation.js';

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