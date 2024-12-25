<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
	import Loader from "./editor/Loader.svelte";
	import Footer from './Footer.svelte';
    import Import from "./Import.svelte";

    let importVisible = "hidden"
    let importButton = ""
    let inputFileName = ""

    let files
    let fileInput

    $: {
        if (files !== undefined) {
            console.log("files", files)
            console.log("file", files[0])
            
            inputFileName = files[0].name
            importVisible = ""
            importButton = "hidden"
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
    let loading = false
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

<svelte:head>
    <title>mp3mark</title> 
</svelte:head>

<div class="w-auto min-h-screen bg-white">
    <div class="p-3 w-fit">
        <b class="text-5xl">mp3mark</b>
        <p class="pt-2">A website that lets you easily annotate/mark up audio.</p>
    
        <input id="fileInput" bind:this={fileInput} bind:files class="hidden"  type="file" name="file" accept="audio/mp3, audio/flac, audio/wav">
        <br>
        <Import bind:files={files} bind:visible={importVisible} bind:fileName={inputFileName}/>
        <div class="{importButton}">
            <button class="p-3 bg-green-300 text-green-800 font-bold" onclick={select}>Import</button>
            <br>
            <span class="text-sm">*files are processed locally</span>
        </div>
    </div>
    <div class="pl-3 pb-10 w-fit">
        <div class="{hiddenClass}">
            <Loader bind:loading={loading} bind:empty={hideLoader} bind:loadingID={projectID}/>
        </div>
        {#if loading}
            Currently loading project manager...
        {:else}
            <!-- Demo Project //todo -->
        {/if}
    </div>
</div>

<Footer/>

<style lang="postcss">
    
</style>