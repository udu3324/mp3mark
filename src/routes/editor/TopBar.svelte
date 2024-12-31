<script>
   import { currentTime } from "$lib/editor"
   import { goto } from '$app/navigation'
	import Fa from "svelte-fa";
	import { faBook, faBug, faChartGantt, faCodePullRequest, faDoorOpen, faDownload, faFilePen, faHammer, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
	import { faGithub, faSlack } from "@fortawesome/free-brands-svg-icons";
	import ProjectInfo from "./ProjectInfo.svelte";

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
   })

   let dataDiv = "hidden"

   function info() {
      closeAll()
      dataDiv = ""
   }

   function exportProject() {
      closeAll()

      const json = JSON.stringify(editorData, null, 4)

      const element = document.createElement('a')
      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`)

      const filteredName = editorData.projectName.replace(/ /g,'_').replace(/[^a-zA-Z0-9]/g, "")

      element.setAttribute('download', `${filteredName}-export.mp3mark`)
      
      element.style.display = 'none'
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
      
      alert("exported project sucessfully. please keep the audio file to import with in the future.")
   }

   function back() {
      closeAll()
      goto("/")
   }

   function docs(pg) {
      closeAll()
      if (pg === "docs") {
         window.open("/docs", "_blank")
      } else {
         window.open(`/docs?pg=${pg}`, "_blank")
      }
   }

   function github() {
      closeAll()
      window.open("https://github.com/udu3324/mp3mark", "_blank")
   }

   function issues() {
      closeAll()
      window.open("https://github.com/udu3324/mp3mark/issues", "_blank")
   }

   function pull() {
      closeAll()
      window.open("https://github.com/udu3324/mp3mark/compare", "_blank")
   }

   function slack() {
      closeAll()
      window.open("https://hackclub.slack.com/app_redirect?channel=U07L463K2R3", "_blank")
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

   //keybind menus
   function onKeyDown(e) {
      if (document.activeElement.tagName === "INPUT") {
         return
      }

      if (e.key === "f") {
         toggleFileMenu()
      }

      if (e.key === "h") {
         toggleHelpMenu()
      }

      if (e.key === "g") {
         toggleGithubMenu()
      }
   }

   //close menus if user clicked out of them
   function onMouseDown(e) {
      //ty https://stackoverflow.com/a/8729274
      //get list of parent elements
      let element = e.target
      const list = []
      while (element) {
         list.unshift(element)
         element = element.parentNode
      }
      
      //check if any parents had a whitelisted div
      let insideMenu = false
      for (let i = 0; i < list.length; i++) {
         if (list[i].id === "whitelisted") {
            insideMenu = true
         }
      }

      //close if it didnt
      if (!insideMenu) {
         closeAll()
      }
   }
</script>

<svelte:window on:keydown={onKeyDown} on:mousedown={onMouseDown}/>

<ProjectInfo bind:data={editorData} bind:hidden={dataDiv}/>

<div class="fixed z-40 w-screen h-12 bg-slate-400 grid grid-cols-3">
    <div class="pr-auto place-items-start select-none text-gray-800">
      <h1>mp3mark - {title}</h1>

      <div id="whitelisted" class="flex">
         <div>
            <button on:click={toggleFileMenu} class="button-menu hover:bg-slate-300"><u>F</u>ile</button>
            <div class="{fileMenu} fixed bg-white text-gray-800 w-48 divide-y py-1 rounded-b-lg rounded-tr-lg border shadow-lg">
               <div>
                  <!-- <button class="button-in-menu"><Fa class="w-5 mr-2" icon={faFileImport}/> Import Project...</button> -->
                  <button on:click={info} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faFilePen}/> Project Info</button>
                  <button on:click={exportProject} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faDownload}/> Export File</button>
               </div>
               <button on:click={back} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faDoorOpen}/> Exit</button>
            </div>
         </div>
         <div>
            <button on:click={toggleHelpMenu} class="button-menu hover:bg-sky-300"><u>H</u>elp</button>
            <div class="{helpMenu} fixed bg-sky-400 w-48 divide-y py-1 divide-sky-500 pb-1 rounded-b-lg rounded-tr-lg text-white border border-sky-500 shadow-lg">
               <div>
                  <button on:click={() => docs("layout")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faPenToSquare}/> Editor</button>
                  <button on:click={() => docs("tracks")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faChartGantt}/> Tracks</button>
                  <button on:click={() => docs("tools")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faHammer}/> Tools</button>
               </div>
               <button on:click={() => docs("docs")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faBook}/> Documentation</button>
               <button on:click={slack} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faSlack}/>Slack Message</button>
            </div>
         </div>
         <div>
            <button on:click={toggleGithubMenu} class="button-menu hover:bg-amber-300"><u>G</u>ithub</button>
            <div class="{githubMenu} fixed bg-amber-500 w-48 divide-y divide-amber-600 pb-1 rounded-b-lg rounded-tr-lg text-amber-950 border border-amber-600 shadow-lg">
               <div class="p-1">
                  <span>mp3mark is a open source project. please star it!</span>
               </div>

               <button on:click={github} class="button-in-menu hover:bg-amber-400"><Fa class="w-5 mr-2" icon={faGithub}/> Source Code</button>
               <div>
                  <button on:click={issues} class="button-in-menu hover:bg-amber-400"><Fa class="w-5 mr-2" icon={faBug}/> Report Bugs</button>
                  <button on:click={pull} class="button-in-menu hover:bg-amber-400"><Fa class="w-5 mr-2" icon={faCodePullRequest}/> Contribute</button>
               </div>
            </div>
         </div>
      </div>
    </div>
    <div class="place-self-center bg-gray-100 w-32 text-3xl h-full p-1 grid place-items-center">
       <p>{time}</p> 
    </div>
    <div class="place-items-end">
      
    </div>
</div>

<style lang="postcss">
   .button-menu {
      @apply px-1;
   }

   .button-in-menu {
      @apply text-left p-1 pl-2 w-full flex items-center;
   }
</style>