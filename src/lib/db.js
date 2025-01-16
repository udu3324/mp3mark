import Dexie from 'dexie'
import { writable } from 'svelte/store'

const db = new Dexie('webbase')

const darkMode = writable(false)
const playSnap = writable(false)
const analysisEnterAction = writable("flag")

db.version(1).stores({
    load: 'projectID',
    editor: '++id, audio, fileName, projectName, timeSignatureBeat, timeSignatureNote, bpm, length, timelineData, volume',
    preference: '++id, darkMode, playSnap, analysisEnterAction'
})

db.on('populate', () => {
    db.preference.add({
        darkMode: false, 
		playSnap: true, 
		analysisEnterAction: "flag"
    })
})

db.on('ready', async () => {
    //fetch preferences for svelte components
    await db.preference.get(1).then(pref => {
        darkMode.set(pref.darkMode)
        playSnap.set(pref.playSnap)
        analysisEnterAction.set(pref.analysisEnterAction)
    }).catch(() => {
        console.log("error loading preferences! might be missing. trying to create it...")
        
        //worse case scenario if db is very old
        db.preference.add({
            darkMode: false, 
            playSnap: true, 
            analysisEnterAction: "flag"
        }).then(() => {
            console.log("sucessfully created preference db")
        }).catch(() => {
            console.log("could not create preference db!!!! SECOND FAIL")
        })
    })

    //subscribe to stores to save back to db
    darkMode.subscribe((bool) => {
        console.log("updating preference db")

        db.preference.update(1, { darkMode: bool }).then(() => {
            // Update the document's class
            const html = document.documentElement
            if (bool) {
                html.classList.add('dark')
            } else {
                html.classList.remove('dark')
            }
        }).catch((error) => {
            console.error('Failed to set dark mode:', error)
        })
    })

    playSnap.subscribe((bool) => {
        console.log("updating preference db")

        db.preference.update(1, { playSnap: bool }).catch((error) => {
            console.error('Failed to set play snap:', error)
        })
    })

    analysisEnterAction.subscribe((str) => {
        console.log("updating preference db")

        db.preference.update(1, { analysisEnterAction: str }).catch((error) => {
            console.error('Failed to set analysis enter action:', error)
        })
    })
})

export { db, darkMode, playSnap, analysisEnterAction }