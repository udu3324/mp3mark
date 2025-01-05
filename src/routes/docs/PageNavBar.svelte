<script>
    import Fa from "svelte-fa"
	import { faBookmark, faHome, faTools } from "@fortawesome/free-solid-svg-icons";

    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let navDiv

    $: pg = $page.url.searchParams.get("pg")

    //highlight page button indication
    $: {
        if (navDiv) {
            const button = navDiv.querySelector(`.${pg}`)

            if (button) {
                removeAllHighlights()
                button.classList.add('bg-slate-600')
            }
        }
    }

    // biome-ignore lint/style/useConst: <explanation>
    export let innerWidth = 0
    let navHidden = ""
    let btnMarginL = ""

    $: {
        if (innerWidth < 480) {
            navHidden = "hidden"
        } else {
            navHidden = ""
        }
    }

    function toggleNav() {
        if (navHidden === "hidden") {
            navHidden = ""
            btnMarginL = "ml-40"
        } else {
            navHidden = "hidden"
            btnMarginL = ""
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

<div class="{btnMarginL} fixed z-10 top-0">
    <button on:click={toggleNav} class="w-8 h-10 bg-sky-400 text-sky-100 rounded-r-full grid place-items-center place-content-center">
        <Fa icon={faBookmark}/>
    </button>
</div>

<div class="{navHidden} z-20 fixed h-screen w-40 md:w-56 pb-6 bg-slate-700 dark:bg-slate-800 text-white">
    <button on:click={home} class="p-3 bg-sky-400 w-full hover:bg-sky-500">
        <span class="text-xl md:text-3xl">mp3mark <span class="italic">docs</span></span>
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

        <div class="absolute bottom-0 left-0 px-3 pb-9 md:flex w-full">
            <button on:click={() => goto("/")} class="nav-back mr-3 mb-3 md:mb-0"><Fa class="pr-2" icon={faHome}/> Home</button>
            <button on:click={() => goto("/editor")} class="nav-back"><Fa class="pr-2" icon={faTools}/> Editor</button>
        </div>
    </div>
</div>

<style lang="postcss">
    .nav-title {
        @apply px-3 pt-3 text-slate-300 font-semibold text-lg;
    }
    .nav-btn {
        @apply px-3 py-1 w-full text-left hover:bg-slate-600;
    }

    .nav-back {
        @apply p-3 bg-slate-800 hover:bg-slate-600 dark:bg-slate-900 dark:hover:bg-slate-700 flex place-items-center w-full;
    }
</style>