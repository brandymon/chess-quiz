import Chessboard from "chessboardjsx";
import { MouseEventHandler, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export interface ChessPositionProps {
    name: string,
    position: string,
    href?: string
}

export default function ChessPosition({name, position, children, href}: PropsWithChildren<ChessPositionProps>) {
    let preview = 
        <div className="QuizPreview">
            <Chessboard 
                darkSquareStyle={{backgroundColor: "#929af7"}}
                lightSquareStyle={{backgroundColor: "#e9ebfd"}}
                position={position}
                width={200}
                draggable={false}
            />
            <h2>{name}</h2>
            {children}
        </div>;
    
    if (href) return (<Link to={href}> {preview} </Link>);

    return preview;
}