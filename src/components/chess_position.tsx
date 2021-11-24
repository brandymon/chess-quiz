import Chessboard from "chessboardjsx";
import { Fragment, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export interface ChessPositionProps {
    name: string,
    position: string,
    href?: string
}

export default function ChessPosition({name, position, children, href}: PropsWithChildren<ChessPositionProps>) {
    let preview =
        <Fragment>
            <Chessboard 
                darkSquareStyle={{backgroundColor: "#929af7"}}
                lightSquareStyle={{backgroundColor: "#e9ebfd"}}
                position={position}
                width={200}
                draggable={false}
            />
            <h2>{name}</h2>
            {children}
        </Fragment>;
    
    if (href) return (<Link className="QuizPreview" to={href}> {preview} </Link>);

    return <span className="QuizPreview">{preview}</span>;
}