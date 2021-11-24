import { Fragment, PropsWithChildren, useState } from "react";
import { OpeningsModel } from "../models/opening_model";
import { LineModel } from "../models/line_model";
import LinePreview from "../components/line_preview";
import QuizView from "./quiz_view";
import { storeObject } from "../services/storage";

export interface OpeningViewProps {
    opening: OpeningsModel
}

/** Allow a user to choose which line of an opening they'd like to review, then take them to the appropriate quiz */
export default function OpeningView({opening: course}: PropsWithChildren<OpeningViewProps>) {
    let [line, setLine] = useState<LineModel | null>(null);

    if (line) {
        const onFinishQuiz = (finalScore: number) => {
            if (line) {
                line.lastScore = finalScore;
                storeObject(line);
            }
            
            setLine(null);
        };

        return <QuizView quiz={line} onFinishQuiz={onFinishQuiz}/>;
    }

    return (
        <Fragment>
            <h1>{course.name}</h1>
            <h2>Choose a line to review</h2>
            <div className="CourseView">
                {course.lines.map(quiz => 
                    <LinePreview 
                        quiz={quiz} 
                        onClick={()=>setLine(quiz)}
                        score={quiz.lastScore}
                    />)}
            </div>
        </Fragment>
    )
}