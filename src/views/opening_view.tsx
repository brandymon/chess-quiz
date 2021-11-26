import { Fragment, useEffect, useState } from "react";
import LinePreview from "../components/line_preview";
import { getOpening } from "../services/storage";
import { useParams } from "react-router";

/** Allow a user to choose which line of an opening they'd like to review, then take them to the appropriate quiz */
export default function OpeningView() {

    let params = useParams();

    let [opening] = useState(() => getOpening(params.openingID ?? ""));
    
    useEffect(() => { document.title = opening.name; }, [opening.name]);

    return (
        <Fragment>
            <h1>{opening.name}</h1>
            <h2>Choose a line to review</h2>
            <div className="CourseView">
                {opening.lines.map(quiz => 
                    <LinePreview 
                        quiz={quiz} 
                        linkTo={quiz.id}
                        score={quiz.lastScore}
                        key={quiz.id}
                        editLink={`/edit/line/${quiz.id}`}
                    />)}
            </div>
        </Fragment>
    )
}