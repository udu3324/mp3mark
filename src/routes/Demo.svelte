<script>
    import { goto } from '$app/navigation'
    import { db } from "$lib/db.js"
    import Fa from 'svelte-fa'
	import { faPenNib } from "@fortawesome/free-solid-svg-icons";
	import WaveSurfer from 'wavesurfer.js';

    import music from '$lib/assets/Lifeformed - Cider Time (CC BY-NC-SA 3.0).mp3'

    const trackData = [["section", "bg-amber-500", [[0, 32, "intro"], [32, 15, "main loop"], [224, 32, "repeated"]], []], ["percussion", "bg-rose-500", [[352, 64, "no drums"]], [[0, "muted_at_first"], [32, "loop_starts"]]], ["synth", "bg-emerald-500", [], [[0, "variation_1"], [64, "variation_1_but_more"], [96, "variation_2"], [160, "variation_3"], [128, "variation_2_repeat"], [416, "variation_1"]]], ["synth", "bg-emerald-500", [[163, 7, "long fx"], [172, 7, "long fx"], [122, 6, "stretched synth fx"]], [[188, ""], [196, ""], [204, ""], [212, ""], [180, "continued"], [288, "long_fx_added_back"], [220, "ending_one"], [96, "new_synth_sound"], [130, "echo_added_to_it"], [160, "new"]]], ["vocal", "bg-indigo-500", [], [[4, "This_track_is_made_by_lifeformed._Please_check_out_their_music on_Bandcamp!"], [45, "Try_dragging_and_adding_things_around!"]]], ["section", "bg-amber-500", [], []]]
    
    async function create() {
        const response = await fetch(music)
        const blob = await response.blob();

        //create wavesurfer object to pull audio length
        const wavesurfer = WaveSurfer.create({
            container: '#waveform'
        })

        await wavesurfer.loadBlob(blob)

        await db.editor.add({
            audio: blob,
            fileName: "(CC BY-NC-SA 3.0) Lifeformed - Cider Time.mp3", 
            projectName: "(demo) Lifeformed - Cider Time", 
            timeSignatureBeat: 4, 
            timeSignatureNote: 4,
            bpm: 150, 
            length: wavesurfer.getDuration(),
            timelineData: trackData,
            volume: 0.5
        })

        console.log("sucessfully imported demo project")
        await db.load.add({ projectID: 1 });

        goto("/editor")
    }
</script>

<div class="dark:text-white">
    <span>It looks like you haven't created a project yet. <br> <b>Try out the demo project!</b></span>
    <button on:click={create} class="btn bg-amber-500 hover:bg-amber-600 text-amber-100 mt-3"><Fa icon={faPenNib} class="pr-2"/>Demo Project</button>
    <span class="text-sm">Music by Lifeformed. Available at <a class="underline text-blue-500" href="https://lifeformed.bandcamp.com/album/fastfall" target="_blank" rel="noreferrer nofollow">https://lifeformed.bandcamp.com/album/fastfall</a></span>    
</div>

<style lang="postcss">
    .btn {
        @apply p-3 font-bold flex place-content-center place-items-center;
    }
</style>