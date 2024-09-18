"use strict";

let isPlaying = false;
const synth = new Tone.Synth().toDestination();
document.getElementById("play-btn").addEventListener("click", () => {
  if (Tone.context.state !== "running") {
    Tone.start();
    runAnim()
    runAudio()
  }
});

const flip = (data) => Object.fromEntries(Object
    .entries(data)
    .map(([key, value]) => [value, key]));

function positiveMod(num, mod) {
    return ((num % mod) + mod) % mod
}

/////////////

class Chord {
    constructor(root, degree) {
        this.root = root;
        this.degree = degree;
        this.textNotes = "";
    }

    toString() {
        const currMajorNotes = majorNotes[this.root];
        const currMajorChords = majorChords[this.root];
        const rootName = chromatic_map[this.root];
        const chordName = chromatic_map[currMajorNotes[this.degree]] + getChordQuality(currMajorChords[currMajorNotes[this.degree]])

        let displayStr = chordName + " (" + rootName + " : " + modeMap[this.degree] +")";
        this.textNotes != "" ? displayStr += " [" + this.textNotes + "]" : displayStr += "";
        return displayStr;
    }

    getChordName() {
        const currMajorNotes = majorNotes[this.root];
        const currMajorChords = majorChords[this.root];
        const rootName = chromatic_map[this.root];
        const chordName = chromatic_map[currMajorNotes[this.degree]] + getChordQuality(currMajorChords[currMajorNotes[this.degree]])

        let displayStr = chordName + "<br><small>" + Number(this.degree + 1) + "</small>"
        return displayStr;
    }
}
const Changes = Object.freeze({ 
    Dominant: 0, 
    ModalInterchange: 1, 
    TwoFive: 2, 
}); 

const TwoFiveArgs = Object.freeze({ 
    TwoFive: 0, 
    TritoneTwoFive: 1, 
});


/////////////

