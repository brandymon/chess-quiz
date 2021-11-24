import { v4 as uuidv4 } from "uuid";

export default function getUniqueId() : string {
    const keys = Object.keys(localStorage);
    let id = uuidv4();
    while(keys.includes(id)) id = uuidv4();
    return id;
}