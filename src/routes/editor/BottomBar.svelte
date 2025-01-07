<script>
    import { currentTime } from "$lib/editor"
	import { faPlay, faSquare, faVolumeHigh, faVolumeLow, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
    import { wavesurfer } from "$lib/editor.js"
	import Fa from "svelte-fa";
    
    export let playing = false
    export let volume

    let playColor = "bg-white"
    let pauseColor = "bg-white"

    let scrollX = 0
    let scrollY = 0
    let innerWidth = 0

    $: {
        if (playing) {
            playColor = "bg-green-400"
        } else {
            playColor = "bg-white"
        }
    }

    $: {
        if (wavesurfer && volume) {
            //console.log("set volume to", volume)
            wavesurfer.setVolume(volume)
        }
    }

    function play() {
        playing = true

        wavesurfer.play()
    }

    function pause() {
        playing = false

        wavesurfer.pause()
    }

    let storedVolume = 0
    function mute() {
        if (volume !== 0) {
            storedVolume = volume
            volume = 0
            wavesurfer.setVolume(volume)
        } else {
            volume = storedVolume
            wavesurfer.setVolume(storedVolume)
        }
    }

    function highVolume() {
        if (volume !== 1) {
            storedVolume = volume
            volume = 1
            wavesurfer.setVolume(volume)
        } else {
            volume = storedVolume
            wavesurfer.setVolume(storedVolume)
        }
    }

    function pauseReturn() {
        currentTime.set(0)
        wavesurfer.setTime(0)
        if (wavesurfer.isPlaying()) {
            wavesurfer.play()
        }
    }
    
    function onKeyDown(e) {
        if (document.activeElement.tagName === "INPUT" && document.activeElement.id !== "dont-focus") {
            return
        }

        if (e.key === " ") {
            e.preventDefault()

            if (playing) {
                pause()

                setTimeout(() => {
                    pauseColor = "bg-red-400"
                    setTimeout(() => {
                        pauseColor = "bg-white"
                    }, 100)
                }, 100)

            } else {
                play()
            }
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} bind:scrollX={scrollX} bind:scrollY={scrollY}/>

<div bind:clientWidth={innerWidth} class="fixed flex bottom-0 w-screen h-16 z-40 bg-yellow-500">
    <button on:click={play} class="controls dynamic-play mx-2 button-icon outline-none {playColor}">
        <Fa icon={faPlay}/>
    </button>
    <button on:dblclick={pauseReturn} on:click={pause} class="controls dynamic-pause bg-white button-icon outline-none {pauseColor}">
        <Fa icon={faSquare}/>
    </button>
    <div class="flex place-items-end ml-2 pb-2 pr-2 w-full max-w-96">
        <div class="flex bg-white w-full">
            <button on:click={mute} class="w-6 px-4 py-1 button-icon">
                {#if volume > 0}
                    <Fa icon={faVolumeLow}/>
                {:else}
                    <Fa icon={faVolumeMute}/>
                {/if}
            </button>
            <input id="dont-focus" class="w-full outline-none" type="range" min="0" max="1" step="0.01" bind:value={volume}>
            <button on:click={highVolume} class="w-6 px-4 py-1 button-icon"><Fa icon={faVolumeHigh}/></button>
        </div>
    </div>
</div>

<style lang="postcss">
    .controls {
        @apply min-w-12 min-h-12 my-2 place-content-center place-items-center text-center text-3xl;
    }

    .dynamic-play:active {
        @apply bg-green-200;
    }

    .dynamic-pause:active {
        @apply bg-red-400;
    }

    .button-icon {
        @apply grid place-items-center place-content-center;
    }
</style>