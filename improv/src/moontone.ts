
import {chromatic_map, chromatic_map_reverse, fifths_map, intervalMap, majorScale, qualityMap, chordNameMap, modeMap, modeMapFifths, modeOrder, Changes, TwoFiveArgs, SubDomArgs, } from './config.js'
import {Chord} from './chord.js'
import { majorChords, majorNotes, makeChords, positiveMod } from './common.js'
//@ts-ignore
import Tone from './Tone.js'
import { songs } from './songs.js';
import { synth } from './sounds.js';

/////////////

function getRandomChords() {
    const randomArray:Chord[][] = [];
    let currRootNote = 0;
    for(let i=0; i<1000; i++) {
        if (i != 0 && i % 8 == 0) {
            //fifths sequence
            currRootNote = (currRootNote + 7) % 12 

            //totally random
            // currRootNote = Math.floor(12 * Math.random())
        }

        //totally random
        randomArray.push([new Chord(currRootNote, Math.floor(Math.random()*7))])
    }
    return randomArray
}

function getOutsideNotes(newChord:Chord, root:number):number[] {
    let outSideNotes = []
    let oldScale = makeChords(root, majorScale).noteList.toSorted(function(x, y) {return x-y});
    let newScale = makeChords(newChord.root, majorScale).noteList.toSorted(function(x, y) {return x-y});

    for(let i=0; i<oldScale.length; i++) {
        if (newScale[i] - oldScale[i] != 0) {
            outSideNotes.push(newScale[i])
        }
    }
    return outSideNotes;
}

function modifyChords(chordsArray:Chord[][], targetIndex:number, change:number, args:any[]) {
    //Dominant of next root
    if (change == 0) {
        const nextChord = chordsArray[targetIndex+1][0]
        const nextNote = majorNotes[nextChord.root][nextChord.degree]
        const subDomChord = new Chord(nextNote, 4)
        subDomChord.textNotes = "Dominant of " + chromatic_map[nextNote]

        if(args[0] == SubDomArgs.KeepPrevious) {
            chordsArray[targetIndex].push(subDomChord)
        }
        else if (args[0] = SubDomArgs.RemovePrevious) {
            chordsArray[targetIndex] = [subDomChord]
        }
    }
    //Modal Interchange
    else if (change == 1) {
        //-1 for Lydian and so on..
        const targetMode = args == undefined ? Math.floor(Math.random()*7) - 1 : args[0]
        const oldRoot = chordsArray[targetIndex][0].root
        const oldDegree = chordsArray[targetIndex][0].degree

        chordsArray[targetIndex][0].root = oldRoot - 7*targetMode
        //can randomize this as well
        chordsArray[targetIndex][0].degree = oldDegree + 4*targetMode
        // chordsArray[targetIndex][0].degree = oldDegree + 4*targetMode + Math.floor(Math.random()*2)
        //or find chord in newMode with original melody note

        chordsArray[targetIndex][0].root = positiveMod(chordsArray[targetIndex][0].root, 12)
        chordsArray[targetIndex][0].degree = positiveMod(chordsArray[targetIndex][0].degree, 7)

        const outSideNotes = getOutsideNotes(chordsArray[targetIndex][0], oldRoot)
        let outSideStr = ""
        outSideNotes.forEach(function(x) {outSideStr += chromatic_map[x] + " "})
        chordsArray[targetIndex][0].textNotes = chromatic_map[oldRoot] + " " + modeMapFifths[targetMode + 1] + " [" + outSideStr + "]"
    }
    // 2-5-1
    else if (change == 2) {
        //Make previous note second of target note
        const currNote = chordsArray[targetIndex][0]
        chordsArray[targetIndex - 1] = [new Chord(majorNotes[currNote.root][currNote.degree], 1)]
        //normal 2-5
        if (args == undefined || args[0] == TwoFiveArgs.TwoFive) {
            //Add a fifth dom as second note in bar
            chordsArray[targetIndex - 1].push(new Chord(majorNotes[currNote.root][currNote.degree], 4))
        }
        //tritone sub
        else if(args[0] == TwoFiveArgs.TritoneTwoFive) {
            //Add a minor ninth dom as second note in bar
            chordsArray[targetIndex - 1].push(new Chord(positiveMod(majorNotes[currNote.root][currNote.degree] - 6, 12), 4))
        }
    }
}



