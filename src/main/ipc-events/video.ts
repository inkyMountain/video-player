import { BrowserWindow } from 'electron'
import { ipcMain } from 'electron-better-ipc'

export const emitOpenFile = async (
  win: BrowserWindow,
  data: VideoIpc.OpenFileReq,
): Promise<VideoIpc.OpenFileRes> => {
  return ipcMain.callRenderer(win, 'open-file', data)
}
