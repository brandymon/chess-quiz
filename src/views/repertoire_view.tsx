import { Fragment, useEffect, useState } from "react";
import ChessPosition from "../components/chess_position";
import { getRepertoire } from "../services/storage";


export default function RepertoireView() {

    let [repertoire] = useState(() => getRepertoire());
    useEffect(() => { document.title = "Chessquiz - Your Repertoire"; });

    return (
        <Fragment>
            <h1>Your Repertoire</h1>
            <h2>Choose an opening to review</h2>
            <div className="CourseView">
                {
                    repertoire.openings.map(opening => 
                        <ChessPosition 
                            position={opening.initialPosition} 
                            name={opening.name} 
                            href={`/opening/${opening.id}`}
                            key={opening.id}
                        />)
                }
            </div>
        </Fragment>
    )
}