///////////
//millis per bar
let tempo = 50
let mpb = 60*1000/tempo; //1 bar @ 100bpm
// mpb *= 4;

let songChords:Chord[][] = []; let songSections:number[] = []; //How to add notes for doubleChords?

const song = getSong("Moon")
songChords = song.chordsArr
songSections = song.rhythmSections
const melody = createMelody(songChords)
// getSong()
// getSong("Spain")
// getSong("Autumn")


////////////

let mainGrid = document.getElementById('main-grid')!

for(let i=0; i<songSections.length; i++) {
    mainGrid.innerHTML += `<div id="row-`+i+`" class="grid-container"></div>`
    let gridRow = document.getElementById('row-'+i)!
    gridRow.style.display = "grid"
    gridRow.style.gridTemplateColumns = "repeat("+songSections[i]+", 100px)"
    for(let j=0; j<songSections[i]; j++) {
        gridRow.innerHTML += "<div class='grid-item'></div>"
    }
}

let gridItems = document.getElementsByClassName('grid-item') as HTMLCollectionOf<HTMLElement>
let songLength = songSections.reduce((a, c)=>{return a+c}, 0)
let hasStarted = false, isPlaying = false, start = 0, paused = 0, netPaused = 0, lastPaused = 0
function animate() {
    if (!isPlaying) {paused = Date.now() - lastPaused; requestAnimationFrame(animate)}
    else {
        const millis = (Date.now() - start - netPaused);
        const index = Math.floor(millis/mpb);
        const indexLength = songChords[index].length
        const subIndex = Math.floor((millis/mpb - index)*indexLength);
        
        let currRootNote = songChords[index][subIndex].root
        let currScaleDegree = songChords[index][subIndex].degree

        for(let i=0; i<gridItems.length; i++) {
            gridItems[i].style.backgroundColor = "#3498db"
            // outsideChordsArr.includes(i + songLength*Math.floor(index/songLength)) ? gridItems[i].style.backgroundColor = "#103166" : gridItems[i].style.backgroundColor = "#3498db";
            
            let barString = ""
            songChords[i + songLength*Math.floor(index/songLength)].forEach((chord:Chord) => barString += chord.getChordName())

            gridItems[i].innerHTML = barString
        }
        gridItems[index % songLength].style.backgroundColor = "#e74c3c";

        document.getElementById('notes')!.innerHTML = songChords[index].toString();
        document.getElementById('notes')!.innerHTML += "</br></br>" + songChords[index+1].toString();
        requestAnimationFrame(animate)
    }
}

function runAnim() {
    start = Date.now();
    isPlaying = true;
    animate()
}

