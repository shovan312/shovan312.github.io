import { Chord } from "./chord.js";

export const songs:{[key:string]:Chord[][]} = {
    "Moon" : [
        [new Chord(0, 5)], [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)],
        [new Chord(0, 3)], [new Chord(0, 6)], [new Chord(9, 4)], [new Chord(0, 5)],
        [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)], [new Chord(0, 5)],
        [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)], [new Chord(0, 6)]],
    "Autumn" : [
        [new Chord(10, 1)],[new Chord(10, 4)],[new Chord(10, 0)],[new Chord(10, 3)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)],
        [new Chord(10, 1)],[new Chord(10, 4)],[new Chord(10, 0)],[new Chord(10, 3)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)],
        [new Chord(10, 1)],[new Chord(10, 4)],[new Chord(10, 0)],[new Chord(10, 3)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 6)],[new Chord(10, 6)],
        [new Chord(10, 3)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)],
        [new Chord(10, 1)],[new Chord(10, 4)],[new Chord(10, 0)],[new Chord(10, 3)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)],
        [new Chord(10, 1)],[new Chord(10, 4)],[new Chord(10, 0)],[new Chord(10, 0)],
        [new Chord(10, 6)],[new Chord(7, 4)],[new Chord(10, 6)],[new Chord(10, 6)],
        [new Chord(10, 3)],[new Chord(7, 4)],[new Chord(10, 5)],[new Chord(10, 5)]
    ],
    "Spain" : [
        [new Chord(2, 3)],[new Chord(2, 3)],[new Chord(11, 4)],[new Chord(11, 4)],
        [new Chord(2, 1)],[new Chord(2, 4)],[new Chord(2, 0)],[new Chord(2, 3)],
        [new Chord(6, 4)],[new Chord(11, 4)],[new Chord(2, 5)],[new Chord(4, 4)]
    ],
    "BlueBossa" : [
        [new Chord(3, 5)], [new Chord(3, 5)], [new Chord(3, 1)], [new Chord(3, 1)],
        [new Chord(3, 6)], [new Chord(0, 4)], [new Chord(3, 5)], [new Chord(3, 5)],
        [new Chord(1, 1)], [new Chord(1, 4)], [new Chord(1, 0)], [new Chord(1, 0)],
        [new Chord(3, 6)], [new Chord(0, 4)], [new Chord(3, 5)], [new Chord(3, 6), new Chord(0, 4)],
    ],
    "Foolish" : [
        [new Chord(10, 0)], [new Chord(10, 3)], [new Chord(10, 2)], [new Chord(0, 4)], 
        [new Chord(10, 1)], [new Chord(10, 1)], [new Chord(2, 1)], [new Chord(2, 4)],
        [new Chord(10, 2)], [new Chord(7, 4)], [new Chord(10, 5)], [new Chord(10, 5)],
        [new Chord(10, 1)], [new Chord(10, 1)], [new Chord(1, 6)], [new Chord(10, 4)],
        
        [new Chord(10, 0)], [new Chord(10, 0)], [new Chord(3, 1)], [new Chord(3, 4)],
        [new Chord(3, 0)], [new Chord(3, 0)], [new Chord(10, 6)], [new Chord(7, 4)],
        [new Chord(10, 5)], [new Chord(7, 4)], [new Chord(10, 5)], [new Chord(5, 4)],
        [new Chord(3, 5)], [new Chord(0, 4)], [new Chord(3, 5)], [new Chord(10, 4)],

        [new Chord(10, 0)], [new Chord(10, 3)], [new Chord(10, 2)], [new Chord(0, 4)], 
        [new Chord(10, 1)], [new Chord(10, 1)], [new Chord(2, 1)], [new Chord(2, 4)],
        [new Chord(10, 2)], [new Chord(7, 4)], [new Chord(10, 5)], [new Chord(10, 5)],
        [new Chord(10, 1)], [new Chord(10, 1)], [new Chord(10, 6)], [new Chord(7, 4)],

        [new Chord(10, 5)], [new Chord(10, 5)], [new Chord(10, 3)], [new Chord(1, 4)],
        [new Chord(10, 0)], [new Chord(10, 3)], [new Chord(3, 6)], [new Chord(0, 4)],
        [new Chord(10, 1)], [new Chord(0, 4)], [new Chord(5, 4)], [new Chord(10, 4)],
        [new Chord(10, 0)], [new Chord(10, 5)], [new Chord(10, 1)], [new Chord(10, 4)]
    ]
};

export const songKeys:{[key:string]:string} = {
    "Moon" : "C",
    "Autumn" : "Bb",
    "Spain" : "D",
    "BlueBossa" : "Eb",
    "Foolish" : "Bb",
    "Random" : "C"
}