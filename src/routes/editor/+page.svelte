<script>
	import WaveSurfer from "wavesurfer.js";
    import { db } from "../../lib/db.js"
	import BottomBar from "./BottomBar.svelte";
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";
	import { onMount } from "svelte";

    let time = "devtime"
    let playing = false

    onMount(() => {
        const wavesurfer = WaveSurfer.create({
            container: '#editor-viewer',
            waveColor: '#eab308',
            progressColor: '#957206',
            height: '112',
            normalize: 'true',
            minPxPerSec: '10',
            fillParent: false
        })

        //load data from database to use for wavesurfer
        db.editor.get(1).then(editor => {
            console.log("loading editor data from db....")

            if (editor === undefined) {
                alert("no save found!")
                return
            }

            console.log(editor)

            wavesurfer.loadBlob(editor.audio).then(() => {
                console.log("sucessfully loaded!")
            })
        })
    })
</script>

<div class="w-screen bg-[#a1a5ae]">
    <TopBar bind:time={time}/>
    <Tracks/>

    this is the editor page
    <BottomBar bind:playing={playing}/>
</div>

<style lang="postcss">

</style>