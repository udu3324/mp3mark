<script>
   import { db, analysisEnterAction } from "$lib/db.js"
   import { currentTime } from "$lib/editor"
   import { goto } from '$app/navigation'
	import Fa from "svelte-fa";
	import { faBook, faBug, faChartGantt, faClock, faCodePullRequest, faCog, faDoorOpen, faDownload, faFilePen, faHammer, faHashtag, faHourglass, faHourglassEnd, faPenToSquare, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
	import { faGithub } from "@fortawesome/free-brands-svg-icons";
	import ProjectInfo from "./ProjectInfo.svelte";

   export let title
   export let editorData
   export let projectID

   // biome-ignore lint/style/useConst: <explanation>
   let innerWidth = 0
   let branding = "mp3mark - "
   let placeTime
   let time = "0:00.00"
   
   let configInput
   let configDiv = "hidden"
   let configLabel = ""
   let configDescription = ""
   let configValue = ""

   let fileMenu = "hidden"
   let configMenu = "hidden"
   let helpMenu = "hidden"
   let githubMenu = "hidden"

   let dataDiv = "hidden"

   //responsive navbar to remove/change certain elements
   $: {
      if (innerWidth < 650) {
         placeTime = "place-self-end mr-4"
      } else {
         placeTime = "place-self-center"
      }

      if (innerWidth < 450) {
         branding = ""
      } else {
         branding = "mp3mark - "
      }
   }

   //react to current time to update text, but also parse wavesurfer's floating values
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

   //filter config input by reacting to changes
   $: {
      //different filters based on config being config'd
      switch (configLabel) {
         case 'Project Name':
            if (configValue.length > 22) {
               configValue = configValue.substring(0, 22)
            }
            break
         case 'BPM (beats per minute)':
            configValue = configValue.replace(/[^0-9]/g, "")

            if (configValue.length > 3) {
               configValue = configValue.substring(0, 3)
            }
            break
         case 'Time Signature Beat':
            configValue = configValue.replace(/[^0-9]/g, "")

            if (configValue.length > 2) {
               configValue = configValue.substring(0, 2)
            }
            break
         case 'Time Signature Note':
            configValue = configValue.replace(/[^0-9]/g, "")

            if (configValue.length > 2) {
               configValue = configValue.substring(0, 2)
            }
            break
         case 'Default Enter Action':
            if (configValue.length > 4) {
               configValue = configValue.substring(0, 4)
            }
            break
      }
   }

   // file menu ----------------------------------------------------------------------------------
   function toggleFileMenu() {
      fileMenu = fileMenu === "hidden" ? "" : "hidden";
      configMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = "hidden"
   }

   function info() {
      closeAll()
      dataDiv = ""
   }

   function exportProject() {
      closeAll()

      const json = JSON.stringify(editorData, null, 4)
      const element = document.createElement('a')

      const filteredName = editorData.projectName.replace(/ /g,'_').replace(/[^a-zA-Z0-9]/g, "")

      element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(json)}`)
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

   // config menu ----------------------------------------------------------------------------------
   function toggleConfigMenu() {
      fileMenu = "hidden"
      configMenu = configMenu === "hidden" ? "" : "hidden";
      helpMenu = "hidden"
      githubMenu = "hidden"
   }

   function configName() {
      showConfig()

      configLabel = "Project Name"
      configDescription = "Set a project name between 1-22 characters."
      configValue = editorData.projectName
   }

   function configBPM() {
      showConfig()

      configLabel = "BPM (beats per minute)"
      configDescription = "Set a bpm between 1-900."
      configValue = editorData.bpm
   }

   function configTimeSignatureBeat() {
      showConfig()

      configLabel = "Time Signature Beat"
      configDescription = "Set a beat between 1-24."
      configValue = editorData.timeSignatureBeat
   }

   function configTimeSignatureNote() {
      showConfig()

      configLabel = "Time Signature Note"
      configDescription = "Set a note between 1-24."
      configValue = editorData.timeSignatureNote
   }

   function prefEnterAction() {
      showConfig()

      configLabel = "Default Enter Action"
      configDescription = "Set this between \"flag\" or \"mark\". This changes the action of pressing enter when creating an analysis object."
      configValue = $analysisEnterAction
   }

   function showConfig() {
      closeAll()

      configDiv = ""

      setTimeout(() => {
         configInput.focus()
         configInput.select()
      }, 15)
   }

   async function saveConfig() {
      //save config value to db but based on certain config setting to (shared div n stuff)
      switch (configLabel) {
         case 'Project Name':
            if (configValue.length < 1) {
               return alert("Set a project name!")
            }
            
            await db.editor.update(projectID, { projectName: configValue })

            alert("Sucessfully set project name!")
            location.reload()

            break
         case 'BPM (beats per minute)':
            if (configValue.length < 1) {
               return alert("Set a bpm!")
            }

            await db.editor.update(projectID, { bpm: Number.parseInt(configValue) })

            alert("Sucessfully set bpm!")
            location.reload()

            break
         case 'Time Signature Beat':
            if (configValue.length < 1) {
               return alert("Set a time signature!")
            }

            await db.editor.update(projectID, { timeSignatureBeat: configValue })

            alert("Sucessfully set time signature beat!")
            location.reload()

            break
         case 'Time Signature Note':
            if (configValue.length < 1) {
               return alert("Set a time signature!")
            }
            
            await db.editor.update(projectID, { timeSignatureNote: configValue })

            alert("Sucessfully set time signature note!")
            location.reload()

            break
         case 'Default Enter Action':
            if (configValue.length < 1) {
               return alert("Set a valid action! (flag, mark)")
            }

            configValue = configValue.toLowerCase()

            if (!(configValue === "flag" || configValue === "mark")) {
               return alert("Set a valid action! (flag, mark)")
            }

            analysisEnterAction.set(configValue)

            //alert("Sucessfully set default enter action!")
            cancelConfig()

            break
      }
   }

   function cancelConfig() {
      configDiv = "hidden"
      configValue = ""
   }

   // help menu ----------------------------------------------------------------------------------
   function toggleHelpMenu() {
      fileMenu = "hidden"
      configMenu = "hidden"
      helpMenu = helpMenu === "" ? "hidden" : "";
      githubMenu = "hidden"
   }

   function docs(pg) {
      closeAll()
      if (pg === "docs") {
         window.open("/docs", "_blank")
      } else {
         window.open(`/docs?pg=${pg}`, "_blank")
      }
   }

   // github menu ----------------------------------------------------------------------------------
   function toggleGithubMenu() {
      fileMenu = "hidden"
      configMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = githubMenu === "" ? "hidden" : "";
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

   // end -----------------------------------------------------------------------------------------------

   function closeAll() {
      fileMenu = "hidden"
      configMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = "hidden"
   }

   //keybind the menus
   function onKeyDown(e) {
      if (document.activeElement.tagName === "INPUT") {
         return
      }

      if (e.key === "f") {
         toggleFileMenu()
      }

      if (e.key === "c") {
         toggleConfigMenu()
      }

      if (e.key === "h") {
         toggleHelpMenu()
      }

      if (e.key === "g") {
         toggleGithubMenu()
      }
   }

   //add enter functionality to config menu's input
   function onKeyDownConfig(e) {
      if (e.keyCode === 13) {
         saveConfig()
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

<div class="{configDiv} fixed grid h-screen w-screen place-content-center z-50 bg-black bg-opacity-50">
   <div class="bg-gray-700 p-5 text-white max-w-96">
      <span class="font-bold">{configLabel}</span>
      <br>
      <span class="">{configDescription}</span>
      <br>
      <input bind:this={configInput} on:keydown={onKeyDownConfig} bind:value={configValue} class="text-black p-2 my-1 outline-none w-full" type="text" name="input for setting config value">
      <div>
         <button on:click={saveConfig} class="p-2 bg-slate-800">save</button>
         <button on:click={cancelConfig} class="p-2 bg-slate-800">cancel</button>
      </div>
   </div>
</div>

<div bind:clientWidth={innerWidth} class="fixed grid grid-flow-row inset-x-0 top-0 z-40 w-screen h-12 bg-slate-400 dark:bg-slate-800">
   
   <div class="{placeTime} bg-gray-100 dark:bg-slate-900 dark:text-white w-32 text-3xl h-full p-1 grid place-items-center">
      <p>{time}</p>
   </div>

   <div class="absolute pr-auto place-items-start select-none dark:text-slate-200">
      <span class="ml-1">{branding}{title}</span>
 
      <div id="whitelisted" class="flex absolute">
         <div>
            <button on:click={toggleFileMenu} class="button-menu hover:bg-slate-300 dark:hover:bg-slate-900"><u>F</u>ile</button>

            <div class="{fileMenu} menu bg-white text-gray-800 dark:text-slate-200 dark:bg-slate-800 dark:divide-slate-700 dark:border-slate-700">
               <div>
                  <!-- <button class="button-in-menu"><Fa class="w-5 mr-2" icon={faFileImport}/> Import Project...</button> -->
                  <button on:click={info} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faFilePen}/> Project Info</button>
                  <button on:click={exportProject} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faDownload}/> Export File</button>
               </div>
               <button on:click={back} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faDoorOpen}/> Exit</button>
            </div>
         </div>
         <div>
            <button on:click={toggleConfigMenu} class="button-menu hover:bg-slate-300 dark:hover:bg-slate-900"><u>C</u>onfigure</button>
            
            <div class="{configMenu} menu bg-white text-gray-800 dark:text-slate-200 dark:bg-slate-800 dark:divide-slate-700 dark:border-slate-700">
               <div>
                  <button on:click={configName} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faQuoteLeft}/> Project Name</button>
                  <button on:click={configBPM} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faHashtag}/> BPM</button>
                  <button on:click={configTimeSignatureBeat} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faClock}/> Time Signature Beat</button>
                  <button on:click={configTimeSignatureNote} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faHourglassEnd}/> Time Signature Note</button>
               </div>
               <button on:click={prefEnterAction} class="button-in-menu hover:bg-gray-300 dark:hover:bg-slate-600"><Fa class="w-5 mr-2" icon={faCog}/> Default Enter Action</button>
            </div>
         </div>
         <div>
            <button on:click={toggleHelpMenu} class="button-menu hover:bg-sky-300 dark:hover:bg-sky-700"><u>H</u>elp</button>
            
            <div class="{helpMenu} menu bg-sky-400 divide-sky-500 text-white border-sky-500">
               <div>
                  <button on:click={() => docs("layout")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faPenToSquare}/> Editor</button>
                  <button on:click={() => docs("tracks")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faChartGantt}/> Tracks</button>
                  <button on:click={() => docs("tools")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faHammer}/> Tools</button>
               </div>
               <button on:click={() => docs("docs")} class="button-in-menu hover:bg-sky-500"><Fa class="w-5 mr-2" icon={faBook}/> Documentation</button>
            </div>
         </div>
         <div>
            <button on:click={toggleGithubMenu} class="button-menu hover:bg-amber-300 dark:hover:bg-amber-700"><u>G</u>ithub</button>
            
            <div class="{githubMenu} menu bg-amber-500 divide-amber-600 text-amber-950 border-amber-600">
               <div class="px-2 py-1">
                  <span>mp3mark is a open source project. star it!</span>
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
</div>

<style lang="postcss">
   .button-menu {
      @apply px-1;
   }

   .button-in-menu {
      @apply text-left p-1 pl-2 w-full flex items-center;
   }

   .menu {
      @apply fixed w-48 divide-y py-1 rounded-b-lg rounded-tr-lg border shadow-lg;
   }
</style>