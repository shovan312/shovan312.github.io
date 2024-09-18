import { majorScale } from "./config.js";
export function makeChords(root, scale) {
    const noteList = scale.map((sum => value => sum += value)(0)).map(value => (value + root) % 12);
    const chordsList = {};
    for (let i = 0; i < noteList.length; i++) {
        const currRoot = noteList[i];
        const currChord = [];
        for (let j = 0; j < noteList.length; j++) {
            currChord.push(noteList[(i + 2 * j) % noteList.length]);
        }
        chordsList[currRoot] = currChord;
    }
    return { noteList, chordsList };
}
const majorNotes = [], majorChords = [];
for (let i = 0; i < 12; i++) {
    const { noteList, chordsList } = makeChords(i, majorScale);
    majorNotes.push(noteList);
    majorChords.push(chordsList);
}
export { majorNotes, majorChords };
export function positiveMod(num, mod) {
    return ((num % mod) + mod) % mod;
}
