import WaveSurfer from "wavesurfer.js"
import { writable } from 'svelte/store'

let wavesurfer

const currentTime = writable(0)

const resolution = 30

let projectName = ""

function initialize() {
    wavesurfer = WaveSurfer.create({
        container: '#editor-viewer',
        waveColor: '#eab308',
        progressColor: '#957206',
        height: '112',
        normalize: 'true',
        minPxPerSec: resolution,
        fillParent: false
    })

    wavesurfer.on('audioprocess', () => {
        currentTime.set(wavesurfer.getCurrentTime())
    })
    wavesurfer.on('click', () => {
        currentTime.set(wavesurfer.getCurrentTime())
    })

    wavesurfer.on('ready', (duration) => {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: projectName,
                artist: 'mp3mark',
                artwork: [
                    { src: 'https://raw.githubusercontent.com/udu3324/mp3mark/refs/heads/main/static/favicon.png', sizes: '128x128', type: 'image/png' }
                ]
            });
            
            navigator.mediaSession.setActionHandler('play', () => wavesurfer.play());
            navigator.mediaSession.setActionHandler('pause', () => wavesurfer.pause());
            //navigator.mediaSession.setActionHandler('seekbackward', function() {});
            //navigator.mediaSession.setActionHandler('seekforward', function() {});
            //navigator.mediaSession.setActionHandler('previoustrack', function() {});
            //navigator.mediaSession.setActionHandler('nexttrack', function() {});
        }
    })
}

function setMediaSession(title) {
    projectName = title
}

export { initialize, wavesurfer, currentTime, resolution, setMediaSession }