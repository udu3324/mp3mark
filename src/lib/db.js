import Dexie from 'dexie';

export const db = new Dexie('webbase')

db.version(1).stores({
    editor: '++id, audio, fileName, projectName, timeSignatureBeat, timeSignatureNote, bpm, length, tracks, timelineData'
})