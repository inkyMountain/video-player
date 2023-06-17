import { ipcMain } from 'electron-better-ipc'

const onAddLocalFolder = async (
  callback: (
    data: FileIpc.AddLocalFolderReq,
  ) => Promise<FileIpc.AddLocalFolderRes>,
) => {
  return ipcMain.answerRenderer('add-local-folder', callback)
}

const onGetPlaylists = async (
  callback: (data: FileIpc.GetPlaylistsReq) => Promise<FileIpc.GetPlaylistsRes>,
) => {
  return ipcMain.answerRenderer('get-playlists', callback)
}

const onRevealDbFile = async (
  callback: (data: FileIpc.RevealDbFileReq) => Promise<FileIpc.RevealDbFileRes>,
) => {
  return ipcMain.answerRenderer('reveal-db-file', callback)
}

const localFileIpc = {
  onAddLocalFolder,
  onGetPlaylists,
  onRevealDbFile,
}

export default localFileIpc
