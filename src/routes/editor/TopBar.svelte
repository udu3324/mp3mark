<script>
   import { currentTime } from "$lib/editor"
   import { goto } from '$app/navigation'

   export let title

   let time = "0:00.00"

   currentTime.subscribe((value) => {
      const minute = Math.floor(value / 60)
      const seconds = Math.round((value - minute * 60) * 100) / 100
      
      let sString = seconds.toString()

      //add back ms if no ms
      if (!sString.includes(".")) {
         sString = `${sString}.00`
      }

      //add a leading zero to the seconds
      if (sString.substring(0, sString.indexOf(".")).length < 2) {
         sString = `0${sString}`
      }

      //add a zero in the ms if theres no hundreths
      if (sString.substring(sString.indexOf(".") + 1).length < 2) {
         sString = `${sString}0`
      }

      time = `${minute}:${sString}`

      if (time.length < 7) {
         console.log("why", time)
      }
   })

   function back() {
      goto("/")
   }
</script>

<div class="fixed z-20 w-screen h-12 z-10 bg-[#7d818d] grid grid-cols-3">
    <div class="pr-auto place-items-start">
       <button on:click={back}><h1>mp3mark</h1></button> 
       <h1>project - {title}</h1>
    </div>
    <div class="place-self-center bg-gray-300 w-32 text-3xl h-full p-1 place-items-center">
       <p>{time}</p> 
    </div>
    <div class="place-items-end">
      <h1>udu3324</h1> 
    </div>
</div>