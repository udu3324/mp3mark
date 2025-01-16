<script>
	import { faMoon } from "@fortawesome/free-solid-svg-icons";
    import { darkMode } from "$lib/db"
	import Fa from "svelte-fa";

    function open() {
        window.open("https://github.com/udu3324/mp3mark", "_blank")
    }

    function toggleDarkMode() {        
        darkMode.set(!$darkMode)
    }
</script>

<div class="fixed bottom-0 w-screen h-6 z-20 bg-slate-900 text-white text-center select-none">
    <button on:click={toggleDarkMode} class="dark-button"><Fa icon={faMoon}/></button>
    <span class="fixed px-1 left-6">udu3324</span>

    <span>Built with ❤️ using Svelte. </span>

    <button on:click={open} class="fixed right-0 px-1">Source Code</button>
</div>

<style lang="postcss">
    .dark-button {
        @apply absolute h-6 w-6 bg-slate-800 dark:bg-slate-700 grid place-content-center place-items-center hover:bg-slate-700;
    }

    .dark-button:active {
        @apply bg-slate-600;
    }
</style>