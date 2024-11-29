<script>
    import { db } from "$lib/db.js"
	import { initialize, wavesurfer } from "$lib/editor.js"
	import BottomBar from "./BottomBar.svelte";
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";
	import { onMount } from "svelte";

    let playing = false
    let tracks = []

    let bpm
    let durration
    let timeSignatureBeat

    let title

    onMount(() => {
        //load data from database to use for wavesurfer
        db.editor.get(1).then(editor => {
            console.log("loading editor data from db....")

            if (editor === undefined) {
                alert("no save found!")
                return
            }

            console.log(editor)
            console.log("tracks", editor.tracks)
            console.log("timelineData", editor.timelineData)
            tracks = editor.timelineData

            durration = editor.length
            bpm = editor.bpm
            timeSignatureBeat = editor.timeSignatureBeat
            title = editor.projectName
            
            initialize()

            wavesurfer.loadBlob(editor.audio).then(() => {
                console.log("sucessfully loaded!")
            })
        })
    })
</script>

<div class="w-screen bg-[#a1a5ae]">
    <TopBar bind:title={title}/>
    <Tracks bind:tracks={tracks} bind:bpm={bpm} bind:length={durration} bind:timeSigBeat={timeSignatureBeat}/>

    this is the editor page <br/>
    
    <BottomBar bind:playing={playing}/>
</div>

<style lang="postcss">

</style>