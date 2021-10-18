import Chessboard from "chessboardjsx";
import React, { PropsWithChildren } from "react";
import { QuizModel } from "./quiz_model";

export interface QuizPreviewProps {
    quiz: QuizModel,
    onClick?: React.MouseEventHandler,
    score: number | null,
}

const QuizPreview = (props: PropsWithChildren<QuizPreviewProps>) =>  {
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
        <div className="QuizPreview" onClick={props.onClick}>
            <Chessboard 
                darkSquareStyle={{backgroundColor: "#929af7"}}
                lightSquareStyle={{backgroundColor: "#e9ebfd"}}
                position={props.quiz.initialPosition}
                width={200}
                draggable={false}
            />
            <h2>{props.quiz.name}</h2>
            {scorePrompt}
        </div>
    )
};

export default QuizPreview;