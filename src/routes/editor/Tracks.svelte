<script>
	import { faCirclePlus, faFileWaveform, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
    
    let dropdown = "hidden"

    function trackCreationMenu() {
        console.log("toggling new track menu")
        if (dropdown.includes("hidden")) {
            dropdown = ""
        } else {
            dropdown = "hidden"
        }
    }

    export let tracks
</script>

<div class="pt-12 pb-16">
    <div class="flex flex-row h-28">
        <div class="fixed z-10 h-28 w-28 basis-28 bg-slate-500 text-6xl place-items-center place-content-center">
            <Fa icon={faFileWaveform}/>
        </div>
        <div class="pl-28 grow h-full bg-slate-300">
            <div id="editor-viewer">
                
            </div>
        </div>
    </div>
    
    {#each tracks as track}
        
    {/each}

    <div class="absolute flex flex-row h-28 drop-shadow-lg">
        <button on:click={trackCreationMenu}>
            <div class="top-0 absolute h-28 w-28 bg-[#323A45] text-6xl place-items-center place-content-center">
                <Fa icon={faPlusCircle}/>
            </div>
        </button>
        <div class="grow h-full w-screen bg-[#656a70] place-content-center text-center">
            <span>Click the (+) to add a new analysis track.</span>
        </div>

        <div class="absolute left-28 {dropdown}">
            <div class="m-2 p-2 bg-slate-300 ">
                this is dropdown
            </div>
        </div>
    </div>
</div>