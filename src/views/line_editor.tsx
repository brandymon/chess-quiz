import { useParams } from "react-router";
import { retrieveObject } from "../services/storage";
import React, { useState } from "react";
import InteractiveBoard from "../components/interactive_board";
import { isLine } from "../models/line_model";

import * as ChessJS from "chess.js";
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

export default function LineEditor() {
    let params = useParams();
    let [line, setLine] = useState(() => {
        let obj = retrieveObject(params.lineID ?? "");
        if (isLine(obj)) return obj;
        throw Error(`object with given id is not a line, id: ${params.lineID}`);
    });

    let [position, setPosition] = useState<string | undefined>(undefined);
    let [game] = useState(() => position ? new Chess(position) : new Chess());
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => 
        setLine({...line, [event.target.name]: event.target.value});

    const handlePositionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let {valid} = game.validate_fen(event.target.value);
        if (valid) {
            setPosition(event.target.value);
            setLine({...line, initialPosition: event.target.value});
        }
        else setLine({...line});
    };

    

    return (
        
        <div className="Quiz">
            <h1>Edit Quiz</h1>
            <div className="QuizBoardAndPrompts">
                <div style={position ? {} : {pointerEvents: "none"}}>
                    <InteractiveBoard 
                        key={line.initialPosition}
                        position={position} 
                        game={game}
                    />
                </div>
                <form className="QuizEditor">
                    <legend>Enter your notes on a particular line</legend>
                    <label>
                        Line Name:
                        <input name="name" type="text" value={line.name} onChange={handleChange}/>
                    </label>
                    <label>
                        Initial Position (paste in a FEN or make moves on the board):
                        <input 
                            name="initialPosition" 
                            type="text" value={line.initialPosition} 
                            onChange={handlePositionChange}
                            onFocus={()=>setPosition(line.initialPosition)}/>
                    </label>
                </form>
            </div>
        </div>)
}