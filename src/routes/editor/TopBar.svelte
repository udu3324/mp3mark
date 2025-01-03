<script>
   import { db } from "$lib/db.js"
   import { currentTime } from "$lib/editor"
   import { goto } from '$app/navigation'
	import Fa from "svelte-fa";
	import { faBook, faBug, faChartGantt, faClock, faCodePullRequest, faDoorOpen, faDownload, faFilePen, faHammer, faHashtag, faHourglass, faHourglassEnd, faPenToSquare, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
	import { faGithub, faSlack } from "@fortawesome/free-brands-svg-icons";
	import ProjectInfo from "./ProjectInfo.svelte";

   export let title
   export let editorData
   export let projectID

   // biome-ignore lint/style/useConst: <explanation>
   let innerWidth = 0
   let branding = "mp3mark - "
   let placeTime
   
   //responsive navbar to remove/change certain elements
   $: {
      if (innerWidth < 650) {
         placeTime = "place-self-end"
      } else {
         placeTime = "place-self-center"
      }

      if (innerWidth < 400) {
         branding = ""
      } else {
         branding = "mp3mark - "
      }
   }
   
   let configInput
   let configDiv = "hidden"
   let configLabel = ""
   let configValue = ""

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

   function showConfig() {
      configDiv = ""

      setTimeout(() => {
         configInput.focus()
         configInput.select()
      }, 15)
   }

   function configName() {
      showConfig()

      configLabel = "Project Name"
      configValue = editorData.projectName
   }

   function configBPM() {
      showConfig()

      configLabel = "BPM (beats per minute)"
      configValue = editorData.bpm
   }

   function configTimeSignatureBeat() {
      showConfig()

      configLabel = "Time Signature Beat"
      configValue = editorData.timeSignatureBeat
   }

   function configTimeSignatureNote() {
      showConfig()

      configLabel = "Time Signature Note"
      configValue = editorData.timeSignatureNote
   }

   function cancelConfig() {
      configDiv = "hidden"
      configValue = ""
   }

   async function saveConfig() {
      switch (configLabel) {
         case 'Project Name':
            if (configValue.length < 1) {
               alert("Set a project name!")
               return
            }
            
            await db.editor.update(projectID, { projectName: configValue })

            alert("Sucessfully set project name!")
            location.reload()

            break
         case 'BPM (beats per minute)':
            if (configValue.length < 1) {
               alert("Set a bpm!")
               return
            }

            await db.editor.update(projectID, { bpm: Number.parseInt(configValue) })

            alert("Sucessfully set bpm!")
            location.reload()

            break
         case 'Time Signature Beat':
            if (configValue.length < 1) {
               alert("Set a time signature!")
               return
            }

            await db.editor.update(projectID, { timeSignatureBeat: configValue })

            alert("Sucessfully set time signature beat!")
            location.reload()

            break
         case 'Time Signature Note':
            if (configValue.length < 1) {
               alert("Set a time signature!")
               return
            }
            
            await db.editor.update(projectID, { timeSignatureNote: configValue })

            alert("Sucessfully set time signature note!")
            location.reload()

            break
      }
   }

   $: {
      switch (configLabel) {
         case 'Project Name':
            if (configValue.length > 22) {
               configValue = configValue.substring(0, 20)
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
      }
   }

   let fileMenu = "hidden"
   let configMenu = "hidden"
   let helpMenu = "hidden"
   let githubMenu = "hidden"

   function toggleFileMenu() {
      fileMenu = fileMenu === "hidden" ? "" : "hidden";
      configMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = "hidden"
   }

   function toggleConfigMenu() {
      fileMenu = "hidden"
      configMenu = configMenu === "hidden" ? "" : "hidden";
      helpMenu = "hidden"
      githubMenu = "hidden"
   }

   function toggleHelpMenu() {
      fileMenu = "hidden"
      configMenu = "hidden"
      helpMenu = helpMenu === "" ? "hidden" : "";
      githubMenu = "hidden"
   }

   function toggleGithubMenu() {
      fileMenu = "hidden"
      configMenu = "hidden"
      helpMenu = "hidden"
      githubMenu = githubMenu === "" ? "hidden" : "";
   }

   function closeAll() {
      fileMenu = "hidden"
      configMenu = "hidden"
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
   <div class="bg-gray-700 p-5 text-white">
      <span>{configLabel}</span>
      <br>
      <input bind:this={configInput} bind:value={configValue} class="text-black p-2 my-1 outline-none" type="text">
      <div>
         <button on:click={saveConfig} class="p-2 bg-slate-800">save</button>
         <button on:click={cancelConfig} class="p-2 bg-slate-800">cancel</button>
      </div>
   </div>
</div>

<div bind:clientWidth={innerWidth} class="fixed inset-x-0 top-0 z-40 w-screen h-12 bg-slate-400">
   <div class="pr-auto place-items-start select-none text-gray-800">
     <span class="absolute ml-1">{branding}{title}</span>

     <div id="whitelisted" class="flex absolute mt-6">
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
           <button on:click={toggleConfigMenu} class="button-menu hover:bg-slate-300"><u>C</u>onfigure</button>
           <div class="{configMenu} fixed bg-white text-gray-800 w-48 divide-y py-1 rounded-b-lg rounded-tr-lg border shadow-lg">
              <div>
                 <button on:click={configName} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faQuoteLeft}/> Project Name</button>
                 <button on:click={configBPM} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faHashtag}/> BPM</button>
                 <button on:click={configTimeSignatureBeat} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faClock}/> Time Signature Beat</button>
                 <button on:click={configTimeSignatureNote} class="button-in-menu hover:bg-gray-300"><Fa class="w-5 mr-2" icon={faHourglassEnd}/> Time Signature Note</button>
              </div>
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
   <div class="{placeTime} bg-gray-100 w-32 text-3xl mr-4 h-full p-1 grid place-items-center">
      <p>{time}</p>
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