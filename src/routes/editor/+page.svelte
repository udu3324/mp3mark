<script>
    import { db } from "../../lib/db.js"
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";

    let time = "devtime"
</script>

<div class="w-screen h-screen bg-[#a1a5ae]">
    <TopBar bind:time={time}/>
    <Tracks/>
    this is the editor page
</div>

<style lang="postcss">

</style>