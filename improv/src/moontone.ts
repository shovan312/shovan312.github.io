
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
        const subDomChord = new Chord(nextNote, 4, false)
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

        chordsArray[targetIndex][0].root = positiveMod(oldRoot - 7*targetMode, 12)
        //can randomize this as well
        chordsArray[targetIndex][0].degree = positiveMod(oldDegree + 4*targetMode, 7)
        chordsArray[targetIndex][0].isDiatonic = false;
        // chordsArray[targetIndex][0].degree = oldDegree + 4*targetMode + Math.floor(Math.random()*2)
        //or find chord in newMode with original melody note

        // chordsArray[targetIndex][0].root = positiveMod(chordsArray[targetIndex][0].root, 12)
        // chordsArray[targetIndex][0].degree = positiveMod(chordsArray[targetIndex][0].degree, 7)

        const outSideNotes = getOutsideNotes(chordsArray[targetIndex][0], oldRoot)
        let outSideStr = ""
        outSideNotes.forEach(function(x) {outSideStr += chromatic_map[x] + " "})
        chordsArray[targetIndex][0].textNotes = chromatic_map[oldRoot] + " " + modeMapFifths[targetMode + 1] + " [" + outSideStr + "]"
    }
    // 2-5-1
    else if (change == 2) {
        //Make previous note second of target note
        const currNote = chordsArray[targetIndex][0]
        chordsArray[targetIndex - 1] = [new Chord(majorNotes[currNote.root][currNote.degree], 1, false)]
        //normal 2-5
        if (args == undefined || args[0] == TwoFiveArgs.TwoFive) {
            //Add a fifth dom as second note in bar
            chordsArray[targetIndex - 1].push(new Chord(majorNotes[currNote.root][currNote.degree], 4, false))
        }
        //tritone sub
        else if(args[0] == TwoFiveArgs.TritoneTwoFive) {
            //Add a minor ninth dom as second note in bar
            chordsArray[targetIndex - 1].push(new Chord(positiveMod(majorNotes[currNote.root][currNote.degree] - 6, 12), 4, false))
        }
    }
}

let tempo=50, mpb=0, songChords:Chord[][] = [], melody:any[]=[], mainGrid:HTMLElement, gridItems:HTMLCollection, songLength=0,key=0, songName="Moon";
function initSong(tmp:number=50, songName:string="Moon", key:number=0) {
    tempo = tmp
    mpb = 60*1000/tempo; //1 bar @ 100bpm

    let song = getSong(songName, key)
    songChords = song.chordsArr
    let songSections:number[] = song.rhythmSections
    melody = createMelody(songChords)

    mainGrid = document.getElementById('main-grid')!
    mainGrid.innerHTML = ""
    for(let i=0; i<songSections.length; i++) {
        mainGrid.innerHTML += `<div id="row-`+i+`" class="grid-container"></div>`
        let gridRow = document.getElementById('row-'+i)!
        gridRow.style.display = "grid"
        gridRow.style.gridTemplateColumns = "repeat("+songSections[i]+", 100px)"
        for(let j=0; j<songSections[i]; j++) {
            gridRow.innerHTML += "<div class='grid-item'></div>"
        }
    }
    gridItems = document.getElementsByClassName('grid-item') as HTMLCollectionOf<HTMLElement>
    songLength = songSections.reduce((a, c)=>{return a+c}, 0)
    
}
initSong()
let isAnimating = false, animationFrameId= 0, isPlaying = false, start = 0, paused = 0, netPaused = 0, lastPaused = 0
function animateWrapper() {
    function animate() { 
        if (!isAnimating) {
            for(let i=0; i<gridItems.length; i++) {
                (gridItems[i] as HTMLElement).style.backgroundColor = "#3498db"
            }
            (gridItems[0] as HTMLElement).style.backgroundColor = "#e74c3c";
            cancelAnimationFrame(animationFrameId)
            return
        }
        if (!isPlaying) {paused = Date.now() - lastPaused; requestAnimationFrame(animate)}
        else {
            const millis = (Date.now() - start - netPaused);
            const index = Math.floor(millis/mpb);
            const indexLength = songChords[index].length
            const subIndex = Math.floor((millis/mpb - index)*indexLength);
            
            let currRootNote = songChords[index][subIndex].root
            let currScaleDegree = songChords[index][subIndex].degree

            for(let i=0; i<gridItems.length; i++) {
                (gridItems[i] as HTMLElement).style.backgroundColor = "#3498db"
                
                let isAnyChordNotDiatonic = false;
                for(let j=0; j < songChords[i + songLength*Math.floor(index/songLength)].length; j++) {
                    if (!songChords[i + songLength*Math.floor(index/songLength)][j].isDiatonic) isAnyChordNotDiatonic = true;
                }

                isAnyChordNotDiatonic ? (gridItems[i] as HTMLElement).style.backgroundColor = "#103166" : (gridItems[i] as HTMLElement).style.backgroundColor = "#3498db";
                
                let barString = ""
                songChords[i + songLength*Math.floor(index/songLength)].forEach((chord:Chord) => barString += chord.getChordName())

                gridItems[i].innerHTML = barString
            }
            (gridItems[index % songLength] as HTMLElement).style.backgroundColor = "#e74c3c";

            document.getElementById('notes')!.innerHTML = songChords[index].toString();
            document.getElementById('notes')!.innerHTML += "</br></br>" + songChords[index+1].toString();
            animationFrameId = requestAnimationFrame(animate)
        }
    }
    animate()
}

