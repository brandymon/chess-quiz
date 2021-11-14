import { Fragment, PropsWithChildren, useState } from "react";
import { OpeningsModel } from "../models/opening_model";
import { LineModel } from "../models/line_model";
import LinePreview from "../components/line_preview";
import QuizView from "./quiz_view";

export interface OpeningViewProps {
    opening: OpeningsModel
}

/** Allow a user to choose which line of an opening they'd like to review, then take them to the appropriate quiz */
export default function OpeningView({opening: course}: PropsWithChildren<OpeningViewProps>) {
    let [quiz, setQuiz] = useState<LineModel | null>(null);

    const keyForQuiz = (quiz: LineModel) => course.name + "=>" + quiz?.name;

    if (quiz) {
        const onFinishQuiz = (finalScore: number) => {
            quiz && localStorage.setItem(keyForQuiz(quiz), finalScore.toString());
            setQuiz(null);
        };
        return <QuizView quiz={quiz} onFinishQuiz={onFinishQuiz}/>;
    }

    const scoreForQuiz = (quiz: LineModel) => {
        const scoreString = localStorage.getItem(keyForQuiz(quiz));
        return scoreString ? parseInt(scoreString) : null;
    };

    return (
        <Fragment>
            <h1>{course.name}</h1>
            <h2>Choose a line to review</h2>
            <div className="CourseView">
                {course.lines.map(quiz => 
                    <LinePreview 
                        quiz={quiz} 
                        onClick={()=>setQuiz(quiz)}
                        score={scoreForQuiz(quiz)}
                    />)}
            </div>
        </Fragment>
    )
}