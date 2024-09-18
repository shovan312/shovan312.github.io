const flip = (data:{[key:number]:string}) => Object.fromEntries(Object
    .entries(data)
    .map(([key, value]) => [value, key]));

export const chromatic_map:{[key:number]:string} = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
};
export const chromatic_map_reverse = flip(chromatic_map);
export const fifths_map:{[key:number]:string} = {};
for (let i = 0; i < 12; i++) {
    fifths_map[i] = chromatic_map[7 * i % 12];
}
export const majorScale = [0, 2, 2, 1, 2, 2, 2];
export const harmonicMinorScale = [0, 2, 1, 2, 2, 1, 3];
export const melodicMinorScale = [0, 2, 1, 1, 2, 2, 2];

export const intervalMap:{[key:number]:string} = {
    0: "r",
    1: "b2",
    2: "2",
    3: "b3",
    4: "3",
    5: "4",
    6: "b5",
    7: "5",
    8: "b6",
    9: "6",
    10: "b7",
    11: "7",
    12: "r",
    13: "b9",
    14: "9",
    15: "b3",
    16: "3",
    17: "11",
    18: "#11",
    19: "5",
    20: "b13",
    21: "13",
    22: "b7",
    23: "7",
};
export const qualityMap:{[key:number]:string} = {
    0: "Diminished",
    1: "Diminished Major 7",
    2: "Minor 7",
    3: "Minor Major 7",
    4: "???",
    5: "???",
    6: "Dominant",
    7: "Major 7"
};
export const chordNameMap:{[key:number]:string} = {
    0: "dim",
    1: "dimMaj7",
    2: "m7",
    3: "minMaj7",
    4: "???",
    5: "???",
    6: "7",
    7: "maj7"
};
export const modeMap:{[key:number]:string} = {
    0: "Ionian",
    1: "Dorian",
    2: "Phrygian",
    3: "Lydian",
    4: "Mixolydian",
    5: "Aeolian",
    6: "Locrian",
}
export const modeMapFifths:{[key:number]:string} = {
    1: "Ionian",
    3: "Dorian",
    5: "Phrygian",
    0: "Lydian",
    2: "Mixolydian",
    4: "Aeolian",
    6: "Locrian",
}
export const modeOrder = flip(modeMapFifths)
export const Changes = Object.freeze({ 
    Dominant: 0, 
    ModalInterchange: 1, 
    TwoFive: 2, 
}); 

export const TwoFiveArgs = Object.freeze({ 
    TwoFive: 0, 
    TritoneTwoFive: 1, 
});

export const SubDomArgs = Object.freeze({
    RemovePrevious: 0,
    KeepPrevious: 1
})




