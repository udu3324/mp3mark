<script>
    import emptyEditor from '$lib/assets/editor_empty.png'
    import topBar from '$lib/assets/editor_top_bar.png'
    import bottomBar from '$lib/assets/editor_bottom_bar.png'
</script>

<div>
    <div class="doc-heading-1">Editor / How to Use</div>
    <img class="doc-img" src={emptyEditor} alt="screenshot of mp3mark's editor right after importing">
    <p>The editor is designed to feel like a DAW (digital audio workstation) to easily integrate to your previous workflow, but also is simplistic for newcomers. It is not optimized for mobile devices</p>

    <div class="doc-heading-2">Top Tool-Bar</div>
    <img class="doc-img" src={topBar} alt="screenshot of the editor top bar">
    <p>This part of the editor gives you the current time of the audio being played. There is a menu bar on the left to allow quick actions in the editor.</p>

    <div class="doc-heading-2">Bottom Tool-Bar</div>
    <img class="doc-img" src={bottomBar} alt="screenshot of the editor top bottom">
    <div class="doc-heading-3">Dark Mode</div>
    <p>Press this button to toggle the appearance of mp3mark.</p>
    <div class="doc-heading-3">Playhead Snapping</div>
    <p>Press this button (or press s) to snap the playhead to the center of the screen. Creating a mark or flag will unsnap the playhead. </p>
    <div class="doc-heading-3">Play Button</div>
    <p>Press the space bar to pause or play audio.</p>
    <div class="doc-heading-3">Pause Button</div>
    <p>Press this button once to pause the audio, or double click it to reset the playhead to the start of the audio.</p>
    <div class="doc-heading-3">Volume Control</div>
    <p>Use the slider to change the volume of the audio. The button on the left of the slider mutes the volume while the right button makes it full volume.</p>
</div>