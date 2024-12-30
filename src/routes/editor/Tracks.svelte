<script>
    import Fa from "svelte-fa"
	import { faCaretLeft, faCaretRight, faDrum, faGuitar, faMicrophone, faObjectUngroup, faTrash, faWaveSquare } from "@fortawesome/free-solid-svg-icons"
	
    import { onMount } from "svelte"
    import { resolution } from "$lib/editor.js"
	
	import TrackContextMenu from "./TrackContextMenu.svelte"
	import TrackVisualizer from "./TrackVisualizer.svelte"
    import TrackCreationTool from "./TrackCreationTool.svelte"

    export let tracks
    export let bpm
    export let length
    export let timeSigBeat

    export let loading = true

    // biome-ignore lint/style/useConst: it isnt actually constant
    let note = ""
    let trackContextMenu

    let pollingTrack
    let trackLength = 0

    let ticks = 0
    let tickOffset = 0
    let marginRightValue = 0

    //this gets the visualizer's length to calculate a bunch of stuff
    function updateLength() {
        trackLength = pollingTrack.offsetWidth
        console.log("track px length set to", trackLength)
        const secondsPerBeat = 60 / bpm

        ticks = length / secondsPerBeat
        tickOffset = secondsPerBeat * resolution
        marginRightValue = tickOffset

        console.log("secondsPerBeat", secondsPerBeat, "total ticks", ticks, "tickOffset", tickOffset)
    }
    
    //track mouse position for track context menu
    let mouseX
    let mouseY
	function handleMousemove(event) {
		mouseX = event.clientX;
		mouseY = event.clientY;
        //console.log("m", mouseX, mouseY)
	}

    function deleteFlag(track, flag) {
        console.log("removing flag", flag)
        const trackIndex = tracks.indexOf(track)
        const flagIndex = tracks[trackIndex][3].indexOf(flag)

        tracks[trackIndex][3].splice(flagIndex, 1)
        
        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks
    }

    function deleteMark(track, mark) {
        console.log("removing mark", mark)
        const trackIndex = tracks.indexOf(track)
        const markIndex = tracks[trackIndex][2].indexOf(mark)

        tracks[trackIndex][2].splice(markIndex, 1)
        
        // biome-ignore lint/correctness/noSelfAssign: make it svelte reactive
        tracks = tracks
    }

    //stored temporarily for resizing marks/flags
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

        trackContextMenu.closeContext()

        //reroute for flags
        if (dragFlag.length !== 0) {
            return holding2(e)
        }

        const rect = dragElement.getBoundingClientRect();
        const posInBar = e.clientX - rect.left

        let start = tracks[dragTrack][2][dragMark][0]
        let size = tracks[dragTrack][2][dragMark][1]

        const behindLeft = Math.round(posInBar / marginRightValue)
        const behindRight = Math.round((posInBar - 16) / marginRightValue)
        
        //either left or right sizing
        if (dragDirection === "left") {
            //sizing it up or down if cursor is close to edge of element
            if (posInBar < 1) {
                if (--start >= 0) {
                    //console.log("FIRING!!!", (size - (size + Math.abs(behind))) + Math.abs((size - (size + Math.abs(behind)))))
                    //console.log("start diff:", (start - (start + Math.abs(behind))))
                    //console.log("size diff:", (size - (size + Math.abs(behind))))
                    updateMark(start + behindLeft, ++size + Math.abs(behindLeft))
                    //todo mouse slamming past window which causes out of bounds and i cant think of the right calculations to fix this
                }
            } else if (posInBar > 13) {
                if (--size >= 4) {
                    updateMark(++start + behindRight, size - behindRight)
                }
            }
        } else {
            if (posInBar < 1) {
                if (--size >= 4) {
                    updateMark(start, size - Math.abs(behindLeft))
                }
            } else if (posInBar > 13) {
                //some math to convert ticks to measure real px
                if ((start * tickOffset) + (++size * tickOffset) <= (ticks * tickOffset)) {
                    updateMark(start, size + behindRight)
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

        const behindLeft = Math.round(posInBar / marginRightValue)
        const behindRight = Math.round((posInBar - 16) / marginRightValue)

        if (posInBar < 1) {
            if (--start >= 0) {
                tracks[dragTrack][3][dragFlag][0] = start + behindLeft
            }
        } else if (posInBar > 13) {
            if (++start <= ticks - 1) {
                tracks[dragTrack][3][dragFlag][0] = start + behindRight
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
    <TrackContextMenu bind:this={trackContextMenu} bind:note={note} mouseX={mouseX} mouseY={mouseY} bind:tracks={tracks}/>
    
    <TrackVisualizer bind:pollingTrack={pollingTrack} trackLength={trackLength} ticks={ticks} timeSigBeat={timeSigBeat} marginRightValue={marginRightValue}/>

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
                {:else}
                    <div class="w-12 h-12 grid place-items-center place-content-center font-semibold">
                        {track[0].substring(0, 1)}
                    </div>
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
                            <div on:click={(e) => trackContextMenu.showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-400"></div>
                        {:else}
                            {#if i % 2 === 0}
                                <div on:click={(e) => trackContextMenu.showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-300"></div>
                            {:else}
                                <div on:click={(e) => trackContextMenu.showContext(tracks.indexOf(track), i)} style="--padding-right: {marginRightValue}px;" class="tick bg-gray-200"></div>
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
                        <div style="transform: translateX({flag[0] * marginRightValue}px)" class="w-4 rounded-lg text-white pointer-events-auto select-none">
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
    
    <TrackCreationTool bind:tracks={tracks} trackLength={trackLength}/>
</div>

<style lang="postcss">
    .tick {
        padding-right: var(--padding-right);
        height: 100%;
        width: 1px;
    }

    .flag {
        clip-path: polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%);
    }
</style>