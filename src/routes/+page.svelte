<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
	import Loader from "./editor/Loader.svelte";
    import Import from "./Import.svelte";

    let importVisible = "hidden"
    let inputFileName = ""

    let files
    let fileInput

    $: {
        if (files !== undefined) {
            console.log("files", files)
            console.log("file", files[0])
            
            inputFileName = files[0].name
            importVisible = ""
        }
    }

    function select() {
        fileInput.click()
    }

    const updateLoadProjectID = async () => {
        try {
            await db.load.clear();

            await db.load.add({ projectID: projectID });

            goto("/editor")
        } catch (error) {
            console.error('Error updating project ID:', error);
        }
    };
    
    let projectID = -1
    let hideLoader = true
    let hiddenClass = "hidden"

    $: {
        if (!hideLoader) {
            console.log("showing loader")
            hiddenClass = ""
        }
    }

    $: {
        if (projectID !== -1) {
            console.log("the project id loaded is", projectID)
            updateLoadProjectID()
        }
    }

</script>

<Import bind:files={files} bind:visible={importVisible} bind:fileName={inputFileName}/>

<div class="p-3 bg-white">
    <b>mp3mark</b>
    <p>A website that lets you easily annotate/mark up audio.</p>

    <input id="fileInput" bind:this={fileInput} bind:files class="hidden"  type="file" name="file" accept="audio/mp3, audio/flac, audio/wav">
    <br>
    <button class="p-3 bg-green-300" onclick={select}>Import</button>
</div>
<div class="p-3 bg-white {hiddenClass}">
    <Loader bind:empty={hideLoader} bind:loadingID={projectID}/>
</div>

<style lang="postcss">
    
</style>