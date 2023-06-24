import { app, BrowserWindow } from 'electron'
import { electronApp, is } from '@electron-toolkit/utils'
import electronDebug from 'electron-debug'
import ipcMiddleware from '@main/middlewares/ipc'
import protocolMiddleware from '@main/middlewares/protocol'
import devWindowMiddleware from './middlewares/devWindow'
import mainWindowMiddleware from './middlewares/mainWindow'
import { AppMiddleware } from './middlewares/types'
import { createWindow } from './utils/window'

const applyMiddleware = ({ apply, when }: AppMiddleware) => {
  if (is.dev && (when === 'dev' || when === 'all')) {
    apply()
  } else if (!is.dev && (when === 'production' || when === 'all')) {
    apply()
  }
}

applyMiddleware(ipcMiddleware)
applyMiddleware(protocolMiddleware)
applyMiddleware(mainWindowMiddleware)
// applyMiddleware(devWindowMiddleware)

if (is.dev) {
  electronDebug()
}

// 当 electron app 已经准备好，可以创建应用窗口以后，就会触发这里的事件。
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('peer-video-player')

  app.on('activate', function () {
    // activate 事件只有 macos 上会触发。
    // 当所有的窗口被关闭后，再次点击 dock 栏图标，则需要创建一个新的窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

/**
 * 在 windows 系统中，当所有窗口被关闭了，那么就退出 app。
 * 但是在 macos 系统中，即使窗口都被关闭了，也应该保留 app 不退出。
 *   这样用户可以通过点击托盘，或者 dock 栏，触发 activate 事件，再次创建应用窗口。
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
