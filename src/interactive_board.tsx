import React, { useState } from "react";
//import PropTypes from "prop-types";


import { ChessInstance } from "chess.js";
import * as ChessJS from "chess.js";

import Chessboard from "chessboardjsx";
import * as ChessboardJSX from "chessboardjsx";

const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

type MaybeSquare = ChessJS.Square | null;

interface BoardState {
    position: string,
    dropSquareStyle: ChessboardJSX.Props["dropSquareStyle"],
    squareStyles: ChessboardJSX.Props["squareStyles"],
    pieceSquare: MaybeSquare,
    square: MaybeSquare,
    history?: ChessJS.Move[]
}

export interface BoardProps {
    position: string,
    game: ChessInstance,
    onValidMove: (move: ChessJS.ShortMove, position: string) => void
}

export default function InteractiveBoard(props: BoardProps) {
    const [boardState, setBoardState] = useState<BoardState>({
        position: props.position,
        //style for active drop square
        dropSquareStyle: {},
        //custom square styles
        squareStyles: {},
        //square with clicked piece
        pieceSquare: null,
        //currently clicked square
        square: null,
    });

    const updateState = (newState: Partial<BoardState>) => setBoardState(oldState => ({...oldState, ...newState}));

    const getHistory = () => props.game.history({verbose: true});


    const highlightSquare = (squaresToHighlight: MaybeSquare[]) => {
        const highlightStyles = squaresToHighlight
            .map(square => ({ square, piece: square && props.game.get(square) }))
            .reduce((a, {square, piece}) => ({
                ...a,
                ...(piece && square && {
                    [square]: {
                        boxShadow: "inset 0 0 0 5px rgb(175, 160, 143)",
                        borderRadius: "50%",
                    } 
                }),
                ...(piece || (square && {
                    [square]: {
                        background:
                        "radial-gradient(circle, rgb(175, 160, 143) 10%, transparent 30%)",
                        borderRadius: "20%"
                    }
                }))
            }), {});
            
        setBoardState(state => ({...state, squareStyles: {
            ...getSquareStyles({...boardState, history: getHistory()}),
            ...highlightStyles,
        }}));
    };

    const highlightMovesFromSquare = (square: MaybeSquare) => {
        //get possible moves, highlight squares
        const moves = (square && props.game.moves({square: square, verbose: true}))
            || (boardState.pieceSquare && props.game.moves({square: boardState.pieceSquare, verbose: true}));

        if (moves && moves.length)
            highlightSquare(moves.map(m => m.to))
        else if (!boardState.pieceSquare)
            highlightSquare([]);
    };

    const removeHighlightedSquare = () => highlightMovesFromSquare(null);

    const onMouseOutSquare =  (_square: any) => removeHighlightedSquare();

    //make the move, return true if move is legal, false otherwise
    const makeMove = ({sourceSquare, targetSquare}: {sourceSquare: ChessJS.Square, targetSquare: ChessJS.Square}) => {
        const move = props.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" //always promote to queen for simplicity
        });

        if (move !== null)
        {
            updateState({
                position: props.position,
                squareStyles: getSquareStyles({...boardState, history: getHistory()}),
                pieceSquare: null
            });

            if (props.onValidMove)
                props.onValidMove(move, props.game.fen());
            
            return true;
        }
        
        return false;
        
    };

    const onDragOverSquare = () => {
        updateState({dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgb(175, 160, 143)"}});
    };

    const onSquareClick = (square: ChessJS.Square) => {

        if (boardState.pieceSquare && makeMove({sourceSquare: boardState.pieceSquare, targetSquare: square}))
            return;
        
        updateState({ pieceSquare: props.game.get(square) && square });
        highlightMovesFromSquare(null);
    };

    const onSquareRightClick = () => {
        //TODO
    };

    
    return (<Chessboard
        id="humanVsHuman"
        position={props.position}
        onDrop={makeMove}
        onMouseOverSquare={highlightMovesFromSquare}
        onMouseOutSquare={onMouseOutSquare}
        boardStyle={{
            borderRadius: "5px",
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
        }}
        squareStyles={boardState.squareStyles}
        dropSquareStyle={boardState.dropSquareStyle}
        onDragOverSquare={onDragOverSquare}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
    />);

}

InteractiveBoard.defaultProps = {
    position: "start",
    game: new Chess()
}


const getSquareStyles = ({pieceSquare, history}: Required<BoardState>) : ChessboardJSX.Props["squareStyles"] => {
    const {from, to} = history.length ? history[history.length - 1] : { from: null, to: null };
    const highlightColor = "rgba(255, 255, 0, 0.4)";
    const highlightStyle = { backgroundColor: highlightColor };

    
    return {
        ...(pieceSquare && {[pieceSquare]: highlightStyle}),
        ...(from && { [from]: highlightStyle}),
        ...(to && { [to]: highlightStyle })
    }
}