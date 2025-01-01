<script>
	import { faDownload } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    export let pollingTrack

    export let trackLength
    export let ticks
    export let timeSigBeat
    export let marginRightValue
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="flex flex-row h-28">
    <div class="sticky grid left-0 z-10 h-28 min-w-28 basis-28 shadow-2xl text-white bg-slate-500 text-6xl place-items-center place-content-center">
        <Fa icon={faDownload}/>
    </div>
    <div bind:this={pollingTrack} id="polling_track" class="grow h-full bg-slate-300 border-gray-600 border-b">
        <div id="editor-viewer" class="cursor-pointer">
            
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

<style lang="postcss">
    
</style>