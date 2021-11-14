import { OpeningsModel, ViennaGambitCourse } from "./opening_model";

/** A Repertoire is a series of different openings */
export interface RepertoireModel {
    openings: OpeningsModel[],
}

export const ViennaOnlyRepetoire : RepertoireModel = {
    openings: [ViennaGambitCourse]
}