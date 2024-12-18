<script>
    import { currentTime } from "$lib/editor"
	import { faPlay, faSquare } from "@fortawesome/free-solid-svg-icons";
    import { wavesurfer } from "$lib/editor.js"
	import Fa from "svelte-fa";

    export let playing = false

    let playColor = "bg-white"
    let pauseColor = "bg-white"

    $: {
        if (playing) {
            playColor = "bg-green-400"
        } else {
            playColor = "bg-white"
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

    function pauseReturn() {
        currentTime.set(0)
        wavesurfer.setTime(0)
        if (wavesurfer.isPlaying()) {
            wavesurfer.play()
        }
    }
    
    function onKeyDown(e) {
        if (document.activeElement.tagName === "INPUT") {
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

<svelte:window on:keydown={onKeyDown} />

<div class="fixed flex bottom-0 w-screen h-16 z-20 bg-yellow-500">
    <button on:click={play} class="controls dynamic-play mx-2 grid place-items-center place-content-center {playColor}">
        <Fa icon={faPlay}/>
    </button>
    <button on:dblclick={pauseReturn} on:click={pause} class="controls dynamic-pause bg-white grid place-items-center place-content-center {pauseColor}">
        <Fa icon={faSquare}/>
    </button>
</div>

<style lang="postcss">
    .controls {
        @apply w-12 h-12 my-2 place-content-center place-items-center text-center text-3xl;
    }

    .dynamic-play:active {
        @apply bg-green-200;
    }

    .dynamic-pause:active {
        @apply bg-red-400;
    }
</style>