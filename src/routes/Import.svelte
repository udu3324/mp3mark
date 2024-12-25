<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
    import Fa from 'svelte-fa'
	import { faCog, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
	import WaveSurfer from 'wavesurfer.js';
    
    export let files
    export let visible = "hidden"
    export let fileName = ''

    $: projectName = fileName.substring(0, fileName.lastIndexOf(".")).substring(0, 22)

    let bpm = ""
    let beat = 4
    let note = 4

    let status = ''
    let disableSubmit = ""

    //check bpm input if its good
    $: {
        bpm = bpm.replace(/[^0-9]/g, "")
    }

    //cool little cooldown thing for the button
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
        
        const bpmCheck = Number.parseInt(bpm)
        
        if (bpmCheck === 0 || bpmCheck === undefined || bpmCheck === null || Number.isNaN(bpmCheck)) {
            status = "Please set a bpm!"
            disableBtn()
            
            return
        }

        try {
            status = "importing file..."
            //read the file into a blob
            const reader = new FileReader()
            reader.readAsArrayBuffer(files[0])

            reader.onload = async () => {
                const arrayBuffer = reader.result
                const blob = new Blob([arrayBuffer])

                //create wavesurfer object to pull audio length
                const wavesurfer = WaveSurfer.create({
                    container: '#waveform'
                })

                wavesurfer.loadBlob(blob).then(() => {

                    //save the blob + other data into indexeddb
                    db.editor.add({
                        audio: blob,
                        fileName: fileName, 
                        projectName: projectName, 
                        timeSignatureBeat: beat, 
                        timeSignatureNote: note,
                        bpm: Number.parseInt(bpm), 
                        length: wavesurfer.getDuration(),
                        timelineData: [],
                        volume: 0.5
                    }).then(() => {
                        //set the loading id
                        updateLoadProjectID()
                    })
                })
            }

        } catch (error) {
            alert(error)
        }
    }

    const updateLoadProjectID = async () => {
        try {
            await db.load.clear();

            const index = await db.editor.count();
            await db.load.add({ projectID: index });

            status = `Saved new project data to index ${index} sucessfully.`

            goto("/editor")
        } catch (error) {
            console.error('Error updating project ID:', error);
        }
    };

    function beatUp() {
        if (beat < 24) {
            beat++
        }
    }

    function beatDown() {
        if (beat > 1) {
            beat--
        }
    }

    function noteUp() {
        if (note < 24) {
            note++
        }
    }

    function noteDown() {
        if (note > 1) {
            note--
        }
    }
</script>

<div id="waveform" class="hidden">
    
</div>

<div class="{visible} bg-orange-300 w-96">
    <div class="flex p-3 bg-orange-400">
        <Fa class="animate-spin delay-1000 text-2xl" icon={faCog}/>
        <span class="pl-3">Importing "{fileName}"..</span>
    </div>
    <div class="p-3">
        <div class="flex border-b-2 border-orange-300">
            <p class="bg-orange-300 p-1">Project Name - </p>
            <input bind:value={projectName} class="p-1 h-8 w-44" type="text" maxlength="22" placeholder="name">
        </div>
        <div class="flex border-b-2 border-orange-300">
            <p  class="bg-orange-300 p-1">BPM - </p>
            <input bind:value={bpm} class="p-1 h-8 w-10" type="text" maxlength="3" placeholder="180">
        </div>
        <div class="flex">
            <p class="bg-orange-300 p-1">Time Signature - </p>

            <button on:click={beatUp} class="signature-button"><Fa icon={faArrowUp}/></button>
            <button on:click={beatDown} class="signature-button"><Fa icon={faArrowDown}/></button>

            <p class="bg-white h-8 p-1">{beat}/{note}</p>

            <button on:click={noteUp} class="signature-button"><Fa icon={faArrowUp}/></button>
            <button on:click={noteDown} class="signature-button"><Fa icon={faArrowDown}/></button>
        </div>

        <button on:click={openEditor} disabled={disableSubmit} class="mt-3 p-3 bg-orange-400">Open in Editor</button>
        <p>{status}</p>
    </div>
</div>

<style lang="postcss">
    .signature-button {
        @apply bg-white p-2 h-8;
    }
</style>