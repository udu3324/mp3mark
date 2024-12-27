<script>
    import analysisWindow from '$lib/assets/editor_analysis_window.png'
    import createFlag from '$lib/assets/editor_creating_flag.png'
    import createMark from '$lib/assets/editor_creating_mark.png'
</script>

<div>
    <div class="doc-heading-1">Editor / Annotation Tools</div>
    <img class="doc-img" src={analysisWindow} alt="screenshot of user in editor on the annotation tool window">
    <p>A mark or flag can be created by clicking anywhere in a track that was made. It will be put at the exact beat that you clicked on</p>

    <div class="doc-heading-3">Setting the Note</div>
    <p>It is not required to set a note for a mark or flag, but can't be modified once placed.</p>

    <div class="doc-heading-2">Marks</div>
    <p>Marks can cover areas of audio. They can be changed in size and removed if needed.</p>
    <img class="doc-img" src={createMark} alt="screenshot of user creating a mark">

    <div class="doc-heading-2">Flags</div>
    <p>Flags are put on certain parts of the audio to specify one thing. They fit to one beat and can be moved anywhere in the track.</p>
    <img class="doc-img" src={createFlag} alt="screenshot of user creating a flag">
</div>