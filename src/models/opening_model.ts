import { LineModel, viennaGambitAcceptedQuiz, viennaGambitDeclined3d6Quiz, viennaGambitDeclinedNc6Quiz, viennaGambitMainLineIntroQuiz, viennaGambitMainLineNxc3Quiz } from "./line_model";

export interface OpeningsModel {
    name: string,
    initialPosition: string,
    lines: LineModel[]
}

export const ViennaGambitCourse: OpeningsModel = {
    name: "The Vienna Gambit",
    initialPosition: "rnbqkb1r/pppp1ppp/5n2/4p3/4PP2/2N5/PPPP2PP/R1BQKBNR b KQkq f3 0 3",
    lines: [viennaGambitAcceptedQuiz, viennaGambitDeclinedNc6Quiz, viennaGambitDeclined3d6Quiz, 
        viennaGambitMainLineIntroQuiz, viennaGambitMainLineNxc3Quiz]
}