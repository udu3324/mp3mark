<script>
    import { goto } from "$app/navigation";
    
    export let back
    export let next

    let hiddenBack = "hidden"
    let hiddenNext = "hidden"
    
    if (back) {
        hiddenBack = ""
    }

    if (next) {
        hiddenNext = ""
    }

    function goBack() {
        if (back === "docs") {
            goto("/docs")
        } else {
            goto(`/docs?pg=${back}`)
        }
    }

    function goNext() {
        goto(`/docs?pg=${next}`)
    }
</script>

<div class="w-full grid grid-cols-2 mt-6 pt-4 border-t">
    <div>
        <button on:click={goBack} class="{hiddenBack} btn w-16">Back</button>
    </div>
    <div class="ml-auto">
        <button on:click={goNext} class="{hiddenNext} btn w-[7rem]">Next Page</button>
    </div>
</div>

<style lang="postcss">
    .btn {
        @apply p-1 text-slate-800 font-semibold bg-slate-300 hover:bg-slate-200 disabled:text-slate-200 border border-slate-400 rounded-sm;
    }
</style>