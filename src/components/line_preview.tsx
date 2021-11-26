import ChessPosition from "./chess_position";
import { LineModel } from "../models/line_model";

export interface LinePreviewProps {
    quiz: LineModel,
    score?: number,
    linkTo?: string,
    editLink?: string,
}

export default function LinePreview(props: LinePreviewProps)  {
    let scorePromptClassName: "Passed" | "Failed" | null = null;
    if (props.score) {
        if (props.score === props.quiz.questions.length)
            scorePromptClassName = "Passed";
        else
            scorePromptClassName = "Failed"
    }

    const scorePrompt = props.score && scorePromptClassName
        ? <div className={scorePromptClassName + " Score"}>{`${props.score}/${props.quiz.questions.length}`}</div>
        : null;

    return (
        <ChessPosition linkTo={props.linkTo} position={props.quiz.initialPosition} name={props.quiz.name} editLink={props.editLink}>
            {scorePrompt}
        </ChessPosition>
    )
};