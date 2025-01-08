import Dexie from 'dexie';

export const db = new Dexie('webbase')

db.version(1).stores({
    load: 'projectID',
    editor: '++id, audio, fileName, projectName, timeSignatureBeat, timeSignatureNote, bpm, length, timelineData, volume',
    preference: '++id, darkMode, playSnap, analysisEnterAction'
})

db.on('populate', () => {
    db.preference.add({
        darkMode: true, 
		playSnap: true, 
		analysisEnterAction: "flag"
    })
})

export async function setDarkMode(enable) {
    try {
        const preferences = await db.preference.toArray()
        
        if (preferences.length > 0) {
            // Update the existing preference
            await db.preference.update(preferences[0].id, { darkMode: enable })
        } else {
            // If no preference exists, create one
            await db.preference.add({
                darkMode: enable,
                playSnap: true, // default values, adjust if needed
                analysisEnterAction: 'flag'
            });
        }
  
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