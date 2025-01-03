<script>
    import { page } from "$app/stores"; 

    import Footer from '../Footer.svelte'
    import PageNavBar from './PageNavBar.svelte';

	import Intro from "./Intro.svelte";
	import Test from "./Test.svelte";
	import PageButtons from "./PageButtons.svelte";
	import Layout from "./Layout.svelte";
	import Tracks from "./Tracks.svelte";
	import Tools from "./Tools.svelte";
	import Import from "./Import.svelte";

    let innerWidth
    let pageDiv

    $: pg = $page.url.searchParams.get("pg")

    $: {
        //reset scroll when going to the next page
        if (pageDiv && pg) {
            pageDiv.scrollTop = 0
        }
    }

    let pageMarginL = "ml-40"

    //responsiveness for mobile devices
    $: {
        if (innerWidth < 480) {
            pageMarginL = ""
        } else {
            pageMarginL = "ml-40"
        }
    }

</script>

<div bind:clientWidth={innerWidth} class="w-screen min-h-screen bg-white">
    <PageNavBar bind:innerWidth={innerWidth}/>
    <div bind:this={pageDiv} class="{pageMarginL} md:ml-56 px-10 pt-3 pb-10 h-screen overflow-y-auto">
        {#if pg === "intro"}
            <Intro/>
            <PageButtons back="docs" next="import"/>
        {:else if pg === "import"}
            <Import/>
            <PageButtons back="intro" next="layout"/>
        {:else if pg === "layout"}
            <Layout/>
            <PageButtons back="import" next="tracks"/>
        {:else if pg === "tracks"}
            <Tracks/>
            <PageButtons back="layout" next="tools"/>
        {:else if pg === "tools"}
            <Tools/>
            <PageButtons back="tracks"/>
        {:else if pg === "test"}
            <Test/>
            <PageButtons back="docs"/>
        {:else}
            <div class="doc-heading-1">Home / Welcome to the Documentation</div>
            <p>To view all the documentation for mp3mark, use the navigation bar on the right.</p>
            <br>
            <p>Alternatively, you can use the navigation buttons on the bottom of this page to go to the next one.</p>
            <div class="doc-heading-2">If you haven't noticed</div>
            <p>Inspiration was taken from <a class="underline text-blue-500" href="https://readthedocs.com" target="_blank" rel="noreferrer nofollow">ReadtheDocs</a> while creating these docs. Please use their services if you need to create any documentation for your project.</p>
            <PageButtons next="intro"/>
        {/if}
    </div>
</div>

<Footer/>

<style lang="postcss">
    
</style>