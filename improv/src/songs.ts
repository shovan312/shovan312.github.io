import { Chord } from "./chord.js";

export const songs:{[key:string]:Chord[][]} = {
    "Moon" : [
        [new Chord(0, 5)], [new Chord(0, 1)], [new Chord(0, 4)], [new Chord(0, 0)],
        [new Chord(0, 3)], [new Chord(0, 6)], [new Chord(0, 2)], [new Chord(0, 5)],
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
    "BlueBossa" : []
};