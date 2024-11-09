<script>
    import { db } from "../lib/db.js"
    import Fa from 'svelte-fa'
	import { faCog } from "@fortawesome/free-solid-svg-icons";
    
    export let files
    export let visible = "hidden"
    export let fileName = ''

    $: projectName = fileName.substring(0, fileName.lastIndexOf("."))
    let bpm
    let beat = 4
    let note = 4

    let status = ''
    let disableSubmit = ""

    function disableBtn() {
        disableSubmit = true

        setTimeout(() => {
            status = ""
            disableSubmit = false
        }, 1000)
    }

    async function openEditor() {
        // check if required things are set
        console.log("name", projectName, "bpm", bpm)

        if (projectName.length < 1) {
            status = "Please set a project name!"
            disableBtn()

            return
        }

        if (bpm < 0 || bpm === undefined || bpm === null) {
            status = "Please set a bpm!"
            disableBtn()
            
            return
        }

        try {
            //read the file into a blob
            const reader = new FileReader()
            reader.readAsArrayBuffer(files[0])

            reader.onload = async () => {
                const arrayBuffer = reader.result
                const blob = new Blob([arrayBuffer])

                //save the blob + other data into indexeddb
                const id = db.editor.add({
                    audio: blob,
                    fileName: fileName, 
                    projectName: projectName, 
                    timeSignatureBeat: beat, 
                    timeSignatureNote: note,
                    bpm: bpm, 
                    length, 
                    tracks: 0, 
                    timelineData: []
                })

                status = `Saved new project data to index ${id} sucessfully.`
            }

        } catch (error) {
            alert(error)
        }
    }
</script>

<div class="{visible} bg-orange-300 p-3">
    <p>
        <Fa icon={faCog}/>
        Importing "{fileName}"..
    </p>

    <h>Project Name -</h>
    <input bind:value={projectName} type="text" placeholder="name">

    <br>

    <h>BPM -</h>
    <input bind:value={bpm} type="number" placeholder="180">

    <br>

    <h>Time Signature - <span class="bg-white">{beat}/{note}</span></h>

    <br>

    <button on:click={openEditor} disabled={disableSubmit} class="mt-3 p-3 bg-orange-400">Open in Editor</button>
    <p>{status}</p>

</div>

<style lang="postcss">

</style>