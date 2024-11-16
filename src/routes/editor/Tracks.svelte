<script>
	import { faCirclePlus, faFileWaveform } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

</script>

<div class="pt-12 pb-16">
    <div class="flex flex-row h-28">
        <div class="fixed z-10 h-28 w-28 basis-28 bg-slate-500 text-6xl place-items-center place-content-center">
            <Fa icon={faFileWaveform}/>
        </div>
        <div class="pl-28 grow h-full bg-slate-300">
            <div id="editor-viewer">
                
            </div>
        </div>
    </div>
</div>