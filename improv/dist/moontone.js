import { chromatic_map, majorScale, modeMapFifths, Changes, TwoFiveArgs, SubDomArgs, } from './config.js';
import { Chord } from './chord.js';
import { majorNotes, makeChords, positiveMod } from './common.js';
// let isPlaying = false;
// const synth = new Tone.Synth().toDestination();
document.getElementById("play-btn").addEventListener("click", () => {
    //   if (Tone.context.state !== "running") {
    //     Tone.start();
    runAnim();
    //     runAudio()
    //   }
});
/////////////
function getRandomChords() {
    const randomArray = [];
    let currRootNote = 0;
    for (let i = 0; i < 1000; i++) {
        if (i != 0 && i % 8 == 0) {
            //fifths sequence
            currRootNote = (currRootNote + 7) % 12;
            //totally random
            // currRootNote = Math.floor(12 * Math.random())
        }
        //totally random
        randomArray.push([new Chord(currRootNote, Math.floor(Math.random() * 7))]);
    }
    return randomArray;
}
function getOutsideNotes(newChord, root) {
    let outSideNotes = [];
    let oldScale = makeChords(root, majorScale).noteList.toSorted(function (x, y) { return x - y; });
    let newScale = makeChords(newChord.root, majorScale).noteList.toSorted(function (x, y) { return x - y; });
    for (let i = 0; i < oldScale.length; i++) {
        if (newScale[i] - oldScale[i] != 0) {
            outSideNotes.push(newScale[i]);
        }
    }
    return outSideNotes;
}
function modifyChords(chordsArray, targetIndex, change, args) {
    //Dominant of next root
    if (change == 0) {
        const nextChord = chordsArray[targetIndex + 1][0];
        const nextNote = majorNotes[nextChord.root][nextChord.degree];
        const subDomChord = new Chord(nextNote, 4);
        subDomChord.textNotes = "Dominant of " + chromatic_map[nextNote];
        if (args[0] == SubDomArgs.KeepPrevious) {
            chordsArray[targetIndex].push(subDomChord);
        }
        else if (args[0] = SubDomArgs.RemovePrevious) {
            chordsArray[targetIndex] = [subDomChord];
        }
    }
    //Modal Interchange
    else if (change == 1) {
        //-1 for Lydian and so on..
        const targetMode = args == undefined ? Math.floor(Math.random() * 7) - 1 : args[0];
        const oldRoot = chordsArray[targetIndex][0].root;
        const oldDegree = chordsArray[targetIndex][0].degree;
        chordsArray[targetIndex][0].root = oldRoot - 7 * targetMode;
        //can randomize this as well
        chordsArray[targetIndex][0].degree = oldDegree + 4 * targetMode;
        // chordsArray[targetIndex][0].degree = oldDegree + 4*targetMode + Math.floor(Math.random()*2)
        //or find chord in newMode with original melody note
        chordsArray[targetIndex][0].root = positiveMod(chordsArray[targetIndex][0].root, 12);
        chordsArray[targetIndex][0].degree = positiveMod(chordsArray[targetIndex][0].degree, 7);
        const outSideNotes = getOutsideNotes(chordsArray[targetIndex][0], oldRoot);
        let outSideStr = "";
        outSideNotes.forEach(function (x) { outSideStr += chromatic_map[x] + " "; });
        chordsArray[targetIndex][0].textNotes = chromatic_map[oldRoot] + " " + modeMapFifths[targetMode + 1] + " [" + outSideStr + "]";
    }
    // 2-5-1
    else if (change == 2) {
        //Make previous note second of target note
        const currNote = chordsArray[targetIndex][0];
        chordsArray[targetIndex - 1] = [new Chord(majorNotes[currNote.root][currNote.degree], 1)];
        //normal 2-5
        if (args == undefined || args[0] == TwoFiveArgs.TwoFive) {
            //Add a fifth dom as second note in bar
            chordsArray[targetIndex - 1].push(new Chord(majorNotes[currNote.root][currNote.degree], 4));
        }
        //tritone sub
        else if (args[0] == TwoFiveArgs.TritoneTwoFive) {
            //Add a minor ninth dom as second note in bar
            chordsArray[targetIndex - 1].push(new Chord(positiveMod(majorNotes[currNote.root][currNote.degree] - 6, 12), 4));
        }
    }
}
///////////
//millis per bar
let mpb = 480; //16 8th notes @ 100bpm
mpb *= 4;
let songChords = [];
let songSections = []; //How to add notes for doubleChords?
const song = getSong("Moon");
songChords = song.chordsArr;
songSections = song.rhythmSections;
// getSong()
// getSong("Spain")
// getSong("Autumn")
////////////
let mainGrid = document.getElementById('main-grid');
for (let i = 0; i < songSections.length; i++) {
    mainGrid.innerHTML += `<div id="row-` + i + `" class="grid-container"></div>`;
    let gridRow = document.getElementById('row-' + i);
    gridRow.style.display = "grid";
    gridRow.style.gridTemplateColumns = "repeat(" + songSections[i] + ", 100px)";
    for (let j = 0; j < songSections[i]; j++) {
        gridRow.innerHTML += "<div class='grid-item'></div>";
    }
}
let gridItems = document.getElementsByClassName('grid-item');
let songLength = songSections.reduce((a, c) => { return a + c; }, 0);
function animate() {
    const millis = (Date.now() - start);
    const index = Math.floor(millis / mpb);
    const indexLength = songChords[index].length;
    const subIndex = Math.floor((millis / mpb - index) * indexLength);
    let currRootNote = songChords[index][subIndex].root;
    let currScaleDegree = songChords[index][subIndex].degree;
    for (let i = 0; i < gridItems.length; i++) {
        gridItems[i].style.backgroundColor = "#3498db";
        // outsideChordsArr.includes(i + songLength*Math.floor(index/songLength)) ? gridItems[i].style.backgroundColor = "#103166" : gridItems[i].style.backgroundColor = "#3498db";
        // let auxChord = doubleChordsArr.find(function(x) {return x.index == i + songLength*Math.floor(index/songLength)})
        // let auxChordName = auxChord == undefined ? "" : auxChord.chord.getChordName()
        let barString = "";
        songChords[i + songLength * Math.floor(index / songLength)].forEach((chord) => barString += chord.getChordName());
        gridItems[i].innerHTML = barString;
    }
    gridItems[index % songLength].style.backgroundColor = "#e74c3c";
    document.getElementById('notes').innerHTML = songChords[index].toString();
    document.getElementById('notes').innerHTML += "</br></br>" + songChords[index + 1].toString();
    requestAnimationFrame(animate);
}
let start = 0;
function runAnim() {
    start = Date.now();
    animate();
}
// function runAudio() {
//     let melody = [
//         { note: "E5", duration: "8n", timing: 0 },
//         { note: "D#5", duration: "8n", timing: 0.25 },
//         { note: "D5", duration: "8n", timing: 0.5 }
//     ];
//     let step = mpb
//     for(let i=0; i<10; i++) {
//         melody.push({note: chordsArr[i].getChordName()[0] + "5", duration: "8n"})
//         console.log({note: chordsArr[i].getChordName()[0] + "5", duration: "16n", timing: Number(0.001*i*mpb)})
//     }
//     melody.forEach(tune => {
//       // const now = Tone.now()
//       synth.triggerAttackRelease(tune.note, tune.duration, tune.timing)
// })
// }
////////
function getSong(songName) {
    let chordsArr = [], rhythmSections = [];
    if (songName == undefined) {
        //randomize everything
        let form = getRandomChords();
        modifyChords(form, 15, Changes.Dominant, [SubDomArgs.KeepPrevious]);
        modifyChords(form, 6, Changes.ModalInterchange, [3]);
        modifyChords(form, 9, Changes.ModalInterchange, [2]);
        modifyChords(form, 19, Changes.ModalInterchange, [2]);
        rhythmSections = [4, 4, 5, 4];
        chordsArr = form;
    }
    else if (songName == "Moon") {
        let form = [
            [new Chord(0, 5)], [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)],
            [new Chord(0, 3)], [new Chord(0, 6)], [new Chord(0, 2)], [new Chord(0, 5)],
            [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)], [new Chord(0, 5)],
            [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)], [new Chord(0, 6)],
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                chordsArr.push([new Chord(form[j][0].root, form[j][0].degree)]);
            }
        }
        // let newMode = 3
        // modifyRandomChords(chordsArr, 6, Changes.Dominant);
        // modifyRandomChords(chordsArr, 9, Changes.ModalInterchange, [newMode]);
        // modifyRandomChords(chordsArr, 10, Changes.ModalInterchange, [newMode]);
        // modifyRandomChords(chordsArr, 11, Changes.ModalInterchange, [newMode]);
        // modifyRandomChords(chordsArr, 19, Changes.ModalInterchange, [modeOrder["Lydian"] - 1]);
        // modifyRandomChords(chordsArr, 22, Changes.Dominant);
        modifyChords(chordsArr, 7, Changes.Dominant, [SubDomArgs.KeepPrevious]);
        modifyChords(chordsArr, 15, Changes.Dominant, [SubDomArgs.KeepPrevious]);
        // modifyChords(chordsArr, 3, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        // modifyRandomChords(chordsArr, 2, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        rhythmSections = [4, 4, 4, 4];
    }
    else if (songName == "Spain") {
        // chordsArr = [
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        //     new Chord(2, 3),new Chord(2, 3),new Chord(11, 4),new Chord(11, 4),
        //     new Chord(2, 1),new Chord(2, 4),new Chord(2, 0),new Chord(2, 3),
        //     new Chord(6, 4),new Chord(11, 4),new Chord(2, 5),new Chord(4, 4),
        // ]
        // outsideChordsArr = [2, 3, 8, 9, 11]
        // let modalInterchangeIndex = 12*1 + 4 + Math.floor(Math.random()*4)
        // outsideChordsArr.push(modalInterchangeIndex)
        // modifyRandomChords(chordsArr, modalInterchangeIndex, Changes.ModalInterchange)
        // modalInterchangeIndex = 12*2 + 4 + Math.floor(Math.random()*4)
        // outsideChordsArr.push(modalInterchangeIndex)
        // modifyRandomChords(chordsArr, modalInterchangeIndex, Changes.ModalInterchange)
        // modalInterchangeIndex = 12*3 + 4 + Math.floor(Math.random()*4)
        // outsideChordsArr.push(modalInterchangeIndex)
        // modifyRandomChords(chordsArr, modalInterchangeIndex, Changes.ModalInterchange)
        // rhythmSections = [4, 4, 4]
    }
    else if (songName == "Autumn") {
        // chordsArr = [
        //     new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 3),
        //     new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
        //     new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
        //     new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 0),
        //     new Chord(7, 6),new Chord(4, 4),new Chord(7, 6),new Chord(7, 6),
        //     new Chord(7, 3),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
        //     new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 3),
        //     new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
        //     new Chord(7, 6),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5),
        //     new Chord(7, 1),new Chord(7, 4),new Chord(7, 0),new Chord(7, 0),
        //     new Chord(7, 6),new Chord(4, 4),new Chord(7, 6),new Chord(7, 6),
        //     new Chord(7, 3),new Chord(4, 4),new Chord(7, 5),new Chord(7, 5)
        // ]
        // modifyRandomChords(chordsArr, 20, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        // modifyRandomChords(chordsArr, 19, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        // rhythmSections = [4, 4, 4, 4, 4, 4]
    }
    // console.log(chordsArr)
    return { chordsArr, rhythmSections };
}
