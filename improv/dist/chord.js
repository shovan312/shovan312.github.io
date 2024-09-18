import { chromatic_map, modeMap } from "./config.js";
import { majorNotes, majorChords, positiveMod } from "./common.js";
import { chordNameMap } from "./config.js";
export class Chord {
    root;
    degree;
    textNotes;
    constructor(root, degree) {
        this.root = root;
        this.degree = degree;
        this.textNotes = "";
    }
    toString() {
        const currMajorNotes = majorNotes[this.root];
        const currMajorChords = majorChords[this.root];
        const rootName = chromatic_map[this.root];
        const chordName = chromatic_map[currMajorNotes[this.degree]] + this.getChordQuality(currMajorChords[currMajorNotes[this.degree]]);
        let displayStr = chordName + " (" + rootName + " : " + modeMap[this.degree] + ")";
        this.textNotes != "" ? displayStr += " [" + this.textNotes + "]" : displayStr += "";
        return displayStr;
    }
    getChordName() {
        const currMajorNotes = majorNotes[this.root];
        const currMajorChords = majorChords[this.root];
        const rootName = chromatic_map[this.root];
        const chordName = chromatic_map[currMajorNotes[this.degree]] + this.getChordQuality(currMajorChords[currMajorNotes[this.degree]]);
        let displayStr = chordName + "<br><small>" + Number(this.degree + 1) + "</small>";
        return displayStr;
    }
    getChordQuality(chord) {
        let third = positiveMod(chord[1] - chord[0], 12); //3 or 4
        let fifth = positiveMod(chord[2] - chord[0], 12); // 6 or 7 //Also accomodate for aug fifths
        let seventh = positiveMod(chord[3] - chord[0], 12); // 10 or 11
        // let ninth = (((chord[4] - chord[0]) % 12) + 12) % 12; // 1 or 2
        //assuming only minor and major counterparts
        third -= 3;
        fifth -= 6;
        seventh -= 10;
        const qualityIndex = seventh + 2 * fifth + 4 * third;
        return chordNameMap[qualityIndex];
    }
}
