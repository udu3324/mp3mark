<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
    import Fa from 'svelte-fa'
	import { faCog, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
	import WaveSurfer from 'wavesurfer.js';
    
    export let files
    // biome-ignore lint/style/useConst: <explanation>
    export let visible = "hidden"
    // biome-ignore lint/style/useConst: <explanation>
    export let fileName = ''

    $: projectName = fileName.substring(0, fileName.lastIndexOf(".")).substring(0, 22)
    
    let bpm = ""
    let beat = 4
    let note = 4

    let status = ''
    let disableSubmit = false
    let disableSubmitFile = false

    let parsedData
    let fileInput
    let filesProjectImport
    let detailsFileName = ""
    let detailsLength = ""

    let extension = ""

    $: {
        if (fileName) {
            extension = fileName.substring(fileName.indexOf(".") + 1)

            //do special stuff if file imported is 
            if (extension === "mp3mark") {
                disableSubmit = true
                readProjectFile()
            }
        }
    }

    //check bpm input if its good
    $: {
        if (typeof bpm === "string") {
            bpm = bpm.replace(/[^0-9]/g, "")
        }
    }

    function readProjectFile() {
        try {
            const reader = new FileReader()
            reader.readAsText(files[0])

            reader.onload = async () => {
                parsedData = JSON.parse(reader.result)

                console.log(parsedData)

                projectName = parsedData.projectName
                bpm = parsedData.bpm
                beat = parsedData.timeSignatureBeat
                note = parsedData.timeSignatureNote

                detailsFileName = parsedData.fileName
                detailsLength = parsedData.length
            }
        } catch (error) {
            alert(error)
        }
    }

    function importAudio() {
        //check if values are set correctly
        if (!checkValues()) return

        fileInput.click()
    }

    $: {
        if (filesProjectImport) {
            if (filesProjectImport[0]) {
                console.log("recieved audio file") 

                try {
                    const reader = new FileReader()
                    reader.readAsArrayBuffer(filesProjectImport[0])

                    reader.onload = async () => {
                        const arrayBuffer = reader.result
                        const blob = new Blob([arrayBuffer])

                        //skip processing of audio length

                        await db.editor.add({
                            audio: blob,
                            fileName: parsedData.fileName, 
                            projectName: projectName, 
                            timeSignatureBeat: beat, 
                            timeSignatureNote: note,
                            bpm: Number.parseInt(bpm), 
                            length: parsedData.length,
                            timelineData: parsedData.timelineData,
                            volume: parsedData.volume
                        })
                    
                        //clear load db
                        await db.load.clear()
                    
                        //get the last index that was added to the editor as it's the imported one
                        const index = await db.editor.count()
                        await db.load.add({ projectID: index })
                    
                        status = `Saved existing project data to index ${index} sucessfully.`
                        goto("/editor")
                    }
                } catch (error) {
                    alert(error)
                }
            }
        }
    }

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

    //cool little cooldown thing for the button
    function disableBtn() {
        disableSubmit = true
        disableSubmitFile = true

        setTimeout(() => {
            status = ""
            if (extension === "mp3mark") {
                disableSubmitFile = false
            } else {
                disableSubmit = false
            }
        }, 1000)
    }

    async function openEditor() {
        // check if required things are set
        if (!checkValues()) return

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

                await wavesurfer.loadBlob(blob)

                //save the blob + other data into indexeddb
                await db.editor.add({
                    audio: blob,
                    fileName: fileName, 
                    projectName: projectName, 
                    timeSignatureBeat: beat, 
                    timeSignatureNote: note,
                    bpm: Number.parseInt(bpm), 
                    length: wavesurfer.getDuration(),
                    timelineData: [],
                    volume: 0.5
                })

                //clear load db
                await db.load.clear()

                //get the last index that was added to the editor as it's the imported one
                const index = await db.editor.count()
                await db.load.add({ projectID: index })

                status = `Saved new project data to index ${index} sucessfully.`
                goto("/editor")
            }
        } catch (error) {
            alert(error)
        }
    }

    function checkValues() {
        if (projectName.length < 1) {
            status = "Set a project name!"
            disableBtn()

            return false
        }
        
        const bpmCheck = Number.parseInt(bpm)
        if (bpmCheck === 0 || bpmCheck === undefined || bpmCheck === null || Number.isNaN(bpmCheck)) {
            status = "Set a bpm!"
            disableBtn()
            
            return false
        }

        return true
    }
</script>

<div id="waveform" class="hidden">
    
</div>

<div class="{visible} bg-orange-300 w-96">
    <div class="flex p-3 bg-orange-400">
        <Fa class="animate-spin delay-1000 text-2xl text-orange-900" icon={faCog}/>
        <span class="pl-3 text-orange-900 select-none">Importing "{fileName}"..</span>
    </div>
    <div class="p-3">
        <div class="flex border-b-2 border-orange-300">
            <p class="bg-orange-300 p-1 select-none">Project Name - </p>
            <input bind:value={projectName} class="p-1 h-8 w-44" type="text" maxlength="22" placeholder="name">
        </div>
        <div class="flex border-b-2 border-orange-300">
            <p  class="bg-orange-300 p-1 select-none">BPM - </p>
            <input bind:value={bpm} class="p-1 h-8 w-10" type="text" maxlength="3" placeholder="180">
        </div>
        <div class="flex">
            <p class="bg-orange-300 p-1 select-none">Time Signature - </p>

            <button on:click={beatUp} class="signature-button"><Fa icon={faArrowUp}/></button>
            <button on:click={beatDown} class="signature-button"><Fa icon={faArrowDown}/></button>

            <p class="bg-white h-8 p-1 select-none">{beat}/{note}</p>

            <button on:click={noteUp} class="signature-button"><Fa icon={faArrowUp}/></button>
            <button on:click={noteDown} class="signature-button"><Fa icon={faArrowDown}/></button>
        </div>

        {#if extension === "mp3mark"}
        <div class="mt-3 p-2 bg-orange-200">
            <p>Please import the original audio file that was created with this project.</p>
            
            <div class="mt-2">
                <p>File Name: <i>{detailsFileName}</i></p>
                <p>Audio Length: <i>{detailsLength}</i> seconds</p>
            </div>
        </div>
        <input id="fileInput" bind:this={fileInput} bind:files={filesProjectImport} class="hidden" type="file" name="file" accept="audio/mp3, audio/flac, audio/wav">
        <button on:click={importAudio} disabled={disableSubmitFile} class="mt-3 p-3 bg-orange-400 disabled:bg-opacity-0">Import Audio File</button>
        {:else}
        <div class="mt-3 p-2 bg-orange-200">
            <p>Please set the name, bpm, and time signature of the audio.</p>
        </div>
        {/if}

        <button on:click={openEditor} disabled={disableSubmit} class="mt-3 p-3 bg-orange-400 disabled:bg-opacity-0">Open in Editor</button>
        <p>{status}</p>
    </div>
</div>

<style lang="postcss">
    .signature-button {
        @apply bg-white p-2 h-8;
    }
</style>