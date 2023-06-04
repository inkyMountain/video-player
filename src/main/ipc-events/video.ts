import { BrowserWindow } from 'electron'
import { ipcMain } from 'electron-better-ipc'

export const emitFileOpening = async (win: BrowserWindow) => {
  await ipcMain.callRenderer<VideoIpc.OpenFileReq, VideoIpc.OpenFileRes>(
    win,
    'file-opening',
  )
}
