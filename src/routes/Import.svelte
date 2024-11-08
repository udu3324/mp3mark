<script>
    import { db } from "../lib/db.js"
    import Fa from 'svelte-fa'
	import { faCog } from "@fortawesome/free-solid-svg-icons";
    
    let projectName = ''
    let bpm
    let beat = 4
    let note = 4

    async function openEditor() {
        try {
            // add the audio file
            const id = await db.editor.add({
                audio: files[0]
            })

            const id2 = db.data.add({
                fileName: fileName, 
                projectName: projectName, 
                timeSignatureBeat: beat, 
                timeSignatureNote: note,
                bpm: bpm, 
                length, 
                tracks: 0, 
                timelineData: []
            })

        } catch (error) {
            alert(error)
        }
    }

    export let visible = "hidden"
    export let fileName = ''
</script>

<div class="{visible} bg-orange-300">
    <p>
        <Fa icon={faCog}/>
        Importing "{fileName}"..
    </p>

    <h>Project Name</h>
    <input type="text" value={projectName} placeholder="name">

    <br>

    <h>BPM</h>
    <input type="number" value={bpm} placeholder="180">

    <br>

    <h>Time Signature</h>
    <p>{beat}/{note}</p>

    <br>

    <button on:click={openEditor} class="m-3 p-3 bg-orange-400">Open Editor</button>
</div>

<style lang="postcss">

</style>