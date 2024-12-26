<script>
    import { page } from "$app/stores"; 

    import Footer from '../Footer.svelte'
    import PageNavBar from './PageNavBar.svelte';

	import Intro from "./Intro.svelte";
	import Test from "./Test.svelte";
	import PageButtons from "./PageButtons.svelte";

    $: pg = $page.url.searchParams.get("pg")

    $: {
        console.log("page changed to", pg)
    }

</script>

<div class="w-screen min-h-screen bg-white">
    <PageNavBar/>
    <div class="ml-56 px-10 pt-3 pb-10 h-screen overflow-y-auto">
        {#if pg === "intro"}
        <Intro/>
        <PageButtons back="docs"/>
        {:else if pg === "test"}
        <Test/>
        <PageButtons back="docs"/>
        {:else}
        <div class="doc-heading-1">Welcome to the Documentation</div>
        <p>To view all the documentation for mp3mark, use the navigation bar on the right.</p>
        <br>
        <p>Alternatively, you can use the navigation buttons on the bottom of this page to go to the next one.</p>
        <div class="doc-heading-2">If you haven't noticed</div>
        <p>I took a lot if inspiration from <a class="underline text-blue-500" href="https://readthedocs.com" target="_blank" rel="noreferrer nofollow">readthedocs</a> while creating my own version of my documentation. Please use their services if you need to create any documentation for your project.</p>
        <PageButtons next="intro"/>
        {/if}
    </div>
</div>

<Footer/>

<style lang="postcss">
    
</style>