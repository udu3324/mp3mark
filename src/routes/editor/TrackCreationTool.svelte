<script>
	import { faDrum, faGuitar, faMicrophone, faObjectUngroup, faPlusCircle, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let tracks
    export let trackLength

    let dropdown = "hidden"

    function trackCreationMenu() {
        console.log("toggling new track menu")
        if (dropdown.includes("hidden")) {
            dropdown = ""
        } else {
            dropdown = "hidden"
        }
    }

    function createTrack(track) {
        switch (track) {
            case "vocal":
                tracks.push(["vocal", "bg-indigo-500", [], []])

                break
            case "percussion":
                tracks.push(["percussion", "bg-rose-500", [], []])

                break
            case "synth":
                tracks.push(["synth", "bg-emerald-500", [], []])

                break
            case "guitar":
                tracks.push(["guitar", "bg-cyan-600", [], []])

                break
            case "section":
                tracks.push(["section", "bg-amber-500", [], []])

                break
        }

        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks
        trackCreationMenu()
    }
</script>

<div class="flex flex-row h-28 drop-shadow-lg">
    <div class="sticky left-0 z-20 pointer-events-none {dropdown}">
        <div class="ml-[7.50rem] pt-6 m-2 mr-[-999px] flex">
            <button on:click={() => createTrack("vocal")} class="dropdown-btn bg-indigo-500"><Fa class="w-5 mr-2 text-xl" icon={faMicrophone}/> Vocals</button>
            <button on:click={() => createTrack("percussion")} class="dropdown-btn bg-rose-500"><Fa class="w-5 mr-2 text-xl" icon={faDrum}/> Percussion</button>
            <button on:click={() => createTrack("synth")} class="dropdown-btn bg-emerald-500"><Fa class="w-5 mr-2 text-xl" icon={faWaveSquare}/> Synth</button>
            <button on:click={() => createTrack("guitar")} class="dropdown-btn bg-cyan-600"><Fa class="w-5 mr-2 text-xl" icon={faGuitar}/> Guitar</button>
            <button on:click={() => createTrack("section")} class="dropdown-btn bg-amber-500"><Fa class="w-5 mr-2 text-xl" icon={faObjectUngroup}/> Section</button>
        </div>
    </div>
    
    <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl bg-[#323A45] text-6xl">
        <button class="w-full h-full text-white place-items-center place-content-center" on:click={trackCreationMenu}>
            <Fa icon={faPlusCircle}/>
        </button>
    </div>

    <div class="bg-[#656a70] place-items-center place-content-center track-outline" style="min-width: {trackLength}px">
        <span class="ml-4 text-white select-none">Click the (+) to add a new analysis track.</span>
    </div>
</div>

<style lang="postcss">
    .track-outline {
        box-shadow: 0 1px 0 #4b5563 inset;
    }

    .dropdown-btn {
        @apply p-2 text-xl text-white flex place-items-center pointer-events-auto;
    }

    .drop-icon {
        @apply w-10 mr-5 text-xl;
    }
</style>