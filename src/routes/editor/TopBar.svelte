<script>
   import { currentTime } from "$lib/editor"
   import { goto } from '$app/navigation'
	import Fa from "svelte-fa";
	import { faDoorOpen, faDownload, faFilePen } from "@fortawesome/free-solid-svg-icons";
	import { faGithub } from "@fortawesome/free-brands-svg-icons";

   export let title
   export let editorData

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

   let dataDiv = "hidden"

   let projectID = ""
   let projectName = ""
   let fileName = ""
   let length = 0
   let timeSignatureBeat = ""
   let timeSignatureNote = ""
   let bpm = ""
   

   function info() {
      closeAll()
      dataDiv = ""

      projectID = editorData.id
      projectName = editorData.projectName
      fileName = editorData.fileName
      length = editorData.length
      timeSignatureBeat = editorData.timeSignatureBeat
      timeSignatureNote = editorData.timeSignatureNote
      bpm = editorData.bpm
   }

   function back() {
      closeAll()
      goto("/")
   }

   function github() {
      closeAll()
      window.open("https://github.com/udu3324/mp3mark", "_blank")
   }

   let fileMenu = "hidden"
   let helpMenu = "hidden"
   let githubMenu = "hidden"

   function toggleFileMenu() {
      fileMenu = fileMenu === "hidden" ? "" : "hidden";
      helpMenu = "hidden"
      githubMenu = "hidden"
   }

   function toggleHelpMenu() {
      fileMenu = "hidden"
      helpMenu = helpMenu === "" ? "hidden" : "";
      githubMenu = "hidden"
   }

   function toggleGithubMenu() {
      fileMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = githubMenu === "" ? "hidden" : "";
   }

   function closeAll() {
      fileMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = "hidden"
   }
</script>

<div class="{dataDiv} w-screen bg-[#a1a5ae]">
   <div class="fixed grid h-screen w-screen place-content-center z-50 backdrop-blur-sm">
      <div class="bg-white p-4 shadow-lg w-96">
         <div class="border-x border-t w-full bg-gray-200">Project Info.txt</div>

         <div class="flex flex-col w-full h-56 overflow-y-auto border">
            <span>id: {projectID}</span>
            <br>
            <span>project name: {projectName}</span>
            <span>file name: {fileName}</span>
            <br>
            <span>length: {length} seconds</span>
            <br>
            <span>beat: {timeSignatureBeat}</span>
            <span>note: {timeSignatureNote}</span>
            <span>bpm: {bpm}</span>
         </div>
         
         <button class="w-full bg-white hover:bg-gray-400 border-x border-b">copy to clipboard</button>
         <button on:click={dataDiv = "hidden"} class="w-full bg-white hover:bg-gray-400 border-x border-b">close</button>
      </div>
   </div>
</div>

<div class="fixed z-20 w-screen h-12 bg-slate-400 grid grid-cols-3">
    <div class="pr-auto place-items-start">
      <h1>mp3mark proj - {title}</h1>
      <div class="flex ml-1">
         <div>
            <button on:click={toggleFileMenu} class="button-menu">File</button>
            <div class="{fileMenu} fixed bg-white w-48 divide-y py-1 rounded-b-lg rounded-tr-lg border shadow-lg">
               <div>
                  <!-- <button class="button-in-menu"><Fa class="w-5 mr-2" icon={faFileImport}/> Import Project...</button> -->
                  <button on:click={info} class="button-in-menu"><Fa class="w-5 mr-2" icon={faFilePen}/> Project Info</button>
                  <button class="button-in-menu"><Fa class="w-5 mr-2" icon={faDownload}/> Export As...</button>
               </div>
               <button on:click={back} class="button-in-menu"><Fa class="w-5 mr-2" icon={faDoorOpen}/> Exit</button>
            </div>
         </div>
         <div>
            <button on:click={toggleHelpMenu} class="button-menu">Help</button>
            <div class="{helpMenu} fixed">this is the help menu</div>
         </div>
         <div>
            <button on:click={toggleGithubMenu} class="button-menu">Github</button>
            <div class="{githubMenu} fixed bg-amber-500 w-48 divide-y divide-amber-600 pb-1 rounded-b-lg rounded-tr-lg text-amber-950 border border-amber-600 shadow-lg">
               <div class="p-1">
                  <span>mp3mark is a open source project.</span>
               </div>

               <button on:click={github} class="button-in-menu"><Fa class="w-5 mr-2" icon={faGithub}/> Source Code</button>
            </div>
         </div>
      </div>
    </div>
    <div class="place-self-center bg-gray-300 w-32 text-3xl h-full p-1 place-items-center">
       <p>{time}</p> 
    </div>
    <div class="place-items-end">
      <h1>udu3324</h1> 
    </div>
</div>

<style lang="postcss">
   .button-menu {
      @apply px-1 hover:bg-slate-600;
   }

   .button-in-menu {
      @apply hover:bg-gray-300 text-left p-1 pl-2 w-full flex items-center;
   }
</style>