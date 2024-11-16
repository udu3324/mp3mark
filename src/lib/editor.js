import WaveSurfer from "wavesurfer.js"
import { writable } from 'svelte/store'

let wavesurfer

const currentTime = writable(0)

function initialize() {
    wavesurfer = WaveSurfer.create({
        container: '#editor-viewer',
        waveColor: '#eab308',
        progressColor: '#957206',
        height: '112',
        normalize: 'true',
        minPxPerSec: '10',
        fillParent: false
    })

    wavesurfer.on('audioprocess', () => {
        currentTime.set(wavesurfer.getCurrentTime())
    })
    wavesurfer.on('click', () => {
        currentTime.set(wavesurfer.getCurrentTime())
    })
}

export { initialize, wavesurfer, currentTime }