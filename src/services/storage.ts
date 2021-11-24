import { Identifiable } from "../models/identifiable";
import { isLine } from "../models/line_model";
import { convertToIDs, isOpening, isOpeningIDs, OpeningsModel } from "../models/opening_model";
import { RepertoireModel, ViennaOnlyRepetoire } from "../models/repertoire_model";
import getUniqueId from "./unique_id";

export function storeObject(storableObject: Identifiable) {
    if (!storableObject.id) storableObject.id = getUniqueId();
    localStorage.setItem(storableObject.id, JSON.stringify(storableObject));
}

export function retrieveObject(id: string) : Identifiable | null {
    let json = localStorage.getItem(id);
    if (json) return JSON.parse(json);
    return null;
}

export function getOpening(id: string) : OpeningsModel | null {
    const openingModelIds = retrieveObject(id);

    if (!isOpeningIDs(openingModelIds)) return null;

    return {
        ...openingModelIds,
        lines: openingModelIds.lineIDs.map(id => retrieveObject(id)).filter(isLine)
    }
}

export function storeOpening(opening: OpeningsModel) {
    for (let l of opening.lines) storeObject(l);
    let ids = convertToIDs(opening);
    storeObject(ids);
    opening.id = ids.id;
}

export function getRepertoire() : RepertoireModel {
    const openingIdsJson = localStorage.getItem("repertoire");
    
    if (openingIdsJson) {
        const openingIds: [string] = JSON.parse(openingIdsJson);
        return {
            openings: openingIds.map(getOpening).filter(isOpening)
        }
    } 
    let repertoire = ViennaOnlyRepetoire;
    for (let opening of repertoire.openings)
        storeOpening(opening);
    
    localStorage.setItem("repertoire", JSON.stringify(repertoire.openings.map(o => o.id)));
    return repertoire;
}