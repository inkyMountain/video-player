import { BrowserWindow } from 'electron'
import { ipcMain } from 'electron-better-ipc'

export const emitOpenFile = async (
  win: BrowserWindow,
  data: VideoIpc.OpenVideoReq,
): Promise<VideoIpc.OpenVideoRes> => {
  return ipcMain.callRenderer(win, 'open-video', data)
}
