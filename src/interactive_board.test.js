import userEvent from "@testing-library/user-event";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/cjs/react-dom-test-utils.production.min";
import '@testing-library/jest-dom';
import { getByTestId } from "@testing-library/react";
import InteractiveBoard from "./interactive_board";
let container = null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => render(<InteractiveBoard/>, container));
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("mouse over pawn on e2 highlights e3 and e4", () => {
    let square = getSquare("e2");
    expect(square).toBeTruthy();
    userEvent.hover(square);
    
    expectSquaresToBeHighlighted(["e3", "e4"])
});

it("mouse over knight on g1 highlights f3 and h3", () => {
    let square = getSquare("g1");
    expect(square).toBeTruthy();
    userEvent.hover(square);
    
    expectSquaresToBeHighlighted(["f3", "h3"])
});

it("mouse over g1 then g2", () => {
    let square = getSquare("g1");
    expect(square).toBeTruthy();
    userEvent.hover(square);
    expectSquaresToBeHighlighted(["f3", "h3"]);

    userEvent.unhover(square);
    square = getSquare("g2");
    userEvent.hover(square);
    expectSquaresToBeHighlighted(["g3", "g4"]);
});

it("mouse over f2, click, then mouse over g3", () => {
    let square = getSquare("f2");
    expect(square).toBeTruthy();
    userEvent.hover(square);
    userEvent.click(square);

    userEvent.unhover(square);
    square = getSquare("g3");
    userEvent.hover(square);

    expectSquaresToBeHighlighted(["f3", "f4"]);
});

it("click e2 then e4 to move", () => {
    let square = getSquare("e2");
    expect(square).toBeTruthy();
    userEvent.click(square);

    expectSquaresToBeHighlighted(["e3", "e4"]);


    square = getSquare("e4");
    userEvent.click(square);
    expect(container).toContainElement(getByTestId(container, "wP-e4"));

});

it("capturable piece should have a different highlight", () => {
    userEvent.click(getSquare("e2"));
    userEvent.click(getSquare("e4"));
    expect(container).toContainElement(getByTestId(container, "wP-e4"));

    userEvent.click(getSquare("d7"));
    userEvent.click(getSquare("d5"));
    expect(container).toContainElement(getByTestId(container, "bP-d5"));

    let e4square = getSquare("e4");
    userEvent.click(e4square);
    expect(getSquare("d5").children[0]).toHaveStyle({
        boxShadow: "inset 0 0 0 5px rgb(175, 160, 143)",
        borderRadius: "50%",
    });
});

function expectSquaresToBeHighlighted(squareIds) {
    for (const id of squareIds)
        expect(getSquare(id).children[0])
            .toHaveStyle({
                background:"radial-gradient(circle, rgb(175, 160, 143) 10%, transparent 30%)",
                borderRadius: "20%"
            });

    for (const id of allSquareIdsExcept(squareIds))
        expect(getSquare(id).children[0])
            .not.toHaveStyle("background: radial-gradient(circle, rgb(175, 160, 143) 10%, transparent 30%); border-radius: 20%;");
}

function allSquareIds() {
    let ids = [];
    for(const col of ["a", "b", "c", "d", "e", "f", "g", "h"])
        for (const row of [1, 2, 3, 4, 5, 6, 7, 8])
            ids.push(col + row);
    return ids;
}

function allSquareIdsExcept(squareIds) {
    return allSquareIds().filter(id => squareIds.indexOf(id) < 0)
}

function getSquare(id) {
    return container.querySelector(`[data-squareid="${id}"]`);
}