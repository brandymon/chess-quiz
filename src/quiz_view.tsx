import React, { Fragment, PropsWithChildren, useEffect, useReducer, useState } from "react";

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

    useEffect(() => { 
        document.title = quiz.name;
    });

    let [prompts, addPrompt] = useReducer((oldPrompts: string[], newPrompt: string) => [...oldPrompts, newPrompt],
        [quiz.questions[0].prompt]);

    let [quizState, setQuizState] = useState(QuizState.AwaitingMove);

    let [score, incrementScore] = useReducer((current: number) => current + 1, 0);
    let [gotQuestionWrong, setGotQuestionWrong] = useState(false);
    
    const onValidMove = (move: ChessJS.ShortMove, newPosition: string) => {
        setPosition(newPosition);
        
        const question = quiz.questions[questionNumber];
        const correctMove = question.correctMove;
        const history = game.history();
        const lastMove = history[history.length - 1];
        if (move.from === correctMove.from && move.to === correctMove.to) {
            
            addPrompt(`${lastMove} is correct. ${question.response}`);

            if (gotQuestionWrong) setGotQuestionWrong(false);
            else incrementScore();

            if (questionNumber === quiz.questions.length - 1)
                setQuizState(QuizState.Complete);
            else
                setQuizState(QuizState.Next);
        }
        else {
            setGotQuestionWrong(true);
            addPrompt(`${lastMove} is incorrect`);
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
                addPrompt(quiz.questions[questionNumber + 1].prompt);
                incrementQuestionNumBy(1);
                break;
            case QuizState.Complete:

        }

        setQuizState(QuizState.AwaitingMove);
    }

    return ( 
        <Fragment>
            <h1>{quiz.name}</h1>
            <div style={{display: "flex"}}>
                <div style={quizState !== QuizState.AwaitingMove ? {pointerEvents: "none"} : {}}>
                    <InteractiveBoard 
                        key={quiz.initialPosition}
                        position={position} 
                        game={game}
                        onValidMove={onValidMove}
                    />
                </div>
                <ul>
                    {prompts.map((p, i) => <li key={i}>{p}</li>)} 
                    {quizState === QuizState.Complete && <li>{`You scored ${score}/${quiz.questions.length}`}</li>}
                    {(quizState && <li key={"retry"}><button onClick={onButtonClick}>{quizState}</button></li>)}
                </ul>
            </div>
        </Fragment>
    );
}

QuizView.defaultProps = {
    quiz: viennaGambitAcceptedQuiz
}