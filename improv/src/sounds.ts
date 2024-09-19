//@ts-ignore
import Tone from './Tone.js';

export const synth = new Tone.PolySynth(Tone.MonoSynth).toDestination();
synth.volume.value = -12
synth.set({
    envelope: {attack:1, sustain: 1, decay:10},
    oscillator: {type: "triangle"}
})
