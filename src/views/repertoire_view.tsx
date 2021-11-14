import { Fragment, PropsWithChildren, useState } from "react";
import ChessPosition from "../components/chess_position";
import OpeningView from "./opening_view";
import { OpeningsModel } from "../models/opening_model";
import { RepertoireModel } from "../models/repertoire_model";

export interface RepertoireProps {
    repertoire: RepertoireModel
}

export default function RepertoireView({repertoire}: PropsWithChildren<RepertoireProps>) {

    let [opening, setOpening] = useState<OpeningsModel | null>(null);

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