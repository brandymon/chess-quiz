import * as ChessJS from "chess.js"

export interface QuizQuestion {
    prompt: string,
    correctMove: ChessJS.ShortMove,
    response: string,
    nextMove: ChessJS.ShortMove,
}

export interface QuizModel {
     /** FEN of the  starting position for this line */ 
    initialPosition: string,
    /** A sequence of questions to ask about the position */
    questions: QuizQuestion[]
}

export const viennaGambitAcceptedQuiz: QuizModel = {
    initialPosition: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3",
    questions: [
        {
            prompt: "The Vienna Gambit begins with what move in this position?",
            correctMove: { from: "f2", to: "f4" },
            response: "White gambits the f pawn",
            nextMove: { from: "e5", to: "f4" }
        },
        {
            prompt: "Suppose black accepts the gambit, what is white's best response? (Hint: why is this position better than the King's Gambit?)",
            correctMove: { from: "e4", to: "e5", },
            response: "White takes space in the centre while gaining tempo by attacking the knight. Note that the knight cannot move forward.",
            nextMove: { from: "d8", to: "e7" }
        },
        {
            prompt: "Black could try and be clever, pinning your pawn. How can white maintain pressure on the knight?",
            correctMove: { from: "d1", to: "e2" },
            response: "This unpins the pawn while developing the queen. Black's knight must now retreat.",
            nextMove: { from: "f6", to: "g8" }
        },
        {
            prompt: "Now the knight has undeveloped, what's the most accurate continuation for white?",
            correctMove: { from: "g1", to: "f3" },
            response: "This defends against Qh4 check, which is particularly nasty because of the pawn on f4.",
            nextMove: { from: "d7", to: "d6" }
        },
        {
            prompt: "A common idea here is for black to attack your e pawn. How can white punish this?",
            correctMove: { from: "c3", to: "d5" },
            response: "This attacks both the queen and the c7 pawn. If the queen goes to e6, then we have a royal fork.",
            nextMove: { from: "e7", to: "d7" }
        },
        {
            prompt: "Suppose black's queen instead tries to maintain vision on the d7 pawn. Find the winning continuation.",
            correctMove: { from: "d5", to: "c7" },
            response: "This forks the king and rook, and the square is only defended by the queen.",
            nextMove: { from: "d7", to: "c7" }
        },
        {
            prompt: "Finally, what if the queen recaptures the knight?",
            correctMove: { from: "e5", to: "d6" },
            response: "This is a discover check that attacks both the king and queen. Black's position crumbles.",
            nextMove: { from: "e7", to: "d7" }
        },
    ]
};