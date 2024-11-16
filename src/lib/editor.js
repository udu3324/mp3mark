import WaveSurfer from "wavesurfer.js";

let wavesurfer

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
}

export { initialize, wavesurfer }