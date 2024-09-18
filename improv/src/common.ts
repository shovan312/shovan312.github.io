import { majorScale } from "./config.js";


export function makeChords(root:number, scale:number[]) {
    const noteList:number[] = scale.map((sum => value => sum += value)(0)).map(value => (value + root) % 12);
    const chordsList:{[key:number]:number[]} = {};
    for (let i = 0; i < noteList.length; i++) {
        const currRoot:number = noteList[i];
        const currChord:number[] = [];
        for (let j = 0; j < noteList.length; j++) {
            currChord.push(noteList[(i + 2 * j) % noteList.length]);
        }
        chordsList[currRoot] = currChord;
    }
    return {noteList, chordsList};
}



const majorNotes:number[][] = [], majorChords:{[key:number]:number[]}[] = []
for(let i=0; i<12; i++) {
    const {noteList, chordsList} = makeChords(i, majorScale);
    majorNotes.push(noteList)
    majorChords.push(chordsList)
}

export {majorNotes, majorChords};



export function positiveMod(num:number, mod:number) {
    return ((num % mod) + mod) % mod
}