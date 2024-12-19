<script>
	import { faCaretLeft, faCaretRight, faDownload, faDrum, faGuitar, faMicrophone, faObjectUngroup, faPlusCircle, faTrash, faWaveSquare } from "@fortawesome/free-solid-svg-icons";
	import { onMount } from "svelte";
    import { resolution } from "$lib/editor.js"
	import Fa from "svelte-fa";
    
    export let tracks
    export let bpm
    export let length
    export let timeSigBeat

    export let loading = true

    let trackMenuHidden = "hidden"

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
    
    let mouseX
    let mouseY
	function handleMousemove(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
        //console.log("m", mouseX, mouseY)
	}

    let note = ""

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

        note = ""
    }

    function createFlag() {
        console.log("creating flag for track", selectedTrackIndex, selectedBeatIndex, `"${note}"`)

        //add new flag array if track data was old
        if (tracks[selectedTrackIndex][3] === undefined) {
            tracks[selectedTrackIndex].push([])
        }

        note = note.trim()
        note = note.replaceAll(" ", "_")

        //start, note
        const flag = [selectedBeatIndex, note]
        tracks[selectedTrackIndex][3].push(flag)

        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks

        closeContext()
    }

    function deleteFlag(track, flag) {
        console.log("removing flag", flag)
        const trackIndex = tracks.indexOf(track)
        const flagIndex = tracks[trackIndex][3].indexOf(flag)

        tracks[trackIndex][3].splice(flagIndex, 1)
        
        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks
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

    function deleteMark(track, mark) {
        console.log("removing mark", mark)
        const trackIndex = tracks.indexOf(track)
        const markIndex = tracks[trackIndex][2].indexOf(mark)

        tracks[trackIndex][2].splice(markIndex, 1)
        
        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks
    }

    //stored temporarily to allow resizing marks
    let dragDirection = ""
    let dragTrack = ""
    let dragMark = ""
    let dragFlag = ""
    let dragElement = ""

    function drag(direction, track, mark, e) {
        dragDirection = direction
        dragTrack = tracks.indexOf(track)
        dragMark = tracks[dragTrack][2].indexOf(mark)
        dragElement = e.currentTarget
    }

    function holding(e) {
        if (dragElement.length === 0) {
            return
        }

        //reroute for flags
        if (dragFlag.length !== 0) {
            return holding2(e)
        }

        const rect = dragElement.getBoundingClientRect();
        const posInBar = e.clientX - rect.left

        let start = tracks[dragTrack][2][dragMark][0]
        let size = tracks[dragTrack][2][dragMark][1]

        //either left or right sizing
        if (dragDirection === "left") {
            //sizing it up or down if cursor is close to edge of element
            if (posInBar < 1) {
                if (--start >= 0) {
                    updateMark(start, ++size)
                }
            } else if (posInBar > 13) {
                if (--size >= 4) {
                    updateMark(++start, size)
                }
            }
        } else {
            if (posInBar < 1) {
                if (--size >= 4) {
                    updateMark(start, size)
                }
            } else if (posInBar > 13) {
                //some math to convert ticks to measure real px
                if ((start * tickOffset) + (++size * tickOffset) <= (ticks * tickOffset)) {
                    updateMark(start, size)
                }
            }
        }
    }

    function updateMark(start, size) {
        tracks[dragTrack][2][dragMark][0] = start
        tracks[dragTrack][2][dragMark][1] = size
    }

    //for flags specifically
    function drag2(track, flag, e) {
        dragTrack = tracks.indexOf(track)
        dragFlag = tracks[dragTrack][3].indexOf(flag)
        dragElement = e.currentTarget
    }

    function holding2(e) {
        const rect = dragElement.getBoundingClientRect();
        const posInBar = e.clientX - rect.left

        let start = tracks[dragTrack][3][dragFlag][0]

        if (posInBar < 1) {
            if (--start >= 0) {
                tracks[dragTrack][3][dragFlag][0] = start
            }
        } else if (posInBar > 13) {
            if (++start <= ticks - 1) {
                tracks[dragTrack][3][dragFlag][0] = start
            }
            
        }
    }

    onMount(() => {
        setTimeout(() => {
            updateLength()
            loading = false
        }, 1000)
        
        //event to fix track size limit
        window.addEventListener('resize', updateLength)

        //event for holding down marks
        window.addEventListener('mousemove', (e) => {
            holding(e)
        });

        //stop holding marks when dragging mouse ends
        window.addEventListener('mouseup', () => {
            dragDirection = ""
            dragTrack = ""
            dragMark = ""
            dragFlag = ""
            dragElement = ""
        })

        //make sure it runs in the end
        return () => {
            window.removeEventListener('resize', updateLength);
        }
    })
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div on:mousemove={handleMousemove} id="track-d" class="pt-12 pb-16" style="min-width: {trackLength}px">
    <div style="--menu-left: {menuLeftPX}px; --menu-top: {menuTopPX}px;" class="p-1 bg-black bg-opacity-30 fixed z-20 track-menu {trackMenuHidden}">
        <button on:click={closeContext} class="bg-white w-12 h-12">close</button>

        <button on:click={createFlag} class="bg-white w-12 h-12">flag</button>
        <button on:click={createMark} class="bg-white w-12 h-12 mb-1">mark</button>
        
        <br>

        <input bind:value={note} type="text" maxlength="20" placeholder="set note" class="bg-white p-3">
    </div>

    <!-- Visualizer Track -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="flex flex-row h-28">
        <div class="sticky grid left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl text-white bg-slate-500 text-6xl place-items-center place-content-center">
            <Fa icon={faDownload}/>
        </div>
        <div bind:this={pollingTrack} id="polling_track" class="grow h-full bg-slate-300 border-gray-600 border-b">
            <div id="editor-viewer">
                
            </div>
            <div style="min-width: {trackLength}px; transform: translateY(-7rem)" class="h-full flex pointer-events-none">
                <div class="time-divider h-full flex">
                    {#each {length: ticks} as _, i}
                        {#if i % timeSigBeat === 0}
                            <div style="--padding-right: {marginRightValue}px;" class="tick bg-gray-500"></div>
                        {:else}
                            {#if i % 2 === 0}
                                <div style="--padding-right: {marginRightValue}px;" class="tick bg-gray-400"></div>
                            {:else}
                                <div style="--padding-right: {marginRightValue}px;" class="tick bg-gray-300"></div>
                            {/if}
                        {/if}
                    {/each}
                </div>
            </div>
        </div>
    </div>

    <!-- Render Added Tracks -->
    {#each tracks as track}
        <div class="flex flex-row h-28">
            <!-- Track Icon -->
            <div class="sticky grid left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl text-white {track[1]} text-5xl leading-3 place-items-center place-content-center">
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

            <!-- Track Content -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div id="track-{tracks.indexOf(track)}" class="h-full bg-slate-300 border-t border-b border-gray-600" style="min-width: {trackLength}px">
                <!-- Beat Dividers -->
                <div class="time-divider h-full flex">
                    {#each {length: ticks} as _, i}
                        {#if i % timeSigBeat === 0}
                            <div on:click={(e) => showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-400"></div>
                        {:else}
                            {#if i % 2 === 0}
                                <div on:click={(e) => showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-300"></div>
                            {:else}
                                <div on:click={(e) => showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-200"></div>
                            {/if}
                        {/if}
                    {/each}
                </div>
                <!-- Marks -->
                {#each track[2] as mark}
                    <div style="min-width: {trackLength}px; transform: translateY(-6.875rem); margin-bottom: -6.875rem" class="h-full flex pointer-events-none">
                        <div style="transform: translateX({mark[0] * marginRightValue}px); width: {mark[1] * marginRightValue}px" class="{track[1]} rounded-lg bg-opacity-45 text-white pointer-events-auto">
                            <div class="grid grid-cols-3 h-full">
                                <div on:mousedown={(e) => drag("left", track, mark, e)} class="rounded-l-lg text-2xl h-full w-4 {track[1]} bg-opacity-85 flex place-items-center justify-center">
                                    <Fa icon={faCaretLeft}/>
                                </div>

                                <button on:click={() => deleteMark(track, mark)} class="text-sm w-5 h-5 {track[1]} bg-opacity-55 justify-self-center self-end place-items-center"><Fa icon={faTrash}/></button>
                                
                                <div on:mousedown={(e) => drag("right", track, mark, e)} class="rounded-r-lg text-2xl h-full w-4 {track[1]} bg-opacity-85 flex place-items-center justify-center ml-auto">
                                    <Fa icon={faCaretRight}/>
                                </div>
                            </div>

                            <div style="transform: translateY(-6.938rem)" class="pointer-events-none">
                                {#if mark[2].length > 0}
                                    <span class="{track[1]} rounded-tl-lg bg-opacity-95 border-black border-r-2 border-b-2 border-opacity-30">{mark[2]}</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
                <!-- Flags -->
                {#each track[3] as flag}
                    <div style="min-width: {trackLength}px; transform: translateY(-6.875rem); margin-bottom: -6.875rem" class="h-full flex pointer-events-none">
                        <div style="transform: translateX({flag[0] * marginRightValue}px)" class="w-4 rounded-lg text-white pointer-events-auto">
                            {#if flag[1].length > 0}
                                <div on:mousedown={(e) => drag2(track, flag, e)} class="flag {track[1]} w-full h-full rounded-tl-lg">
                                    <button on:click={() => deleteFlag(track, flag)} class="mt-6 text-sm place-items-center w-4 h-6 border-y-2 border-black border-opacity-30"><Fa icon={faTrash}/></button>
                                </div>
                            {:else}
                                <div on:mousedown={(e) => drag2(track, flag, e)} class="flag {track[1]} w-full h-full rounded-t-sm">
                                    <button on:click={() => deleteFlag(track, flag)} class="mt-6 text-sm place-items-center w-4 h-6 border-y-2 border-black border-opacity-30"><Fa icon={faTrash}/></button>
                                </div>
                            {/if}
                            {#if flag[1].length > 0}
                                <span style="transform: translateY(-6.875rem)" class="{track[1]} rounded-tl-lg absolute bg-opacity-95 border-black border-r-2 border-b-2 border-opacity-30 pointer-events-none">{flag[1]}</span>
                            {/if}
                        </div>
                    </div>
                {/each}
                <!-- Intro Text -->
                {#if track[2].length < 1 && track[3].length < 1}
                    <div style="transform: translateY(-6.875rem); margin-bottom: -6.875rem" class="h-full flex pointer-events-none place-items-center">
                        <span class="ml-4 bg-white">Click anywhere in this {track[0]} track to create a mark.</span>
                    </div>
                {/if}
            </div>
        </div>
    {/each}
    
    <!-- Add Track Tool -->
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
        
        <div class="sticky left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl bg-[#323A45] text-6xl place-items-center place-content-center">
            <button class="ml-6 text-white" on:click={trackCreationMenu}>
                <Fa icon={faPlusCircle}/>
            </button>
        </div>

        <div class="bg-[#656a70] border-t border-gray-600 place-items-center place-content-center" style="min-width: {trackLength}px">
            <span class="ml-4 text-white">Click the (+) to add a new analysis track.</span>
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

    .flag {
        clip-path: polygon(0 0, 100% 0, 98% 90%, 50% 100%, 0 90%);
    }
</style>