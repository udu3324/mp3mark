<script>
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
</script>

<Import bind:files={files} bind:visible={importVisible} bind:fileName={inputFileName}/>

<div class="p-3 bg-white">
    <b>mp3mark</b>
    <p>A website that lets you easily annotate/mark up audio.</p>

    <input id="fileInput" bind:this={fileInput} bind:files class="hidden"  type="file" name="file" accept="audio/mp3, audio/flac, audio/wav">
    <br>
    <button class="p-3 bg-green-300" onclick={select}>Import</button>
</div>

<style lang="postcss">
    
</style>