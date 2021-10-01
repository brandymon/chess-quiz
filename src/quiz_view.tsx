import React, { PropsWithChildren, useReducer, useState } from "react";

import * as ChessJS from "chess.js"
import InteractiveBoard from "./interactive_board";
import { QuizModel, viennaGambitAcceptedQuiz } from "./quiz_model";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

enum QuizState {
    AwaitingMove = "",
    Retry = "Retry",
    Next = "Next",
    Complete = "Finish Quiz"
}

export interface QuizProps {
    quiz: QuizModel
}

export default function QuizView({quiz}: PropsWithChildren<QuizProps>) {
    
    let [position, setPosition] = useState(quiz.initialPosition);
    let [game] = useState(() => new Chess(position));
    let [questionNumber, incrementQuestionNumBy] = useReducer((state: number, num: number) => state + num, 0);

    let [prompts, addPrompt] = useReducer((oldPrompts: string[], newPrompt: string) => [...oldPrompts, newPrompt],
        [quiz.questions[0].prompt]);

    let [quizState, setQuizState] = useState(QuizState.AwaitingMove);
    
    const onValidMove = (move: ChessJS.ShortMove, newPosition: string) => {
        setPosition(newPosition);
        
        const question = quiz.questions[questionNumber];
        const correctMove = question.correctMove;

        if (move.from === correctMove.from && move.to === correctMove.to) {
            addPrompt(`Correct. ${question.response}`);
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
                game.undo();
                setPosition(game.fen());
                break;
            case QuizState.Next:
                if (quiz.questions[questionNumber].nextMove) {
                    game.move(quiz.questions[questionNumber].nextMove);
                    setPosition(game.fen());
                }
                if (questionNumber < quiz.questions.length) {
                    incrementQuestionNumBy(1);
                    addPrompt(quiz.questions[questionNumber + 1].prompt);
                }
                else {

                }
                
                break;
            default:
        }
        setQuizState(QuizState.AwaitingMove);
    }

    return ( 
        <div style={{display: "flex"}}>
            <div style={quizState !== QuizState.AwaitingMove ? {pointerEvents: "none"} : {}}>
                <InteractiveBoard 
                    key={quiz.initialPosition}
                    position={position} 
                    game={game}
                    onValidMove={onValidMove}
                />
            </div>
            <li>
                {prompts.map((p, i) => <ul key={i}>{p}</ul>)} 
                {quizState && <ul><button onClick={onButtonClick}>{quizState}</button></ul>}
            </li>
        </div>
    );
}

QuizView.defaultProps = {
    quiz: viennaGambitAcceptedQuiz
}