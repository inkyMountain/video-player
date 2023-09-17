import { app } from 'electron'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'

export const appConfigDbPath = path.join(
  app.getPath('appData'),
  app.name,
  'app-data-db.json',
)

interface AppDataDb {
  playlistLocations: Array<Common.PlaylistLocation>
}
const jsonAdapter = new JSONFile<AppDataDb>(appConfigDbPath)
const appDataDb = new Low(jsonAdapter, {
  playlistLocations: [],
})

export const init = appDataDb.read()
init.then(() => {
  console.log('res ==========>', appDataDb.data)
})
export default appDataDb
