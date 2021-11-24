import * as ChessJS from "chess.js"
import { Identifiable } from "./identifiable";

export interface QuizQuestion {
    prompt: string,
    correctMove: ChessJS.ShortMove,
    response: string,
    nextMove: ChessJS.ShortMove,
}

export interface LineModel extends Identifiable {
     /** FEN of the  starting position for this line */ 
    initialPosition: string,
    /** A series of questions to ask about the position */
    questions: QuizQuestion[],
    /** The name of this quiz */
    name: string,
    /** The last score schioeved by the user on the quiz for this line */
    lastScore?: number,
}

export function isLine(line: Identifiable | null) : line is LineModel {
    return line != null && "initialPosition" in line &&  "questions" in line && "name" in line && "id" in line;
}

export const viennaGambitAcceptedQuiz: LineModel = {
    name: "Vienna Gambit Accepted",
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

export const viennaGambitDeclinedNc6Quiz: LineModel = {
    name: "Vienna Gambit Declined, 3...Nc6",
    initialPosition: "r1bqkb1r/pppp1ppp/2n2n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR w KQkq - 1 4",
    questions: [
        {
            prompt: "At low levels, one common way to decline the gambit is with Nc3, but this is winning for white. Find the refutation.",
            correctMove: { from: "f4", to: "e5" },
            response: "White takes the pawn anyway.",
            nextMove: { from: "c6", to: "e5" }
        },
        {
            prompt: "Suppose black recaptures the pawn. What is the best continuation for white?",
            correctMove: { from: "d2", to: "d4", },
            response: "White puts two pawns in the centre while gaining tempo on the knight.",
            nextMove: { from: "e5", to: "g6" }
        },
        {
            prompt: "Finally, black's knight on e5 could retreat to g6 or c6. Either way, which move best preserves white's advantage?",
            correctMove: { from: "e4", to: "e5", },
            response: "White gains dominant central control and forces black's knight on f6 to retreat. This gives white a crushing advantage out of the opening.",
            nextMove: { from: "e5", to: "g6" }
        },
    ]
};

export const viennaGambitDeclined3d6Quiz: LineModel = {
    name: "Vienna Gambit Declined, 3...d6",
    initialPosition: "rnbqkb1r/ppp2ppp/3p1n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR w KQkq - 0 4",
    questions: [
        {
            prompt: "Another common idea is to defend the e-pawn by moving the d-pawn, but this is passive as it blocks in their dark-squared bishop. How should white develop?",
            correctMove: { from: "g1", to: "f3" },
            response: "This is the most flexible developing move - we don't want to develop the bishop yet.",
            nextMove: { from: "b8", to: "c6" }
        },
        {
            prompt: "If black's knight comes to c6, how should white continue developing? (Hint: why did we delay developing the light-squared bishop?)",
            correctMove: { from: "f1", to: "b5", },
            response: "Pinning the knight applies the most pressure to black's centre.",
            nextMove: { from: "c8", to: "d7" }
        },
        {
            prompt: "Black may decide to unpin their knight. How should white continue? (Hint: we don't need to rush to recapture the knight.",
            correctMove: { from: "d2", to: "d3", },
            response: "White creates a central pawn chain without blocking in their (already developed) light-squared bishop. White has a slight edge here. From here, black could take the f-pawn, in which case you should recapture with the bishop. Otherwise you can look to take their knight, then open up the position with fxe5.",
            nextMove: { from: "e5", to: "g6" }
        },
    ]
};

export const viennaGambitMainLineIntroQuiz: LineModel = {
    name: "Vienna Gambit, Main Line (Intro)",
    initialPosition: "rnbqkb1r/ppp2ppp/5n2/3pp3/4PP2/2N5/PPPP2PP/R1BQKBNR w KQkq d6 0 4",
    questions: [
        {
            prompt: "The best way for black to try and equalise is to counter-gambit their d-pawn. How should white respond?",
            correctMove: { from: "f4", to: "e5" },
            response: "This attacks black's knight, and there is only one correct response for black here.",
            nextMove: { from: "f6", to: "e4" }
        },
        {
            prompt: "Black should capture your pawn on e4. There are 3 possible responses here from white: d3, Nf3, and which other move?",
            correctMove: { from: "d1", to: "f3", },
            response: "This has recently become regarded as the main line and white's best chance for an advantage, but this position is considered equal. Black has 3 responses which will be covered in future quizzes.",
            nextMove: { from: "c8", to: "c7" }
        },
    ]
};

export const viennaGambitMainLineNxc3Quiz: LineModel = {
    name: "Vienna Gambit, Main Line 5...Nxc3",
    initialPosition: "rnbqkb1r/ppp2ppp/8/3pP3/8/2n2Q2/PPPP2PP/R1B1KBNR w KQkq - 0 6",
    questions: [
        {
            prompt: "From the Main Line position in the previous quiz, one of black's most natural moves is to take your c3 knight. How should white respond?",
            correctMove: { from: "b2", to: "c3" },
            response: "If black plays a developing move, we can get a big centre with d4 and develop naturally (i.e. put our light-squared bishop on d3, put a knight on e2, castle). This may lead to a big king-side attack.",
            nextMove: { from: "c7", to: "c5" }
        },
        {
            prompt: "Alternatively, black may try and stifle natural development with c5. How can white respond?",
            correctMove: { from: "f3", to: "g3", },
            response: "This makes it difficult for black to develop the dark-squared bishop without losing material, and leaves their king somewhat stranded in the centre.",
            nextMove: { from: "b8", to: "c6" }
        },
        {
            prompt: "The most natural response for black is to try and develop the queenside knight. What is white's most flexible response?",
            correctMove: { from: "g1", to: "f3", },
            response: "While it is possible for black to equalise here, the lines are tricky to find (the engine says h5 and Qa5, really??). You'll mainly look to develop your bishop, get your rook to the open b-file and castle. Black's play is much less natural.",
            nextMove: { from: "b8", to: "c6" }
        },
    ]
};