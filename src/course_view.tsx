import { PropsWithChildren, useState } from "react";
import { CourseModel } from "./course_model";
import { QuizModel } from "./quiz_model";
import QuizPreview from "./quiz_preview";
import QuizView from "./quiz_view";


export interface CourseViewProps {
    course: CourseModel
}

export default function CourseView(props: PropsWithChildren<CourseViewProps>) {
    let [quiz, setQuiz] = useState<QuizModel | null>(null);

    if (quiz) return <QuizView quiz={quiz} onFinishQuiz={()=>setQuiz(null)}/>;

    return (
        <div>
            <h2>Choose a line to review</h2>
            {props.course.lines.map(quiz => <QuizPreview quiz={quiz} onClick={()=>setQuiz(quiz)}/>)}
        </div>
    )
}