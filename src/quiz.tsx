import { useReducer, useState } from "react";

import * as ChessJS from "chess.js"
import InteractiveBoard from "./interactive_board";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

enum QuizState {
    AwaitingMove = "",
    Retry = "Retry",
    Next = "Next"
}

const initialPosition = "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 2 3";

export default function Quiz() {
    
    let [position, setPosition] = useState(initialPosition);
    let game = (position === "start") ? new Chess() : new Chess(position);

    let [prompts, addPrompt] = useReducer((oldPrompts: string[], newPrompt: string) => [...oldPrompts, newPrompt],
        ["The Vienna Gambit begins with what move in this position?"]);

    let [quizState, setQuizState] = useState(QuizState.AwaitingMove);
    
    const onValidMove = (move: ChessJS.ShortMove, position: string) => {
        setPosition(position);

        if (move.from === "f2" && move.to === "f4") {
            addPrompt("Correct, white gambits the f pawn");
            setQuizState(QuizState.Next);
        }
        else {
            addPrompt("Incorrect");
            setQuizState(QuizState.Retry);
        }
    };

    const onButtonClick = () => {
        switch(quizState) {
            case QuizState.Retry:
                setPosition(initialPosition);
                break;
            case QuizState.Next:
            default:
        }
    }

    return (
        <div style={{display: "flex"}}>
            <InteractiveBoard 
                key={initialPosition}
                position={position} 
                game={game}
                onValidMove={onValidMove}
            />
            <li>
                {prompts.map((p, i) => <ul key={i}>{p}</ul>)} 
                {quizState && <ul><button onClick={onButtonClick}>{quizState}</button></ul>}
            </li>
        </div>
    );
}