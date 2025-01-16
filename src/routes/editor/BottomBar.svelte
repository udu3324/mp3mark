<script>
    import { currentTime, resolution } from "$lib/editor"
    import { darkMode, playSnap } from "$lib/db"
	import { faDownLeftAndUpRightToCenter, faMoon, faPlay, faSquare, faVolumeHigh, faVolumeLow, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
    import { wavesurfer } from "$lib/editor.js"
	import Fa from "svelte-fa"

    export let playing = false
    export let volume

    let playColor = "bg-white"
    let pauseColor = "bg-white"
    let centerHeadColor = "bg-white"

    let scrollX = 0
    // biome-ignore lint/style/useConst: <explanation>
    let innerWidth = 0

    $: {
        if (playing) {
            playColor = "bg-green-400 dark:bg-green-600 dark:text-green-500"
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
        console.log("returned to start of audio")

        currentTime.set(0)
        wavesurfer.setTime(0)

        window.scrollTo({
            left: 0,
            behavior: "smooth"
        })

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
        } else if (e.key === "s") {
            toggleCenterPlayhead()
        }
    }

    currentTime.subscribe((value) => {

        if (typeof getComputedStyle !== "function") {
            return
        }

        if (!wavesurfer) {
            return
        }

        if (!wavesurfer.isPlaying()) {
            return
        }

        if (!$playSnap) {
            return
        }

        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
        const threshold = (innerWidth / 2) - (rootFontSize * 7)

        const middle = (value * resolution) - threshold

        //scroll fast if too far (rootFontSize * 7)
        if (Math.abs(middle - scrollX) > (threshold)) {
            scrollX = middle
            return
        }

        //smooth scroll if its close enough and over the threshold
        if ((value * resolution) > threshold) {
            window.scrollTo({
                left: middle
            })
        }
    })
    
    playSnap.subscribe((bool) => {
        if (bool) {
            centerHeadColor = "bg-yellow-600 dark:bg-slate-900"
        } else {
            centerHeadColor = "bg-white dark:bg-slate-700"
        }
    })

    function toggleCenterPlayhead() {
        playSnap.set(!$playSnap)
    }

    function toggleDark() {
        darkMode.set(!$darkMode)
    }
</script>

<svelte:window on:keydown={onKeyDown} bind:scrollX={scrollX}/>

<div bind:clientWidth={innerWidth} class="fixed flex bottom-0 w-screen h-16 z-40 p-2 bg-yellow-500 dark:bg-slate-600 dark:text-slate-500">
    <div class="flex flex-col">
        <button on:click={toggleDark} class="controls-small bg-white dark:bg-slate-700" title="Toggle Dark Mode">
            <Fa icon={faMoon}/>
        </button>
        <button on:click={toggleCenterPlayhead} class="controls-small mt-2 {centerHeadColor}" title="(s) Center Playhead">
            <Fa icon={faDownLeftAndUpRightToCenter}/>
        </button>
    </div>
    <button on:click={play} class="controls dynamic-play mx-2 button-icon outline-none dark:bg-slate-700 {playColor}">
        <Fa icon={faPlay}/>
    </button>
    <button on:dblclick={pauseReturn} on:click={pause} class="controls dynamic-pause bg-white dark:bg-slate-700 button-icon outline-none {pauseColor}">
        <Fa icon={faSquare}/>
    </button>
    <div class="flex place-items-end ml-2 pr-2 w-full max-w-96">
        <div class="flex place-items-center bg-white dark:bg-slate-700 w-full">
            <button on:click={mute} class="w-6 px-4 py-1 button-icon">
                {#if volume > 0}
                    <Fa icon={faVolumeLow}/>
                {:else}
                    <Fa icon={faVolumeMute}/>
                {/if}
            </button>
            <input id="dont-focus" class="w-full outline-none h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600" type="range" min="0" max="1" step="0.01" bind:value={volume}>
            <button on:click={highVolume} class="w-6 px-4 py-1 button-icon"><Fa icon={faVolumeHigh}/></button>
        </div>
    </div>
</div>

<style lang="postcss">
    .controls-small {
        @apply w-5 h-5 text-sm grid place-content-center place-items-center text-center outline-none;
    }

    .controls {
        @apply min-w-12 min-h-12 place-content-center place-items-center text-center text-3xl;
    }

    .dynamic-play:active {
        @apply bg-green-200 dark:bg-green-500 dark:text-green-400;
    }

    .dynamic-pause:active {
        @apply bg-red-400 dark:bg-red-700 dark:text-red-600;
    }

    .button-icon {
        @apply grid place-items-center place-content-center;
    }
</style>