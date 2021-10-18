import { Fragment, PropsWithChildren, useState } from "react";
import { CourseModel } from "./course_model";
import { QuizModel } from "./quiz_model";
import QuizPreview from "./quiz_preview";
import QuizView from "./quiz_view";


export interface CourseViewProps {
    course: CourseModel
}

export default function CourseView({course}: PropsWithChildren<CourseViewProps>) {
    let [quiz, setQuiz] = useState<QuizModel | null>(null);

    const keyForQuiz = (quiz: QuizModel) => course.name + "=>" + quiz?.name;

    if (quiz) {
        const onFinishQuiz = (finalScore: number) => {
            quiz && localStorage.setItem(keyForQuiz(quiz), finalScore.toString());
            setQuiz(null);
        };
        return <QuizView quiz={quiz} onFinishQuiz={onFinishQuiz}/>;
    }

    const scoreForQuiz = (quiz: QuizModel) => {
        const scoreString = localStorage.getItem(keyForQuiz(quiz));
        return scoreString ? parseInt(scoreString) : null;
    };

    return (
        <Fragment>
            <h1>{course.name}</h1>
            <h2>Choose a line to review</h2>
            <div className="CourseView">
                {course.lines.map(quiz => 
                    <QuizPreview 
                        quiz={quiz} 
                        onClick={()=>setQuiz(quiz)}
                        score={scoreForQuiz(quiz)}
                    />)}
            </div>
        </Fragment>
    )
}