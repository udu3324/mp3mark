<script>
    import { goto } from "$app/navigation";
</script>

<div class="fixed h-screen w-56 pb-6 bg-slate-700 text-white">
    <button on:click={() => goto("/docs")} class="p-3 bg-sky-400 w-full hover:bg-sky-500">
        <span class="text-3xl">mp3mark <span class="italic">docs</span></span>
    </button>
    <div>
        <div class="px-3 pt-3 text-slate-300 font-semibold text-lg">
            <span>Intro</span>
        </div>
        <button on:click={() => {goto("/docs?pg=intro")}} class="nav-btn">What is mp3mark?</button>
    </div>
</div>

<style lang="postcss">
    .nav-btn {
        @apply px-3 py-1 w-full text-left hover:bg-slate-600;
    }
</style>