import Dexie from 'dexie';

export const db = new Dexie('webbase')

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

export async function setDarkMode(enable) {
    try {
        await db.preference.update(1, { darkMode: enable })
  
        // Update the document's class
        const html = document.documentElement
        if (enable) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    } catch (error) {
        console.error('Failed to set dark mode:', error)
    }
}