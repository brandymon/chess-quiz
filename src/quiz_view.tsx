import { PropsWithChildren, useEffect, useReducer, useState } from "react";

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

interface QuestionViewProps {
    quiz: QuizModel,
    questionNumber: number
}

const getPrompt = (className: string, title: string, message?: string) =>
    <li className={className}>
        <span><h3>{title}</h3>{message}</span>
    </li>;

const AskQuestion = (props: QuestionViewProps) =>
    getPrompt("Question", `Question ${props.questionNumber + 1}`, props.quiz.questions[props.questionNumber].prompt);

interface ResponseViewProps {
    message?: string,
    move: string
}

const IncorrectResponse = (props: ResponseViewProps) =>
    getPrompt("Incorrect", `${props.move} is incorrect`, props.message);

const CorrectResponse = (props: ResponseViewProps) => 
    getPrompt("Correct", `${props.move} is correct`, props.message);

export default function QuizView({quiz}: PropsWithChildren<QuizProps>) {
    
    let [position, setPosition] = useState(quiz.initialPosition);
    let [game] = useState(() => new Chess(position));
    let [questionNumber, incrementQuestionNumBy] = useReducer((state: number, num: number) => state + num, 0);

    useEffect(() => { 
        document.title = quiz.name;
    });

    let [prompts, addPrompt] = useReducer((oldPrompts: JSX.Element[], newPrompt: JSX.Element) => 
        [...oldPrompts, newPrompt],
        [<AskQuestion questionNumber={0} quiz={quiz}/>]);

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
            
            addPrompt(<CorrectResponse move={lastMove} message={question.response}/>);

            if (gotQuestionWrong) setGotQuestionWrong(false);
            else incrementScore();

            if (questionNumber === quiz.questions.length - 1)
                setQuizState(QuizState.Complete);
            else
                setQuizState(QuizState.Next);
        }
        else {
            setGotQuestionWrong(true);
            addPrompt(<IncorrectResponse move={lastMove}/>);
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
                addPrompt(<AskQuestion quiz={quiz} questionNumber={questionNumber+1}/>);
                incrementQuestionNumBy(1);
                break;
            case QuizState.Complete:

        }

        setQuizState(QuizState.AwaitingMove);
    }

    useEffect(() => {
        let list = document.getElementById("quizPromptList");
        if (list) list.scrollTop = list.scrollHeight;
    }, [prompts]);

    return ( 
        <div className="Quiz">
            <h2>{quiz.name}</h2>
            <div className="QuizBoardAndPrompts">
                <div 
                    className="Chessboard"
                    style={quizState !== QuizState.AwaitingMove ? {pointerEvents: "none"} : {}}
                >
                    <InteractiveBoard 
                        key={quiz.initialPosition}
                        position={position} 
                        game={game}
                        onValidMove={onValidMove}
                    />
                </div>
                <div className="PromptContainer" id="quizPromptList">
                    <ul className="QuizPrompt">
                        {prompts} 
                        {quizState === QuizState.Complete && <li><span>{`You scored ${score}/${quiz.questions.length}`}</span></li>}
                        {(quizState && <button onClick={onButtonClick}>{quizState}</button>)}
                    </ul>
                </div>
            </div>
        </div>
    );
}

QuizView.defaultProps = {
    quiz: viennaGambitAcceptedQuiz
}