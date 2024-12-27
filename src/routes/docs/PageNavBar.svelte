<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let navDiv

    $: pg = $page.url.searchParams.get("pg")

    $: {
        if (navDiv) {
            const button = navDiv.querySelector(`.${pg}`)

            if (button) {
                removeAllHighlights()
                button.classList.add('bg-slate-600')
            }
        }
    }

    function removeAllHighlights() {
        // biome-ignore lint/complexity/noForEach: <explanation>
        navDiv.querySelectorAll('*').forEach(element => {
            element.classList.remove('bg-slate-600')
        })
    }

    function home() {
        removeAllHighlights()
        goto("/docs")
    }
</script>

<div class="fixed h-screen w-56 pb-6 bg-slate-700 text-white">
    <button on:click={home} class="p-3 bg-sky-400 w-full hover:bg-sky-500">
        <span class="text-3xl">mp3mark <span class="italic">docs</span></span>
    </button>
    <div bind:this={navDiv}>
        <div class="nav-title">
            <span>Intro</span>
        </div>
        <button on:click={() => goto("/docs?pg=intro")} class="nav-btn intro">What is mp3mark?</button>
        <div class="nav-title">
            <span>Import</span>
        </div>
        <button on:click={() => goto("/docs?pg=import")} class="nav-btn import">How to Import</button>
        <div class="nav-title">
            <span>Editor</span>
        </div>
        <button on:click={() => goto("/docs?pg=layout")} class="nav-btn layout">How to Use</button>
        <button on:click={() => goto("/docs?pg=tracks")} class="nav-btn tracks">Tracks</button>
        <button on:click={() => goto("/docs?pg=tools")} class="nav-btn tools">Annotation Tools</button>
    </div>
</div>

<style lang="postcss">
    .nav-title {
        @apply px-3 pt-3 text-slate-300 font-semibold text-lg;
    }
    .nav-btn {
        @apply px-3 py-1 w-full text-left hover:bg-slate-600;
    }
</style>