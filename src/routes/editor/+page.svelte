<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
	import { initialize, wavesurfer, setMediaSession } from "$lib/editor.js"
	import BottomBar from "./BottomBar.svelte";
	import Loader from "./Loader.svelte";
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";
	import { onMount } from "svelte";

    let editorData

    let projectID = 1

    // biome-ignore lint/style/useConst: <explanation>
    let playing = false
    let tracks = []
    let tracksObj

    let bpm
    let durration
    let timeSignatureBeat
    let title
    let volume
    let volumeSet = false
    
    //for loader
    let dataTable

    // biome-ignore lint/style/useConst: <explanation>
    let loading = true
    let canLoad = false
    
    let hiddenLoad = ""

    //for loading screen
    $: {
        if (!loading && canLoad) {
            hiddenLoad = "hidden"
        }
    }

    //for saving track data
    $: {
        try {
            //prevent saving empty data for some reason
            if (tracks.length !== 0) {
                //console.log("found timeline data changes", tracks)
                db.editor.update(projectID, { timelineData: tracks });

                console.log("updated db sucessfully with new timeline data") 
            }
        } catch (error) {
            console.log("couldn't save timeline data to db automatically!!!")
        }
    }

    //for saving volume
    $: {
        try {
            if (volume && volumeSet) {
                //console.log("found timeline data changes", tracks)
                db.editor.update(projectID, { volume: volume });

                console.log("updated db sucessfully with new volume") 
            }
        } catch (error) {
            console.log("couldn't save volume to db automatically!!!")
        }
    }

    onMount(() => {
        //get the current loaded project id
        db.load.orderBy("projectID").first(project => {
            console.log("loading project", project.projectID)
            
            projectID = project.projectID

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
                editorData = editor

                //add flag array to old db if needed
                for (let i = 0; i < tracks.length; i++) {
                    if (tracks[i][3] === undefined) {
                        tracks[i].push([])
                    }
                }

                durration = editor.length
                bpm = editor.bpm
                timeSignatureBeat = editor.timeSignatureBeat
                title = editor.projectName

                //add volume to db since its new
                if (editor.volume === undefined) {
                    console.log("added volume ")
                    db.editor.update(project.projectID, {volume: 0.5})
                } else {
                    console.log("loaded volume of", editor.volume)
                    volume = editor.volume
                }
                volumeSet = true
                
                setMediaSession(title)
                initialize()
                canLoad = true

                wavesurfer.loadBlob(editor.audio).then(() => {
                    console.log("sucessfully loaded!")
                    tracksObj.loaded()
                })
            })
        })
    })
</script>

<svelte:head>
    <title>mp3mark_editor</title> 
</svelte:head>

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

    <TopBar bind:title={title} editorData={editorData} bind:projectID={projectID} />
    <Tracks bind:this={tracksObj} id="track-div" bind:loading={loading} bind:tracks={tracks} bind:bpm={bpm} bind:length={durration} bind:timeSigBeat={timeSignatureBeat}/>
    <BottomBar bind:playing={playing} bind:volume={volume}/>
</div>

<style lang="postcss">

</style>