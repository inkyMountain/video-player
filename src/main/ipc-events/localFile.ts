import { BrowserWindow } from 'electron'
import { ipcMain } from 'electron-better-ipc'

const onAddLocalFolder = async (
  callback: (
    data: FileIpc.AddLocalFolderReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.AddLocalFolderRes>,
) => {
  return ipcMain.answerRenderer('add-local-folder', callback)
}

const onGetPlaylistLocations = async (
  callback: (
    data: FileIpc.GetPlaylistsReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.GetPlaylistsRes>,
) => {
  return ipcMain.answerRenderer('get-playlists', callback)
}

const onRevealDbFile = async (
  callback: (
    data: FileIpc.RevealDbFileReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.RevealDbFileRes>,
) => {
  return ipcMain.answerRenderer('reveal-db-file', callback)
}

const onSetWindowSize = async (
  callback: (
    data: FileIpc.SetWindowSizeReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.SetWindowSizeRes>,
) => {
  return ipcMain.answerRenderer('set-window-size', callback)
}

const onGetPlaylistAt = async (
  callback: (
    data: FileIpc.GetPlaylistAtReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.GetPlaylistAtRes>,
) => {
  return ipcMain.answerRenderer('get-playlist-at', callback)
}

const onDeletePlaylistLocation = async (
  callback: (
    data: FileIpc.DeletePlaylistLocationReq,
    win?: BrowserWindow,
  ) => Promise<FileIpc.DeletePlaylistLocationRes>,
) => {
  return ipcMain.answerRenderer('delete-playlist-location', callback)
}

const localFileIpc = {
  onAddLocalFolder,
  onGetPlaylistLocations,
  onRevealDbFile,
  onSetWindowSize,
  onGetPlaylistAt,
  onDeletePlaylistLocation,
}

export default localFileIpc
