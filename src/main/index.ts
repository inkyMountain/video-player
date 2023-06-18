import { app, shell, BrowserWindow } from 'electron'
import { electronApp, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { emitOpenFile } from '@main/ipc-events/video'
import electronDebug from 'electron-debug'
import path from 'path'
import ipcMiddleware from '@main/middlewares/ipc'
import protocolMiddleware from '@main/middlewares/protocol'
import { AppMiddleware } from './middlewares/types'

const applyMiddleware = ({ apply, when }: AppMiddleware) => {
  if (is.dev && (when === 'dev' || when === 'all')) {
    apply()
  } else if (!is.dev && (when === 'production' || when === 'all')) {
    apply()
  }
}

applyMiddleware(ipcMiddleware)
applyMiddleware(protocolMiddleware)

if (is.dev) {
  electronDebug()
}

const pendingFiles: Array<{ url: string }> = []
app.on('will-finish-launching', () => {
  app.on('open-file', (event, url) => {
    event.preventDefault()
    pendingFiles.push({ url })
  })
})

// 创建一个应用窗口，加载 html 文件。
function createWindow() {
  const win = new BrowserWindow({
    width: 1200,

    height: 1000,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#ffff00',
      symbolColor: '#00ffff',
    },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  win.on('ready-to-show', () => {
    win.show()
  })

  win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // 生产环境和开发环境加载不同的 url。
  // 开发环境是加载一个 http 链接，生产环境是加载 file:// 链接。
  const loadPromise =
    is.dev && process.env['ELECTRON_RENDERER_URL']
      ? win.loadURL(process.env['ELECTRON_RENDERER_URL'])
      : win.loadFile(path.join(__dirname, '../renderer/index.html'))
  return {
    win,
    loadPromise,
  }
}

// 当 electron app 已经准备好，可以创建应用窗口以后，就会触发这里的事件。
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('peer-video-player')

  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  // 这里做了两件事情：1. 开发阶段绑定了 f12 打开开发工具的快捷键。 2. 生产阶段禁用 ctrl/command+r 刷新页面。
  // app.on('browser-window-created', (_, window) => {
  //   optimizer.watchWindowShortcuts(window)
  // })

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }

  while (pendingFiles.length > 0) {
    const file = pendingFiles.shift()
    if (!file) {
      break
    }
    const { win, loadPromise } = createWindow()
    // 等 window 对象加载完页面后，再发送事件，让页面处理。
    loadPromise.then(() => {
      emitOpenFile(win, { url: file.url })
    })
  }

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
 * 在 macos 系统中，即使窗口都被关闭了，也应该保留 app 不退出。
 *   这样用户可以通过点击托盘，或者 dock 栏，触发 activate 事件，再次创建应用窗口。
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
