import { Fragment, useState } from "react";
import LinePreview from "../components/line_preview";
import { getOpening } from "../services/storage";
import { useParams } from "react-router";

/** Allow a user to choose which line of an opening they'd like to review, then take them to the appropriate quiz */
export default function OpeningView() {

    let params = useParams();

    let [opening] = useState(() => (params.openingID && getOpening(params.openingID)));
    if (!opening) throw Error("Undefined opening ID");

    return (
        <Fragment>
            <h1>{opening.name}</h1>
            <h2>Choose a line to review</h2>
            <div className="CourseView">
                {opening.lines.map(quiz => 
                    <LinePreview 
                        quiz={quiz} 
                        href={quiz.id}
                        score={quiz.lastScore}
                    />)}
            </div>
        </Fragment>
    )
}