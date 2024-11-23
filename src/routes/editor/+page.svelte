<script>
    import { db } from "$lib/db.js"
	import { initialize, wavesurfer } from "$lib/editor.js"
	import BottomBar from "./BottomBar.svelte";
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";
	import { onMount } from "svelte";

    let playing = false
    let tracks = []

    onMount(() => {
        //load data from database to use for wavesurfer
        db.editor.get(1).then(editor => {
            console.log("loading editor data from db....")

            if (editor === undefined) {
                alert("no save found!")
                return
            }

            console.log(editor)

            tracks = editor.tracks
            
            initialize()

            wavesurfer.loadBlob(editor.audio).then(() => {
                console.log("sucessfully loaded!")
            })
        })
    })
</script>

<div class="w-screen bg-[#a1a5ae]">
    <TopBar/>
    <Tracks bind:tracks={tracks}/>

    this is the editor page <br/>
    
    <BottomBar bind:playing={playing}/>
</div>

<style lang="postcss">

</style>