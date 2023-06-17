import { ipcRenderer } from 'electron-better-ipc'

const emitAddFolder = (): Promise<FileIpc.AddLocalFolderRes> => {
  return ipcRenderer.callMain('add-local-folder')
}

const emitGetPlaylists = (): Promise<FileIpc.GetPlaylistsRes> => {
  return ipcRenderer.callMain('get-playlists')
}

const emitRevealDbFile = (): Promise<FileIpc.RevealDbFileRes> => {
  return ipcRenderer.callMain('reveal-db-file')
}

const fileIpc = {
  emitAddFolder,
  emitGetPlaylists,
  emitRevealDbFile,
}

export default fileIpc
