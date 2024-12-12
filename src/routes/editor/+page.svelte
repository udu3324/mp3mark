<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
	import { initialize, wavesurfer } from "$lib/editor.js"
	import BottomBar from "./BottomBar.svelte";
	import Loader from "./Loader.svelte";
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";
	import { onMount } from "svelte";

    let projectID = 1

    let playing = false
    let tracks = []

    let bpm
    let durration
    let timeSignatureBeat

    let title

    let loading = true
    let canLoad = false

    let hiddenLoad = ""

    $: {
        if (!loading && canLoad) {
            hiddenLoad = "hidden"
        }
    }

    $: {
        try {
            //prevent saving empty data for some reason
            if (tracks.length !== 0) {
                console.log("found timeline data changes", tracks)
                db.editor.update(projectID, { timelineData: tracks });

                console.log("updated db sucessfully with new timeline data") 
            }
        } catch (error) {
            console.log("couldn't save timeline data to db automatically!!!")
        }
    }

    let dataTable

    onMount(() => {
        //get the current loaded project id
        db.load.orderBy("projectID").first(project => {
            console.log("loading project", project.projectID)

            //use id to load data to use for wavesurfer
            db.editor.get(project.projectID).then(editor => {
                console.log("loading editor data from db....")

                if (editor === undefined) {
                    alert("no save found!")
                    return
                }

                console.log(editor)
                console.log("timelineData", editor.timelineData)
                tracks = editor.timelineData

                durration = editor.length
                bpm = editor.bpm
                timeSignatureBeat = editor.timeSignatureBeat
                title = editor.projectName

                initialize()
                canLoad = true

                wavesurfer.loadBlob(editor.audio).then(() => {
                    console.log("sucessfully loaded!")
                })
            })
        })
    })
</script>

<div class="w-screen bg-[#a1a5ae]">
    <div class="fixed grid h-screen w-screen place-content-center z-50 backdrop-blur-sm {hiddenLoad}">
        <span class="text-9xl select-none">loading...</span>
        <div class="hidden">
            <Loader bind:dataTable={dataTable}/>
        </div>
        <div class="pt-6">
            {#if dataTable === undefined}
                <span>No projects found! Please go back to the main page to create one.</span>
                <br>
                <button on:click={goto("/")} class="mt-12 p-3 border-2 border-black w-40">Back</button>
            {:else}
                <span>Project data was found sucessfully and is loading...</span>
            {/if}
        </div>
    </div>

    <TopBar bind:title={title}/>
    <Tracks id="track-div" bind:loading={loading} bind:tracks={tracks} bind:bpm={bpm} bind:length={durration} bind:timeSigBeat={timeSignatureBeat}/>
    <BottomBar bind:playing={playing}/>
</div>

<style lang="postcss">

</style>