const chromatic_map = {
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
const chromatic_map_reverse = flip(chromatic_map);
const fifths_map = {};
for (let i = 0; i < 12; i++) {
    fifths_map[i] = chromatic_map[7 * i % 12];
}
const majorScale = [0, 2, 2, 1, 2, 2, 2];
const intervalMap = {
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
const qualityMap = {
    0: "Diminished",
    1: "Diminished Major 7",
    2: "Minor 7",
    3: "Minor Major 7",
    4: "???",
    5: "???",
    6: "Dominant",
    7: "Major 7"
};
const chordNameMap = {
    0: "dim",
    1: "dimMaj7",
    2: "m7",
    3: "minMaj7",
    4: "???",
    5: "???",
    6: "7",
    7: "maj7"
};
const modeMap = {
    0: "Ionian",
    1: "Dorian",
    2: "Phrygian",
    3: "Lydian",
    4: "Mixolydian",
    5: "Aeolian",
    6: "Locrian",
}
const modeMapFifths = {
    1: "Ionian",
    3: "Dorian",
    5: "Phrygian",
    0: "Lydian",
    2: "Mixolydian",
    4: "Aeolian",
    6: "Locrian",
}
const modeOrder = flip(modeMapFifths)

function makeChords(root, scale) {
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
    return [noteList, chordsList];
}
function getChordQuality(chord) {
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

function getRandomChords() {
    const randomArray = [];
    let currRootNote = 0;
    for(let i=0; i<1000; i++) {
        if (i != 0 && i % 8 == 0) {
            //fifths sequence
            // currRootNote = (currRootNote + 7) % 12 

            //totally random
            currRootNote = Math.floor(12 * Math.random())
        }

        //totally random
        randomArray.push(new Chord(currRootNote, Math.floor(Math.random()*7)))
    }
    return randomArray
}

function getOutsideNotes(newChord, root) {
    let outSideNotes = []
    let oldScale = makeChords(root, majorScale)[0].toSorted(function(x, y) {return x-y});
    let newScale = makeChords(newChord.root, majorScale)[0].toSorted(function(x, y) {return x-y});

    for(let i=0; i<oldScale.length; i++) {
        if (newScale[i] - oldScale[i] != 0) {
            outSideNotes.push(newScale[i])
        }
    }
    return outSideNotes;
}

function modifyRandomChords(randomArray, targetIndex, change, args) {
    //Dominant of next root
    if (change == 0) {
        const nextChord = randomArray[targetIndex+1]
        const nextNote = majorNotes[nextChord.root][nextChord.degree]
        randomArray[targetIndex].root = nextNote
        randomArray[targetIndex].degree = 4
        randomArray[targetIndex].textNotes = "Dominant of " + chromatic_map[nextNote]
    }
    //Modal Interchange
    else if (change == 1) {
        //-1 for Lydian and so on..
        const targetMode = args == undefined ? Math.floor(Math.random()*7) - 1 : args[0]
        const oldRoot = randomArray[targetIndex].root
        const oldDegree = randomArray[targetIndex].degree

        randomArray[targetIndex].root = oldRoot - 7*targetMode
        //can randomize this as well
        // randomArray[targetIndex].degree = oldDegree + 4*targetMode
        randomArray[targetIndex].degree = oldDegree + 4*targetMode + Math.floor(Math.random(1)*2)
        //or find chord in newMode with original melody note

        randomArray[targetIndex].root = positiveMod(randomArray[targetIndex].root, 12)
        randomArray[targetIndex].degree = positiveMod(randomArray[targetIndex].degree, 7)

        const outSideNotes = getOutsideNotes(randomArray[targetIndex], oldRoot)
        let outSideStr = ""
        outSideNotes.forEach(function(x) {outSideStr += chromatic_map[x] + " "})
        randomArray[targetIndex].textNotes = chromatic_map[oldRoot] + " " + modeMapFifths[targetMode + 1] + " [" + outSideStr + "]"
    }
    // 2-5-1
    else if (change == 2) {
        //Make previous note second of target note
        const currNote = randomArray[targetIndex]

        randomArray[targetIndex - 1].root = majorNotes[currNote.root][currNote.degree]
        randomArray[targetIndex - 1].degree = 1
        //normal 2-5
        if (args == undefined || args[0] == 0) {
            //Add a fifth dom as second note in bar
            let fifth = {index: targetIndex - 1, chord : new Chord(majorNotes[currNote.root][currNote.degree], 4)}
            doubleChordsArr.push(fifth)
        }
        //tritone sub
        else if(args[0] == 1) {
            //Add a minor ninth dom as second note in bar
            let tritone = {index: targetIndex - 1, chord : new Chord(positiveMod(majorNotes[currNote.root][currNote.degree] - 6, 12), 4)}
            doubleChordsArr.push(tritone)
        }
    }
}

const majorNotes = [], majorChords = []
for(let i=0; i<12; i++) {
    const [notes, chords] = makeChords(i, majorScale);
    majorNotes.push(notes)
    majorChords.push(chords)
}

///////////
//millis per bar
let mpb = 480; //16 8th notes @ 100bpm
mpb *= 4;

let chordsArr = []; let outsideChordsArr = []; let  doubleChordsArr = []; let rhythmSections = []; //How to add notes for doubleChords?

getSong("Moon")
// getSong()
// getSong("Spain")
// getSong("Autumn")


////////////

let mainGrid = document.getElementById('main-grid')

for(let i=0; i<rhythmSections.length; i++) {
    mainGrid.innerHTML += `<div id="row-`+i+`" class="grid-container"></div>`
    let gridRow = document.getElementById('row-'+i)
    gridRow.style.display = "grid"
    gridRow.style.gridTemplateColumns = "repeat("+rhythmSections[i]+", 100px)"
    for(let j=0; j<rhythmSections[i]; j++) {
        gridRow.innerHTML += "<div class='grid-item'></div>"
    }
}

let gridItems = document.getElementsByClassName('grid-item')
let songLength = rhythmSections.reduce((a, c)=>{return a+c}, 0)
function animate() {
    const millis = (Date.now() - start);
    const index = Math.floor(millis/mpb)
    let currRootNote = chordsArr[index].root
    let currScaleDegree = chordsArr[index].degree

    for(let i=0; i<gridItems.length; i++) {
        outsideChordsArr.includes(i + songLength*Math.floor(index/songLength)) ? gridItems[i].style.backgroundColor = "#103166" : gridItems[i].style.backgroundColor = "#3498db";
        
        let auxChord = doubleChordsArr.find(function(x) {return x.index == i + songLength*Math.floor(index/songLength)})
        let auxChordName = auxChord == undefined ? "" : auxChord.chord.getChordName()

        gridItems[i].innerHTML = chordsArr[i + songLength*Math.floor(index/songLength)].getChordName() + auxChordName
    }
    gridItems[index % songLength].style.backgroundColor = "#e74c3c";

    document.getElementById('notes').innerHTML = chordsArr[index].toString();
    document.getElementById('notes').innerHTML += "</br></br>" + chordsArr[index+1].toString();
    requestAnimationFrame(animate)
}

let start = 0;
function runAnim() {
    start = Date.now();
    animate()
}

function runAudio() {
    let melody = [
        { note: "E5", duration: "8n", timing: 0 },
        { note: "D#5", duration: "8n", timing: 0.25 },
        { note: "D5", duration: "8n", timing: 0.5 }
    ];
    let step = mpb
    for(let i=0; i<10; i++) {
        melody.push({note: chordsArr[i].getChordName()[0] + "5", duration: "8n"})
        console.log({note: chordsArr[i].getChordName()[0] + "5", duration: "16n", timing: Number(0.001*i*mpb)})
    }
    melody.forEach(tune => {
      // const now = Tone.now()
      synth.triggerAttackRelease(tune.note, tune.duration, tune.timing)
})
}


////////

function getSong(songName) {
    if (songName == undefined) {
        //randomize everything
        chordsArr = getRandomChords();
        outsideChordsArr = [15, 6, 9, 19]
        modifyRandomChords(chordsArr, 15, Changes.Dominant);
        modifyRandomChords(chordsArr, 6, Changes.ModalInterchange);
        modifyRandomChords(chordsArr, 9, Changes.ModalInterchange, [modeOrder["Mixolydian"] - 1]);
        modifyRandomChords(chordsArr, 19, Changes.ModalInterchange, [modeOrder["Dorian"] - 1]);

        for(let i=24; i<25; i++) {
            modifyRandomChords(chordsArr, i, 1, [2]);
            outsideChordsArr.push(i)
        }
        rhythmSections = [4, 4, 5, 4]
    }
    else if(songName == "Moon") {
        chordsArr = [
            new Chord(0, 5),new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),
            new Chord(0, 3),new Chord(0, 6),new Chord(0, 2),new Chord(0, 5),
            new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),new Chord(0, 5),
            new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),new Chord(0, 6),

            new Chord(0, 5),new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),
            new Chord(0, 3),new Chord(0, 6),new Chord(0, 2),new Chord(0, 5),
            new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),new Chord(0, 5),
            new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),new Chord(0, 6),
            new Chord(0, 5),new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),
            new Chord(0, 3),new Chord(0, 6),new Chord(0, 2),new Chord(0, 5),
            new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),new Chord(0, 5),
            new Chord(0, 1),new Chord(0, 4),new Chord(0, 0),new Chord(0, 6),
        ]

        outsideChordsArr = [6, 9, 10, 11, 19, 22]
        let newMode = 3
        modifyRandomChords(chordsArr, 6, Changes.Dominant);
        modifyRandomChords(chordsArr, 9, Changes.ModalInterchange, [newMode]);
        modifyRandomChords(chordsArr, 10, Changes.ModalInterchange, [newMode]);
        modifyRandomChords(chordsArr, 11, Changes.ModalInterchange, [newMode]);
        modifyRandomChords(chordsArr, 19, Changes.ModalInterchange, [modeOrder["Lydian"] - 1]);
        modifyRandomChords(chordsArr, 22, Changes.Dominant);

        let A7 = {index: 7, chord : new Chord(2, 4)}
        let E7 = {index: 15, chord : new Chord(9, 4)}
        doubleChordsArr.push(A7)
        doubleChordsArr.push(E7)

        // modifyRandomChords(chordsArr, 3, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        // modifyRandomChords(chordsArr, 2, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])

        // for(let i=24; i<32; i++) {
        //     let mode = 1
        //     i > 28 ? mode = 4 : mode = 1;
        //     modifyRandomChords(chordsArr, i, 1, [mode]);
        //     outsideChordsArr.push(i)
        // }
        rhythmSections = [4, 4, 4, 4]
    }
    else if(songName == "Spain") {
        chordsArr = [
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),

            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
            new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
            new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
            new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        ]
        outsideChordsArr = [2, 3, 8, 9, 11]

        let modalInterchangeIndex = 12*1 + 4 + Math.floor(Math.random()*4)
        outsideChordsArr.push(modalInterchangeIndex)
        modifyRandomChords(chordsArr, modalInterchangeIndex, Changes.ModalInterchange)
        modalInterchangeIndex = 12*2 + 4 + Math.floor(Math.random()*4)
        outsideChordsArr.push(modalInterchangeIndex)
        modifyRandomChords(chordsArr, modalInterchangeIndex, Changes.ModalInterchange)
        modalInterchangeIndex = 12*3 + 4 + Math.floor(Math.random()*4)
        outsideChordsArr.push(modalInterchangeIndex)
        modifyRandomChords(chordsArr, modalInterchangeIndex, Changes.ModalInterchange)

        rhythmSections = [4, 4, 4]
    }
    else if(songName == "Autumn") {
        chordsArr = [
            new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 3),
            new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
            new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
            new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 0),
            new Chord(7, 6),new Chord(4, 4),new Chord(7, 6),new Chord(7, 6),
            new Chord(7, 3),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),

            new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 3),
            new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
            new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
            new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 0),
            new Chord(7, 6),new Chord(4, 4),new Chord(7, 6),new Chord(7, 6),
            new Chord(7, 3),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5)
        ]
        modifyRandomChords(chordsArr, 20, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        modifyRandomChords(chordsArr, 19, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        rhythmSections = [4, 4, 4, 4, 4, 4]
    }
    // return [chordsArr, outsideChordsArr, doubleChordsArr]
}

