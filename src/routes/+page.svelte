<script>
    let files
    let fileInput

    $: {
        console.log("files", files)
    }

    function select() {
        fileInput.click()
    }
</script>

<div>
    <b>mp3mark</b>
    <p>A website that lets you easily annotate/mark up audio.</p>

    <input id="fileInput" bind:this={fileInput} bind:files class="hidden"  type="file" name="file" accept="audio/mp3, audio/flac, audio/wav">
    <br>
    <button onclick={select}>Import</button>
</div>

<style lang="postcss">
    
</style>