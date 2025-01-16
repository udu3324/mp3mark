<script>
    import { analysisEnterAction } from "$lib/db.js"
	import { faFlag, faMarker, faXmark } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let tracks
    export let note = ""
    export let trackMenuHidden = "hidden"

    let menuLeftPX = 0
    let menuTopPX = 0

    let noteInput

    //track mouse position 
    let mouseX
    let mouseY

	function handleMousemove(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
        //console.log("m", mouseX, mouseY)
	}

    export function showContext(trackIndex, i) {
        //console.log("showing mark menu for track", trackIndex, i)
        //console.log("mouseX", mouseX)
        //console.log("mouseY", mouseY)
        trackMenuHidden = ""
        menuLeftPX = mouseX
        menuTopPX = mouseY

        selectedTrackIndex = trackIndex
        selectedBeatIndex = i

        // timeout to allow the element to load bruh
        setTimeout(() => {
            noteInput.focus()
            noteInput.select()
        }, 15)
    }

    export function closeContext() {
        trackMenuHidden = "hidden"
        menuLeftPX = 0
        menuTopPX = 0

        selectedTrackIndex = ""
        selectedBeatIndex = -1
    }

    let selectedTrackIndex
    let selectedBeatIndex

    function createFlag() {
        console.log("creating flag for track", selectedTrackIndex, selectedBeatIndex, `"${note}"`)

        //add new flag array if track data was old
        if (tracks[selectedTrackIndex][3] === undefined) {
            tracks[selectedTrackIndex].push([])
        }

        note = note.trim()
        //note = note.replaceAll(" ", "_")

        //start, note
        const flag = [selectedBeatIndex, note]
        tracks[selectedTrackIndex][3].push(flag)

        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks

        closeContext()
    }

    function createMark() {
        console.log("creating mark for track", selectedTrackIndex, selectedBeatIndex, `"${note}"`)

        //start, size, note
        const mark = [selectedBeatIndex, 5, note]
        tracks[selectedTrackIndex][2].push(mark)

        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks

        closeContext()
    }

    function onKeyDown(e) {
        if (e.keyCode === 13) {
            if ($analysisEnterAction === "flag") {
                createFlag()
            } else {
                createMark()
            }
        }
    }
</script>

<svelte:window on:mousemove={handleMousemove}/>

<div style="--menu-left: {menuLeftPX}px; --menu-top: {menuTopPX}px;" class="track-menu {trackMenuHidden}">
    <div class="flex flex-row mb-1">
        <button on:click={closeContext} class="button-icon text-3xl mr-1"><Fa icon={faXmark}/></button>
        <button on:click={createFlag} class="button-icon text-2xl mr-1"><Fa icon={faFlag}/></button>
        <button on:click={createMark} class="button-icon text-2xl mr-1"><Fa icon={faMarker}/></button>
    </div>

    <input bind:this={noteInput} bind:value={note} on:keydown={onKeyDown} type="text" maxlength="20" placeholder="set note" class="bg-white bg-opacity-90 outline-none p-3 rounded-b-lg rounded-tr-lg">
</div>

<style lang="postcss">
    .button-icon {
        @apply grid place-items-center place-content-center w-12 h-12 text-white bg-black bg-opacity-50 rounded-b-lg rounded-tr-lg;
    }

    .track-menu {
        @apply p-1 bg-black bg-opacity-30 backdrop-blur-sm fixed z-30 rounded-b-lg rounded-tr-lg;
        left: var(--menu-left);
        top: var(--menu-top);
    }
</style>