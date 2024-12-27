<script>
    import twoTracks from '$lib/assets/editor_empty_highlited_tracks.png'
    import emptyTracks from '$lib/assets/tracks_empty.png'
    import trackCreation from '$lib/assets/editor_track_creation.png'
</script>

<div>
    <div class="doc-heading-1">Editor / Tracks</div>
    <img class="doc-img" src={twoTracks} alt="screenshot of the editor's starting two tracks">
    <p>Upon entering a newly imported project, only two tracks will be present in the editor.</p>

    <div class="doc-heading-2">Visualizer Track (first)</div>
    <p>This track visualizes the audio imported and allows you to move the playhead to be listened to.</p>

    <div class="doc-heading-2">Creation Track (last)</div>
    <p>This track creates analysis tracks for you to mark and flag the audio. You can select between certain track types to categorize your analysis.</p>
    <img class="doc-img mt-3" src={trackCreation} alt="screenshot of the menu that pops up when creating tracks">
    <p>Once created, the tracks will show up between the two tracks and will let you create marks/flags. It will also have lines to seperate each beat in the audio to help guide audio analysis. It is also dependent on the BPM set while importing.</p>
    <img class="doc-img mt-3" src={emptyTracks} alt="screenshot of two tracks that were added to the editor">
</div>