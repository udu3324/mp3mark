<script>
    export let hidden
    // biome-ignore lint/style/useConst: <explanation>
    export let data = ""

    let unformatted = ""
    let formatted = ""

    $: {
        //console.log("showing info div", hidden)
        unformatted = ""

        if (data.timelineData !== undefined) {
            unformatted += `id: ${data.id}\n\n`

            unformatted += `project_name: ${data.projectName}\n`
            unformatted += `file_name: ${data.fileName}\n\n`

            unformatted += `length: ${data.length} seconds\n`
            unformatted += `volume: ${data.volume}/1.00\n\n`

            unformatted += `beat: ${data.timeSignatureBeat}\n`
            unformatted += `note: ${data.timeSignatureNote}\n`
            unformatted += `bpm: ${data.bpm}\n\n`

            unformatted += `tracks: ${data.timelineData.length} \n`
            for (let i = 0; i < data.timelineData.length; i++) {
                unformatted += `\n--- track ${i}: ${data.timelineData[i][0]}\n`
                unformatted += `color: ${data.timelineData[i][1]}\n`

                
                if (data.timelineData[i][2] !== undefined) {
                    unformatted += `- marks: ${data.timelineData[i][2].length}\n`

                    for (let m = 0; m < data.timelineData[i][2].length; m++) {
                        unformatted += `[${data.timelineData[i][2][m].join(', ')}]\n`
                    }
                } else {
                    unformatted += "- marks: 0\n"
                }

                if (data.timelineData[i][3] !== undefined) {
                    unformatted += `- flags: ${data.timelineData[i][3].length}\n`

                    for (let f = 0; f < data.timelineData[i][3].length; f++) {
                        unformatted += `[${data.timelineData[i][3][f].join(', ')}]\n`
                    }
                } else {
                    unformatted += "- flags: 0\n"
                }
            }
        }

        formatted = unformatted.replaceAll("\n", "<br>")
    }

    //ty https://stackoverflow.com/a/30810322
    function copy() {
        navigator.clipboard.writeText(unformatted).then(() => {
            alert("sucessfully copied project info to clipboard")
        }).catch(() => {
            alert("couldn't copy project info to clipboard!")
        })
    }
</script>

<div class="{hidden} w-screen bg-[#a1a5ae] dark:text-white">
    <div class="fixed grid h-screen w-screen place-content-center z-50 backdrop-blur-sm">
       <div class="bg-white dark:bg-slate-600 p-4 shadow-lg w-96">
          <div class="border-x border-t dark:border-slate-900  w-full bg-gray-200 dark:bg-slate-800">Project Info.txt</div>
 
          <div class="dark:bg-slate-700 flex flex-col w-full h-56 overflow-y-auto border dark:border-slate-900">
             <span>{@html formatted}</span>
          </div>
          
          <button on:click={copy} class="btn">copy to clipboard</button>
          <button on:click={() => {hidden = "hidden"}} class="btn">close</button>
       </div>
    </div>
</div>

<style lang="postcss">
    .btn {
        @apply w-full bg-white dark:bg-slate-800 hover:bg-gray-400 dark:hover:bg-slate-900 border-x border-b dark:border-slate-900;
    }
</style>