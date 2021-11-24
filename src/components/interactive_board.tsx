import React, { CSSProperties, useState } from "react";
//import PropTypes from "prop-types";

import { ChessInstance } from "chess.js";
import * as ChessJS from "chess.js";

import Chessboard from "chessboardjsx";
import * as ChessboardJSX from "chessboardjsx";
//hack - the only way I could get the test and production working
const Chess = typeof ChessJS === "function" ? ChessJS : ChessJS.Chess;

type MaybeSquare = ChessJS.Square | null;

interface BoardState {
    /**Styles for squares undergoing a drag-drop */
    dropSquareStyle: ChessboardJSX.Props["dropSquareStyle"],
    /**Styles to apply to individual squares in render, used for highlighting possible moves and selected squares */
    squareStyles: ChessboardJSX.Props["squareStyles"],
    /**The currently selected piece for click-based movement */
    pieceSquare: MaybeSquare,
    /**The series of moves made in this game (not stored in state, but passed in for some functions) */
    history?: ChessJS.Move[]
}

export interface BoardProps {
    /**The board position of the current chess game, in FEN */
    position: string,
    /**The ChessInstance used for determining legal moves and store history (passed in as a prop so parent component can manipulate) */
    game: ChessInstance,
    /**Callback used when a valid move is made */
    onValidMove: (move: ChessJS.ShortMove, position: string) => void
}

const moveHighlightColor = "#666cad";
const pieceHighlightColor = "#a0dfcb";

//exported to make writing unit tests easier
export const highlightMoveStyle = {
    backgroundImage: `radial-gradient(circle, ${moveHighlightColor} 10%, transparent 30%)`,
};

export const highlightCaptureStyle = {
    boxShadow: `inset 0 0 0 8px ${moveHighlightColor}`,
    borderRadius: "50%",
};

export const highlightSquareStyle = { backgroundColor: pieceHighlightColor };

const InteractiveBoard : React.FC<BoardProps> = (props) => {
    const [boardState, setBoardState] = useState<BoardState>({
        dropSquareStyle: {},
        squareStyles: {},
        pieceSquare: null,
    });

    const updateState = (newState: Partial<BoardState>) => setBoardState(oldState => ({...oldState, ...newState}));

    const getHistory = () => props.game.history({verbose: true});

    //given existing state, compute new state that highlights given squares and applies the base squareStyles
    const styleSquaresAndHighlight = (state: BoardState, squaresToHighlight: MaybeSquare[]) : BoardState => {
        const highlightMoves: {[id: string]: CSSProperties} = squaresToHighlight
            .map(square => ({ square, piece: square && props.game.get(square) }))
            .reduce((a, {square, piece}) => ({
                ...a,
                ...(piece && square && {
                    [square]: {
                        boxShadow: `inset 0 0 0 8px ${moveHighlightColor}`,
                        borderRadius: "50%",
                    } 
                }),
                ...(piece || (square && {
                    [square]: {
                        backgroundImage:
                        `radial-gradient(circle, ${moveHighlightColor} 10%, transparent 30%)`,
                    }
                }))
            }), {});
        const highlightSquares = getSquareStyles({...state, history: getHistory()});

        //if a square needs both a move highlight AND a square highlight, then we need those style objects together
        let mergeSquareStyles:  {[id: string]: CSSProperties} = {};
        for (var key of Object.keys(highlightSquares))
            if (highlightMoves.hasOwnProperty(key))
                mergeSquareStyles[key] = { ...highlightMoves[key], ...highlightSquares[key] };
        mergeSquareStyles = {...highlightMoves, ...highlightSquares, ...mergeSquareStyles};
        
        return {
            ...state,
            squareStyles: mergeSquareStyles
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
        updateState({dropSquareStyle: { boxShadow: `inset 0 0 1px 4px ${moveHighlightColor}`}});
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
        width={Math.min(window.innerWidth, window.innerHeight) * 0.8}
        position={props.position}
        onDrop={({sourceSquare, targetSquare}) => setBoardState(state => getStateAfterMove(state, {from: sourceSquare, to: targetSquare, promotion: "q"}) || state)}
        onMouseOverSquare={(square) => setBoardState(state => highlightMovesFromSquare(state, square))}
        onMouseOutSquare={onMouseOutSquare}
        boardStyle={{
            fontFamily: "-sans-serif"
        }}
        squareStyles={boardState.squareStyles}
        dropSquareStyle={boardState.dropSquareStyle}
        onDragOverSquare={onDragOverSquare}
        onSquareClick={onSquareClick}
        onSquareRightClick={onSquareRightClick}
        darkSquareStyle={{backgroundColor: "#929af7"}}
        lightSquareStyle={{backgroundColor: "#e9ebfd"}}
        
    />);

}

InteractiveBoard.defaultProps = {
    position: "start",
    game: new Chess()
}

export default InteractiveBoard;

const getSquareStyles = ({pieceSquare, history}: Required<BoardState>) => {
    const {from, to} = history.length ? history[history.length - 1] : { from: null, to: null };
    const highlightStyle = { backgroundColor: pieceHighlightColor };

    
    return {
        ...(pieceSquare && {[pieceSquare]: highlightStyle}),
        ...(from && { [from]: highlightStyle}),
        ...(to && { [to]: highlightStyle })
    }
}