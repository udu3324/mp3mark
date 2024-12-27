<script>
    import options from '$lib/assets/import_options.png'
</script>

<div>
    <div class="doc-heading-1">Import / How to Import</div>
    <img class="doc-img" src={options} alt="the import options after a file is selected">
    <p>mp3mark accepts mp3, flac, and wav files. Keep in mind that extra heavy files (>10MB) could slow down playback and add a slight delay.</p>
    
    <div class="doc-heading-2">Project Name</div>
    <p>Set your project name between 1-22 characters. It will help identify the project in the Project Manager.</p>
    <div class="doc-heading-2">BPM (beats per minute)</div>
    <p><span class="bold underline">Make sure you set your BPM accurately</span> to have the guide marks line up with the transients in the audio. This is crutial to line up the marks/flags in the editor. If the BPM is unknown, set it to a value between 200-400 to get a high resolution for creating marks/flags.</p>
    <div class="doc-heading-2">Time Signature</div>
    <p>To devide the audio up correctly, a <a class="underline text-blue-500" href="https://en.wikipedia.org/wiki/Time_signature" target="_blank" rel="noreferrer nofollow">time signature</a> has to be set. Most audio is in 4/4 which can be left unchanged.</p>
    <br>
    <div class="doc-heading-3">Privacy</div>
    <p>All files imported are stored on your device and are not transfered anywhere unless stated. Project data and audio are stored in indexedDB.</p>
    <div class="doc-heading-3">Copyright</div>
    <p>Audio that is copyrighted and imported onto mp3mark are not to be used in illegitimate ways but only for learning/educational purposes of analysing it. (fair use) The end user is solely responsible for complying with local copyright laws and the developer is not responsible for misuse. </p>
</div>