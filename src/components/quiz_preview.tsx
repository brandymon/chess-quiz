import { MouseEventHandler } from "react";
import ChessPosition from "./chess_position";
import { QuizModel } from "../models/quiz_model";

export interface QuizPreviewProps {
    quiz: QuizModel,
    onClick?: MouseEventHandler,
    score: number | null,
}

const QuizPreview = (props: QuizPreviewProps) =>  {
    let scorePromptClassName: "Passed" | "Failed" | null = null;
    if (props.score) {
        if (props.score === props.quiz.questions.length)
            scorePromptClassName = "Passed";
        else
            scorePromptClassName = "Failed"
    }

    const scorePrompt = props.score && scorePromptClassName
        ? <span className={scorePromptClassName + " Score"}>{`${props.score}/${props.quiz.questions.length}`}</span>
        : null;

    return (
        <ChessPosition onClick={props.onClick} position={props.quiz.initialPosition} name={props.quiz.name}>
            {scorePrompt}
        </ChessPosition>
    )
};

export default QuizPreview;