function createMelody(songChords){
    let melody = [];
    for (let i = 0; i < 16; i++) {
        let currBar = songChords[i];
        if (currBar.length == 1) {
            let currChord = songChords[i][0];
            let chordNotes = majorNotes[currChord.root][currChord.degree]
            let first4Notes:any[] = majorChords[currChord.root][chordNotes].slice(0, 4)
            first4Notes = first4Notes.map(x => chromatic_map[x])
    
            melody.push({ time: "0:" + i + "", note: first4Notes[0]+'4', duration: '4n' });
            melody.push({ time: "0:" + i + "", note: first4Notes[2] + '4', duration: '4n' });
            melody.push({ time: "0:" + i + "", note: first4Notes[1] + '4', duration: '4n' });
            melody.push({ time: "0:" + i + "", note: first4Notes[3] + '4', duration: '4n' });
        }
        else {
            for(let j=0; j<currBar.length; j++) {
                let currChord = songChords[i][j];
                let chordNotes = majorNotes[currChord.root][currChord.degree]
                let first4Notes:any[] = majorChords[currChord.root][chordNotes].slice(0, 4)
                first4Notes = first4Notes.map(x => chromatic_map[x])
        
                melody.push({ time: "0:" + i + ":" + Math.floor(j/currBar.length*4) + "", note: first4Notes[0] + '4', duration: 4*currBar.length + 'n' });
                melody.push({ time: "0:" + i + ":" + Math.floor(j/currBar.length*4) + "", note: first4Notes[2] + '4', duration: 4*currBar.length + 'n' });
                melody.push({ time: "0:" + i + ":" + Math.floor(j/currBar.length*4) + "", note: first4Notes[1] + '4', duration: 4*currBar.length + 'n' });
                melody.push({ time: "0:" + i + ":" + Math.floor(j/currBar.length*4) + "", note: first4Notes[3] + '4', duration: 4*currBar.length + 'n' });
            }
        }
    }
    return melody
}

function runAudio(melody, synth) {
    Tone.Transport.bpm.value = tempo;
    Tone.Transport.loop = false

    const part = new Tone.Part((time, event) => {
        synth.triggerAttackRelease(event.note, event.duration, time)
    }, melody);

    part.loop = 2
    part.loopEnd = '10m'
    part.start()

    Tone.Transport.start();
}

function pauseAudio() {
    Tone.Transport.pause();
}

function pauseAnim() {
    lastPaused = Date.now()
}

// document.getElementById("play-pause-btn")!.addEventListener("click", () => {
//     if (Tone.context.state !== "running") {
//         Tone.start();
//         runAnim()
//         runAudio(melody, synth)

//         document.getElementById("play-pause")
//     }
// })

document.getElementById("play-pause-btn").addEventListener("click", () => {
    if (!hasStarted) {
        hasStarted = true;
        isPlaying = true;
        Tone.start();
        runAnim()
        runAudio(melody, synth)
        document.getElementById("play-pause").setAttribute("class", "fas fa-pause")
        return;
    }
    if (isPlaying) {
        document.getElementById("play-pause").setAttribute("class", "fas fa-play")
        isPlaying = false;
        
        pauseAudio();
        pauseAnim();
    }
    else {
        document.getElementById("play-pause").setAttribute("class", "fas fa-pause")
        isPlaying = true;
        netPaused += paused;
        Tone.Transport.start();
    }
})

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
        let form = songs["Moon"];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                chordsArr.push([new Chord(form[j][0].root, form[j][0].degree)]);
            }
        }
        let newMode = 3;
        // modifyChords(chordsArr, 9, Changes.ModalInterchange, [newMode]);
        // modifyChords(chordsArr, 10, Changes.ModalInterchange, [newMode]);
        // modifyChords(chordsArr, 11, Changes.ModalInterchange, [newMode]);

        modifyChords(chordsArr, 7, Changes.Dominant, [SubDomArgs.KeepPrevious]);
        modifyChords(chordsArr, 15, Changes.Dominant, [SubDomArgs.KeepPrevious]);

        // modifyChords(chordsArr, 3, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        // modifyChords(chordsArr, 2, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        rhythmSections = [4, 4, 4, 4];
    }
    else if (songName == "Spain") {
        let form = songs["Spain"]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                chordsArr.push([new Chord(form[j][0].root, form[j][0].degree)]);
            }
        }
        rhythmSections = [4, 4, 4]
    }
    
    else if (songName == "Autumn") {
        let form = songs["Autumn"]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                chordsArr.push([new Chord(form[j][0].root, form[j][0].degree)]);
            }
        }
        modifyChords(chordsArr, 28, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        modifyChords(chordsArr, 27, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        rhythmSections = [4, 4, 4, 4]
    }
    // console.log(chordsArr)
    return { chordsArr, rhythmSections };
}

