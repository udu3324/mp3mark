<script>
	import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

   export let time = "0:00.00"
</script>

<div class="fixed w-screen h-12 z-10 bg-[#7d818d] grid grid-cols-3">
    <div class="pr-auto place-items-start">
       <h1>mp3mark</h1> 
    </div>
    <div class="place-self-center bg-gray-300 w-32 text-3xl h-full p-1 place-items-center">
       <p>{time}</p> 
    </div>
    <div class="place-items-end">
      <h1>udu3324</h1> 
    </div>
</div>