import { OpeningsModel, ViennaGambitCourse } from "./opening_model";

/** A Repertoire is a series of different openings */
export interface RepertoireModel {
    openings: OpeningsModel[],
}

export function isRepertoireModel(rep: any) : rep is RepertoireModel {
    return rep != null && "openingIDs" in rep;
}

export const ViennaOnlyRepetoire : RepertoireModel = {
    openings: [ViennaGambitCourse]
}

export interface RepertoireModelIDs {
    openingIDs: string[]
}

export function isRepertoireIDs(rep: any) : rep is RepertoireModelIDs {
    return rep != null && "openingIDs" in rep;
}