import { Identifiable } from "./identifiable";
import { LineModel, viennaGambitAcceptedQuiz, viennaGambitDeclined3d6Quiz, viennaGambitDeclinedNc6Quiz, viennaGambitMainLineIntroQuiz, viennaGambitMainLineNxc3Quiz } from "./line_model";

interface OpeningsBase extends Identifiable {
    name: string,
    initialPosition: string,
}
export interface OpeningsModel extends OpeningsBase {
    lines: LineModel[],
}

export const ViennaGambitCourse: OpeningsModel = {
    name: "The Vienna Gambit",
    initialPosition: "rnbqkb1r/pppp1ppp/5n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq f3 0 3",
    lines: [viennaGambitAcceptedQuiz, viennaGambitDeclinedNc6Quiz, viennaGambitDeclined3d6Quiz, 
        viennaGambitMainLineIntroQuiz, viennaGambitMainLineNxc3Quiz]
}

export function isOpening(opening: Identifiable | null): opening is OpeningsModel {
    return opening != null && "initialPosition" in opening && "name" in opening && "lines" in opening;
}

export interface OpeningsModelIds extends OpeningsBase {
    lineIDs: string[]
}

export function isOpeningIDs(opening: Identifiable | null): opening is OpeningsModelIds {
    return opening != null && "initialPosition" in opening && "name" in opening && "lineIDs" in opening;
}

export function convertToIDs({name, initialPosition, lines}: OpeningsModel) : OpeningsModelIds {
    return { name, initialPosition, lineIDs: lines.flatMap(l => l.id ? [l.id] : []) };
}