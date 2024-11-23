<script>
	import { faFileWaveform, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
	import Fa from "svelte-fa";
    
    let pollingTrack
    let trackLength = 0

    let dropdown = "hidden"

    function trackCreationMenu() {
        console.log("toggling new track menu")
        if (dropdown.includes("hidden")) {
            dropdown = ""
        } else {
            dropdown = "hidden"
        }
    }

    function updateLength() {
        trackLength = pollingTrack.offsetWidth
        console.log("please work", trackLength)
    }

    onMount(() => {
        setTimeout(() => {
            updateLength()
        }, 500)
        window.addEventListener('resize', updateLength)

        return () => {
            window.removeEventListener('resize', updateLength);
        }
    })

    export let tracks
</script>

<div class="pt-12 pb-16" style="min-width: {trackLength}px">
    <div class="flex flex-row h-28">
        <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 bg-slate-500 text-6xl place-items-center place-content-center">
            <Fa icon={faFileWaveform}/>
        </div>
        <div bind:this={pollingTrack} class="grow h-full bg-slate-300">
            <div id="editor-viewer">
                
            </div>
        </div>
    </div>

    {#each tracks as track}
        <div class="flex flex-row h-28">
            <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 bg-slate-500 text-6xl place-items-center place-content-center">
                <Fa icon={faFileWaveform}/>
            </div>
            <div class="h-full bg-slate-300" style="min-width: {trackLength}px">
                
            </div>
        </div>
    {/each}

    <div class="flex flex-row h-28 drop-shadow-lg">
        <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 bg-[#323A45] text-6xl place-items-center place-content-center">
            <button class="ml-6" on:click={trackCreationMenu}>
                <Fa icon={faPlusCircle}/>
            </button>
        </div>

        <div class="bg-[#656a70] place-items-center place-content-center" style="min-width: {trackLength}px">
            <span class="pl-4">Click the (+) to add a new analysis track.</span>
        </div>

        <div class="absolute left-28 {dropdown}">
            <div class="m-2 p-2 bg-slate-300 ">
                this is dropdown
            </div>
        </div>
    </div>
</div>