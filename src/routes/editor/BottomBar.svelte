<script>
	import { faPlay, faSquare } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let playing = false

    let buttonColor = "bg-white"
    
    $: {
        if (playing) {
            buttonColor = "bg-green-400"
        } else {
            buttonColor = "bg-white"
        }
    }
    function play() {
        console.log("play")
        playing = true
    }

    function pause() {
        console.log("pause")
        playing = false
    }
    
    function onKeyDown(e) {
        if (e.key === " ") {
            if (playing) {
                pause()
            } else {
                play()
            }
        }
    }

</script>

<svelte:window on:keydown|preventDefault={onKeyDown} />

<div class="absolute bottom-0 w-screen h-16 bg-yellow-500">
    <button on:click={play} class="controls dynamic-play mx-2 {buttonColor}">
        <Fa icon={faPlay}/>
    </button>
    <button on:click={pause} class="controls dynamic-pause bg-white">
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

    .dynamic-pause:hover {
        @apply bg-gray-200;
    }
    .dynamic-pause:active {
        @apply bg-red-400;
    }
</style>