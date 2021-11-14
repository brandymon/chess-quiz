import Chessboard from "chessboardjsx";
import { MouseEventHandler, PropsWithChildren } from "react";

export interface ChessPositionProps {
    name: string,
    position: string,
    onClick?: MouseEventHandler<HTMLDivElement>
}

export default function ChessPosition({name, position, children, onClick}: PropsWithChildren<ChessPositionProps>) {
    return (
        <div className="QuizPreview" onClick={onClick}>
            <Chessboard 
                darkSquareStyle={{backgroundColor: "#929af7"}}
                lightSquareStyle={{backgroundColor: "#e9ebfd"}}
                position={position}
                width={200}
                draggable={false}
            />
            <h2>{name}</h2>
            {children}
        </div>
    )
    
}