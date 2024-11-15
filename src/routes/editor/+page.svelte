<script>
    import { db } from "../../lib/db.js"
	import BottomBar from "./BottomBar.svelte";
	import TopBar from "./TopBar.svelte";
	import Tracks from "./Tracks.svelte";

    let time = "devtime"
    let playing = false
    
</script>

<div class="w-screen h-screen bg-[#a1a5ae]">
    <TopBar bind:time={time}/>
    <Tracks/>

    this is the editor page
    <BottomBar bind:playing={playing}/>
</div>

<style lang="postcss">

</style>