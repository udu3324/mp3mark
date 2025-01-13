<script>
    import { db } from "$lib/db.js"
    import { onMount } from "svelte";

    export let loading = false
    export let empty = true
    export let loadingID = -1

    let id = -1
    export let dataTable

    function setLoad(id) {
        loadingID = id
    }

    onMount(() => {
        loading = true
        console.log("loading")
        db.load.orderBy("projectID").first(project => {
            id = project.projectID

            db.editor.toArray().then(data => {
                console.log("loaded data for loader")
                dataTable = data
                empty = false
                loading = false
            })
        }).catch((error) => {
            loading = false
        })
    })
</script>

<div class="bg-slate-400 text-white rounded-md">
    <div class="bg-slate-800 p-2 text-center text-lg rounded-t-md">
        <span>Project Manager</span>
    </div>
    <div class="min-h-48 max-h-80 overflow-y-auto">
        <table class="table-auto w-full">
            <thead>
                <tr class="bg-slate-700 dark:bg-slate-800">
                    <th class="i text-left">#</th>
                    <th class="name text-left">Project Name</th>
                    <th class="file text-left">Imported File</th>
                    <th class="tracks text-left">Tracks</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-700 dark:divide-slate-800">
                {#each dataTable as data}
                    <tr on:click={() => setLoad(data.id)} class="bg-slate-500 dark:bg-slate-600 cursor-pointer hover:bg-slate-600 dark:hover:bg-slate-500">
                        {#if id === data.id}
                            <td class="i"><b>{data.id}</b></td>
                            <td class="name"><b>{data.projectName}</b></td>
                            <td class="file italic"><b>{data.fileName}</b></td>
                            <td class="tracks"><b>{data.timelineData.length}</b></td>
                        {:else}
                            <td class="i">{data.id}</td>
                            <td class="name">{data.projectName}</td>
                            <td class="file italic">{data.fileName}</td>
                            <td class="tracks">{data.timelineData.length}</td>
                        {/if}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="bg-slate-700 dark:bg-slate-800 p-2 text-center text-sm rounded-b-md">
        <p>Click on any project to load. (recent projects are marked bold)</p>
    </div>
</div>

<style lang="postcss">
    .i {
        @apply select-none p-2 pl-8 pr-3;
    }

    .name {
        @apply select-none p-2 pr-3;
    }

    .file {
        @apply select-none p-2 pr-3;
    }

    .tracks {
        @apply select-none p-2 pr-8;
    }
</style>