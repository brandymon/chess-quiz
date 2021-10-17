import Chessboard from "chessboardjsx";
import React, { PropsWithChildren } from "react";
import { QuizModel } from "./quiz_model";

export interface QuizPreviewProps {
    quiz: QuizModel,
    onClick?: React.MouseEventHandler
}

const QuizPreview = (props: PropsWithChildren<QuizPreviewProps>) =>  
    <div className="QuizPreview" onClick={props.onClick}>
        <Chessboard 
            darkSquareStyle={{backgroundColor: "#929af7"}}
            lightSquareStyle={{backgroundColor: "#e9ebfd"}}
            position={props.quiz.initialPosition}
            width={200}
            draggable={false}
        />
        <h2>{props.quiz.name}</h2>
    </div>;

export default QuizPreview;