function runAnim() {
    start = Date.now();
    animateWrapper()
}

function createMelody(songChords){
    let melody = [];
    for (let i = 0; i < songChords.length; i++) {
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

document.getElementById("play-pause-btn").addEventListener("click", () => {
    if (!isAnimating) {
        isAnimating = true;
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

document.getElementById("stop-btn").addEventListener("click", stopPlayback);
function stopPlayback() {
    isAnimating = false;
    document.getElementById("play-pause").setAttribute("class", "fas fa-play")
    Tone.Transport.stop();
    Tone.Transport.cancel()
}

document.getElementById("ddSongName").addEventListener("change", () => {
    const dropdown = document.getElementById("ddSongName") as HTMLOptionElement;
    const selectedValue = dropdown.value;
    
    stopPlayback()
    songName = selectedValue
    initSong(tempo, songName, key)
})


document.getElementById("slider").addEventListener("mouseup", () => {
    const slider = document.getElementById("slider") as HTMLOptionElement;
    const sliderValue = slider.value;
    
    stopPlayback()
    tempo = parseInt(sliderValue, 10)
    initSong(tempo, songName, key)
})

document.getElementById("ddKey").addEventListener("change", () => {
    const dropdown = document.getElementById("ddKey") as HTMLOptionElement;
    const selectedValue = dropdown.value;
    
    stopPlayback()
    key = parseInt(selectedValue, 10)
    initSong(tempo, songName, key)
})

////////

function getSong(songName:string, key:number) {
    let chordsArr = [], rhythmSections = [];
    if (songName == undefined || songName == "" || songName == "Random") {
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
                chordsArr.push([new Chord(positiveMod(form[j][0].root + key, 12), form[j][0].degree)]);
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
                chordsArr.push([new Chord(positiveMod(form[j][0].root + (key - 2), 12), form[j][0].degree)]);
            }
        }
        rhythmSections = [4, 4, 4]
    }
    
    else if (songName == "Autumn") {
        let form = songs["Autumn"]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                chordsArr.push([new Chord(positiveMod(form[j][0].root + (key + 2), 12), form[j][0].degree)]);
            }
        }
        modifyChords(chordsArr, 28, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        modifyChords(chordsArr, 27, Changes.TwoFive, [TwoFiveArgs.TritoneTwoFive])
        rhythmSections = [8, 8, 8, 8]
    }
    else if (songName == "BlueBossa") {
        let form = songs["BlueBossa"]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                let currBar = []
                for(let k=0; k<form[j].length; k++) {
                    currBar.push(new Chord(positiveMod(form[j][k].root + (key - 3), 12), form[j][k].degree));
                }
                chordsArr.push(currBar)
            }
        }
        rhythmSections = [4, 4, 4, 4]
    }
    else if (songName == "Foolish") {
        let form = songs["Foolish"]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < form.length; j++) {
                let currBar = []
                for(let k=0; k<form[j].length; k++) {
                    currBar.push(new Chord(positiveMod(form[j][k].root + (key + 2), 12), form[j][k].degree));
                }
                chordsArr.push(currBar)
            }
        }
        rhythmSections = [4, 4, 4, 4]
    }
    // console.log(chordsArr)
    return { chordsArr, rhythmSections };
}

