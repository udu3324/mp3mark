<script>
    import { currentTime, resolution, tracksHeight } from "$lib/editor"

    // biome-ignore lint/style/useConst: <explanation>
    let innerHeight = 0
    // biome-ignore lint/style/useConst: <explanation>
    let scrollY = 0

    let playHeight = 0
    let playLeftPX = 0

    let isScrollable = false
    let heightPXStored = 0
    
    //react to time to change playhead position
    currentTime.subscribe((value) => {
        playLeftPX = (value * resolution)
    })

    //get tracks height from the component for playhead length
    tracksHeight.subscribe((value) => {
        updateHeight(value)
    })

    //calculate height of the playhead line
    function updateHeight(px) {
        playHeight = px
        heightPXStored = playHeight
        //console.log("playHeight", playHeight)

        if (px > innerHeight) {
            isScrollable = true
        } else {
            isScrollable = false
        }

        //console.log("isScrollable", isScrollable, innerHeight)
    }

    //update height if window height changed
    $: {
        if (innerHeight) {
            updateHeight(heightPXStored)
        }
    }
</script>

<svelte:window bind:scrollY={scrollY} bind:innerHeight={innerHeight}/>

<div>
    <!-- Line -->
    <div style="left: calc({playLeftPX}px + 7rem); top: 0; height: calc({playHeight}px - 4rem)" class="absolute w-[2px] z-10 top-0 bg-slate-800 dark:bg-white pointer-events-none"></div>

    <!-- Top Head -->
    <div style="left: calc({playLeftPX}px + 7rem - 6px); top: calc({scrollY}px + 3rem)" class="triangle-t absolute z-20 pointer-events-none"></div>

    <!-- Middle Head -->
    <div style="left: calc({playLeftPX}px + 7rem - 6px); top: calc(7rem + 3rem - 7px - 1px)" class="triangle-b absolute z-20 pointer-events-none"></div>

    <!-- Bottom Head -->
    <div style="left: calc({playLeftPX}px + 7rem - 6px); {isScrollable ? `bottom: calc(4rem - ${scrollY}px);` : `top: calc(${playHeight}px - 4rem - 7px);`}" class="triangle-b absolute z-20 pointer-events-none"></div>
</div>

<style lang="postcss">
    .triangle-t {
        @apply w-0 h-0 border-t-[7px] border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-slate-800;
        @apply dark:border-white dark:border-l-transparent dark:border-r-transparent;
    }

    .triangle-b {
        @apply w-0 h-0 border-b-[7px] border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-slate-800;
        @apply dark:border-white dark:border-l-transparent dark:border-r-transparent;
    }
</style>