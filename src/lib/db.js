import Dexie from 'dexie';

export const db = new Dexie('webbase')

db.version(1).stores({
    load: 'projectID',
    editor: '++id, audio, fileName, projectName, timeSignatureBeat, timeSignatureNote, bpm, length, timelineData, volume'
})