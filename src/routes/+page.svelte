<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
	import Fa from 'svelte-fa';
	import Loader from "./editor/Loader.svelte";
	import Footer from './Footer.svelte';
    import Import from "./Import.svelte";
	import { faBook, faFileUpload } from '@fortawesome/free-solid-svg-icons';
	import Demo from './Demo.svelte';

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
    
    // biome-ignore lint/style/useConst: <explanation>
    let projectID = -1
    // biome-ignore lint/style/useConst: <explanation>
    let hideLoader = true
    // biome-ignore lint/style/useConst: <explanation>
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

<div class="w-auto min-h-screen bg-white dark:bg-slate-800">
    <div class="grid min-h-screen place-content-center">
        <div class="min-h-screen bg-slate-100 dark:bg-slate-700">
            <div class="p-3 w-fit dark:text-white">
                <b class="text-5xl">mp3mark</b>
                <p class="pt-2">A website that lets you easily annotate/mark up audio. It works best on desktop.™</p>
                
                <br>
        
                <input id="fileInput" bind:this={fileInput} bind:files class="hidden"  type="file" name="file" accept="audio/mp3, audio/flac, audio/wav, .mp3mark">
                <Import bind:files={files} bind:visible={importVisible} bind:fileName={inputFileName}/>
                
                <div class="{importButton} flex">
                    <button class="btn bg-green-500 hover:bg-green-600 text-green-100 mr-3" onclick={select}><Fa class="pr-2" icon={faFileUpload}/> Import</button>
                    <button onclick={() => goto("/docs")} class="btn bg-sky-500 hover:bg-sky-600 text-sky-100"><Fa class="pr-2" icon={faBook}/> Documentation</button>
                </div>
                <div class="{importButton} flex">
                    <span class="text-sm">*files are processed locally</span>
                </div>
            </div>
            <div class="px-3 pb-10 w-fit">
                <div class="{hiddenClass}">
                    <Loader bind:loading={loading} bind:empty={hideLoader} bind:loadingID={projectID}/>
                </div>
                {#if loading}
                    Currently loading project manager...
                {:else if !loading && hideLoader}
                     <div class="mt-2">
                        <Demo/>
                     </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<Footer/>

<style lang="postcss">
    .btn {
        @apply p-3 font-bold flex place-content-center place-items-center;
    }
</style>