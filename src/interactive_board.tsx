import React, { useState } from "react";
//import PropTypes from "prop-types";


import { ChessInstance } from "chess.js";
import * as ChessJS from "chess.js";

import Chessboard from "chessboardjsx";
import * as ChessboardJSX from "chessboardjsx";
//hack - the only way I could get the test and production working
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

type MaybeSquare = ChessJS.Square | null;

interface BoardState {
    //position: string,
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
        //position: props.position,
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

    //given existing state, compute new state that highlights given squares and applies the base squareStyles
    const styleSquaresAndHighlight = (state: BoardState, squaresToHighlight: MaybeSquare[]) : BoardState => {
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
        
        return {
            ...state,
            squareStyles: {
                ...getSquareStyles({...state, history: getHistory()}),
                ...highlightStyles
            }
        }
    };

    const highlightMovesFromSquare = (state: BoardState, square?: ChessJS.Square) => {
        //get possible moves, highlight squares
        let movesFromSquare = props.game.moves({square: square, verbose: true});

        const moves = (square && movesFromSquare.length && movesFromSquare)
            || (state.pieceSquare && props.game.moves({square: state.pieceSquare, verbose: true}))
            || [];

        return styleSquaresAndHighlight(state, moves.map(m => m.to))
    };

    const removeHighlightedSquare = () => setBoardState(state => highlightMovesFromSquare(state));

    const onMouseOutSquare =  (_square: any) => removeHighlightedSquare();

    //return a new state with the given move made (if legal), or null if the move is illegal
    const getStateAfterMove = (state: BoardState, move: ChessJS.ShortMove) => {

        if (props.game.move(move))
        {
            if (props.onValidMove)
                props.onValidMove(move, props.game.fen());
            
            return {
                ...state,
                //position: props.game.fen(),
                squareStyles: getSquareStyles({...boardState, history: getHistory()}),
                pieceSquare: null
            };
        }
        
        return null;
        
    };
    
    const onDragOverSquare = () => {
        updateState({dropSquareStyle: { boxShadow: "inset 0 0 1px 4px rgb(175, 160, 143)"}});
    };
    
    const onSquareClick = (square: ChessJS.Square) =>
        setBoardState(state => 
            (state.pieceSquare && getStateAfterMove(state, {from: state.pieceSquare, to: square, promotion: "q"}))
            || { ...highlightMovesFromSquare(state, square), pieceSquare: props.game.get(square) && square }
        );

    const onSquareRightClick = () => {
        //TODO
    };

    
    return (<Chessboard
        position={props.position}
        onDrop={({sourceSquare, targetSquare}) => setBoardState(state => getStateAfterMove(state, {from: sourceSquare, to: targetSquare, promotion: "q"}) || state)}
        onMouseOverSquare={(square) => setBoardState(state => highlightMovesFromSquare(state, square))}
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