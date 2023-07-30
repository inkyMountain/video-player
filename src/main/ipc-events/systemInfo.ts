import { BrowserWindow } from 'electron'
import { ipcMain } from 'electron-better-ipc'

const onPlatform = (
  callback: (data: void, win: BrowserWindow) => SystemInfoIpc.PlatformRes,
) => {
  return ipcMain.answerRenderer('platform', callback)
}

const systemInfoIpc = {
  onPlatform,
}

export default systemInfoIpc
