import Chessboard from "chessboardjsx";
import { Fragment, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export interface ChessPositionProps {
    name: string,
    position: string,
    linkTo?: string,
    editLink?: string
}

export default function ChessPosition({name, position, children, linkTo, editLink}: PropsWithChildren<ChessPositionProps>) {
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
    
    let editButton = editLink && 
        <Link className="EditButton" to={editLink}>
            <i className="fas fa-edit"></i>
            Edit
        </Link>;
    if (editButton && linkTo) return (
        <div className="PositionContainer">
            {editButton}
            <Link className="QuizPreview" to={linkTo}> {preview} </Link>
        </div>
        
    );
    if (linkTo) return (<Link className="QuizPreview" to={linkTo}> {preview} </Link>);

    return <div className="QuizPreview">{editButton}{preview}</div>;
}