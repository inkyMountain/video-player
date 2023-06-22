import { ipcRenderer } from 'electron-better-ipc'

const emitAddFolder = (
  data: FileIpc.AddLocalFolderReq,
): Promise<FileIpc.AddLocalFolderRes> => {
  return ipcRenderer.callMain('add-local-folder', data)
}

const emitGetPlaylists = (
  data: FileIpc.GetPlaylistsReq,
): Promise<FileIpc.GetPlaylistsRes> => {
  return ipcRenderer.callMain('get-playlists', data)
}

const emitRevealDbFile = (
  data: FileIpc.RevealDbFileReq,
): Promise<FileIpc.RevealDbFileRes> => {
  return ipcRenderer.callMain('reveal-db-file', data)
}

const emitSetWindowSize = (
  data: FileIpc.SetWindowSizeReq,
): Promise<FileIpc.SetWindowSizeRes> => {
  return ipcRenderer.callMain('set-window-size', data)
}

const emitGetPlaylistAt = (
  data: FileIpc.GetPlaylistAtReq,
): Promise<FileIpc.GetPlaylistAtRes> => {
  return ipcRenderer.callMain('get-playlist-at', data)
}

const fileIpc = {
  emitAddFolder,
  emitGetPlaylists,
  emitRevealDbFile,
  emitSetWindowSize,
  emitGetPlaylistAt,
}

export default fileIpc
