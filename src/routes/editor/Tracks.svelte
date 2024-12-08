<script>
	import { faCaretLeft, faCaretRight, faDownload, faDrum, faGuitar, faMicrophone, faObjectUngroup, faPlusCircle, faTrash, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
    import { resolution } from "$lib/editor.js"
	import Fa from "svelte-fa";
    
    export let tracks
    export let bpm
    export let length
    export let timeSigBeat

    let trackMenuHidden = "hidden"
    let hiddenLoad = ""

    let pollingTrack
    let trackLength = 0

    let dropdown = "hidden"
    let ticks = 0
    let tickOffset = 0
    let marginRightValue = 0

    function trackCreationMenu() {
        console.log("toggling new track menu")
        if (dropdown.includes("hidden")) {
            dropdown = ""
        } else {
            dropdown = "hidden"
        }
    }

    function updateLength() {
        trackLength = document.getElementById("polling_track").offsetWidth
        //trackLength = pollingTrack.offsetWidth
        console.log("track px length set to", trackLength)
        const secondsPerBeat = 60 / bpm

        ticks = length / secondsPerBeat
        tickOffset = secondsPerBeat * resolution
        marginRightValue = tickOffset

        console.log("secondsPerBeat", secondsPerBeat, "total ticks", ticks, "tickOffset", tickOffset)
    }

    function createTrack(track) {
        switch (track) {
            case "vocal":
                tracks.push(["vocal", "bg-indigo-500", []])

                break
            case "percussion":
                tracks.push(["percussion", "bg-rose-500", []])

                break
            case "synth":
                tracks.push(["synth", "bg-emerald-500", []])

                break
            case "guitar":
                tracks.push(["guitar", "bg-cyan-600", []])

                break
            case "section":
                tracks.push(["section", "bg-amber-500", []])

                break
        }

        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks
        trackCreationMenu()
    }
    
    let mouseX
    let mouseY
	function handleMousemove(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
        //console.log("m", mouseX, mouseY)
	}

    let markerName = ""

    let selectedTrackIndex
    let selectedBeatIndex

    let menuLeftPX = 0
    let menuTopPX = 0

    function showContext(trackIndex, i) {
        console.log("showing mark menu for track", trackIndex, i)
        
        trackMenuHidden = ""
        menuLeftPX = mouseX
        menuTopPX = mouseY

        selectedTrackIndex = trackIndex
        selectedBeatIndex = i
    }

    function closeContext() {
        trackMenuHidden = "hidden"
        menuLeftPX = 0
        menuTopPX = 0

        selectedTrackIndex = ""
        selectedBeatIndex = -1

        markerName = ""
    } 

    function createMark() {
        console.log("creating mark for track", selectedTrackIndex, selectedBeatIndex, `"${markerName}"`)

        //index, endIndex, note
        const mark = [selectedBeatIndex, 5, markerName]
        tracks[selectedTrackIndex][2].push(mark)

        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks

        closeContext()
    }

    onMount(() => {
        setTimeout(() => {
            updateLength()
            hiddenLoad = "hidden"
        }, 1000)
        
        window.addEventListener('resize', updateLength)

        return () => {
            window.removeEventListener('resize', updateLength);
        }
    })
</script>

<div class="fixed grid h-screen w-screen place-content-center z-50 backdrop-blur-sm {hiddenLoad}">
    <span class="text-9xl select-none">loading...</span>
</div>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:mousemove={handleMousemove} id="track-d" class="pt-12 pb-16" style="min-width: {trackLength}px">
    <div style="--menu-left: {menuLeftPX}px; --menu-top: {menuTopPX}px;" class="p-1 bg-black bg-opacity-30 fixed z-20 track-menu {trackMenuHidden}">
        <input bind:value={markerName} type="text" maxlength="20" placeholder="marker name here" class="bg-white p-3">
        <button on:click={createMark} class="bg-white w-12 h-12">add</button>
        <button on:click={closeContext} class="bg-white w-12 h-12">close</button>
    </div>

    <div class="flex flex-row h-28">
        <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl text-white bg-slate-500 text-6xl place-items-center place-content-center">
            <Fa icon={faDownload}/>
        </div>
        <div bind:this={pollingTrack} id="polling_track" class="grow h-full bg-slate-300 border-gray-600 border-b">
            <div id="editor-viewer">
                
            </div>
        </div>
    </div>

    {#each tracks as track}
        <div class="flex flex-row h-28">
            <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl text-white {track[1]} text-5xl leading-3 place-items-center place-content-center">
                {#if track[0] === "vocal"}
                    <Fa icon={faMicrophone}/>
                {:else if track[0] === "percussion"}
                    <Fa icon={faDrum}/>
                {:else if track[0] === "synth"}
                    <Fa icon={faWaveSquare}/>
                {:else if track[0] === "guitar"}
                    <Fa icon={faGuitar}/>
                {:else if track[0] === "section"}
                    <Fa icon={faObjectUngroup}/>
                {/if}
                <span class="text-xl">{track[0]}</span>
            </div>

            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div id="track-{tracks.indexOf(track)}" class="h-full bg-slate-300 border-t border-b border-gray-600" style="min-width: {trackLength}px">
                <div class="time-divider h-full flex">
                    {#each {length: ticks} as _, i}
                        {#if i % timeSigBeat === 0}
                            <div on:click={() => showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-500"></div>
                        {:else}
                            {#if i % 2 === 0}
                                <div on:click={() => showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-400"></div>
                            {:else}
                                <div on:click={() => showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-300"></div>
                            {/if}
                        {/if}
                    {/each}
                </div>
                {#each track[2] as mark}
                    <div style="min-width: {trackLength}px; transform: translateY(-6.875rem); margin-bottom: -6.875rem" class="h-full flex pointer-events-none">
                        <div style="transform: translateX({mark[0] * marginRightValue}px); width: {mark[1] * marginRightValue}px" class="{track[1]} bg-opacity-45 text-white pointer-events-auto">
                            <div class="grid grid-cols-3 h-full">
                                <div class="h-full flex flex-col">
                                    <button class="text-xl w-4 h-1/2 {track[1]} bg-opacity-75 place-items-center"><Fa icon={faCaretLeft}/></button>
                                    <button class="text-xl w-4 h-1/2 {track[1]} bg-opacity-75 place-items-center"><Fa icon={faCaretRight}/></button>
                                </div>

                                <button class="text-sm w-5 h-5 {track[1]} bg-opacity-75 justify-self-center self-end place-items-center"><Fa icon={faTrash}/></button>
                                
                                <div class="ml-auto h-full flex flex-col">
                                    <button class="text-xl w-4 h-1/2 {track[1]} bg-opacity-75 place-items-center"><Fa icon={faCaretRight}/></button>
                                    <button class="text-xl w-4 h-1/2 {track[1]} bg-opacity-75 place-items-center"><Fa icon={faCaretLeft}/></button>
                                </div>
                            </div>

                            <div style="transform: translateY(-6.938rem)" class="pointer-events-none">
                                {#if mark[2].length > 0}
                                    <span class="{track[1]} bg-opacity-95 border-black border-r-2 border-b-2">{mark[2]}</span>
                                {:else}
                                    <span class="{track[1]} bg-opacity-95">{mark[2]}</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/each}

    <div class="flex flex-row h-28 drop-shadow-lg">
        <div class="sticky left-0 z-20 pointer-events-none {dropdown}">
            <div class="ml-[7.50rem] m-2 mr-[-300px]">
                <button on:click={() => createTrack("vocal")} class="dropdown-btn bg-indigo-500"><Fa class="w-5 mr-2 text-xl" icon={faMicrophone}/> Vocals</button>
                <button on:click={() => createTrack("percussion")} class="dropdown-btn bg-rose-500"><Fa class="w-5 mr-2 text-xl" icon={faDrum}/> Percussion</button>
                <button on:click={() => createTrack("synth")} class="dropdown-btn bg-emerald-500"><Fa class="w-5 mr-2 text-xl" icon={faWaveSquare}/> Synth</button>
                <button on:click={() => createTrack("guitar")} class="dropdown-btn bg-cyan-600"><Fa class="w-5 mr-2 text-xl" icon={faGuitar}/> Guitar</button>
                <button on:click={() => createTrack("section")} class="dropdown-btn bg-amber-500"><Fa class="w-5 mr-2 text-xl" icon={faObjectUngroup}/> Section</button>
            </div>
        </div>
        
        <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl bg-[#323A45] text-6xl place-items-center place-content-center">
            <button class="ml-6 text-white" on:click={trackCreationMenu}>
                <Fa icon={faPlusCircle}/>
            </button>
        </div>

        <div class="bg-[#656a70] border-t border-gray-600 place-items-center place-content-center" style="min-width: {trackLength}px">
            <span class="pl-4">Click the (+) to add a new analysis track.</span>
        </div>
    </div>
</div>

<style lang="postcss">
    .dropdown-btn {
        @apply p-2 text-xl text-white flex place-items-center pointer-events-auto;
    }

    .drop-icon {
        @apply w-10 mr-5 text-xl;
    }

    .tick {
        padding-right: var(--padding-right);
        height: 100%;
        width: 1px;
    }

    .track-menu {
        left: var(--menu-left);
        top: var(--menu-top);
    }
</style>