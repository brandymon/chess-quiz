import ChessPosition from "./chess_position";
import { LineModel } from "../models/line_model";

export interface LinePreviewProps {
    quiz: LineModel,
    score?: number,
    href?: string
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
        ? <span className={scorePromptClassName + " Score"}>{`${props.score}/${props.quiz.questions.length}`}</span>
        : null;

    return (
        <ChessPosition href={props.href} position={props.quiz.initialPosition} name={props.quiz.name}>
            {scorePrompt}
        </ChessPosition>
    )
};