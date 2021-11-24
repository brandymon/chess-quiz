import { Fragment, useState } from "react";
import ChessPosition from "../components/chess_position";
import OpeningView from "./opening_view";
import { OpeningsModel } from "../models/opening_model";
import { getRepertoire } from "../services/storage";


export default function RepertoireView() {

    let [opening, setOpening] = useState<OpeningsModel | null>(null);
    let [repertoire] = useState(() => getRepertoire());

    if (opening) return (<OpeningView opening={opening}/>);
    
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
                            onClick={() => setOpening(opening)}
                        />)
                }
            </div>
        </Fragment>
    )
}