import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { emitOpenFile } from '@main/ipc-events/video'

const pendingFiles: string[] = []
app.on('will-finish-launching', () => {
  app.on('open-file', (event, url) => {
    event.preventDefault()
    // todo 修改为将文件路径 push 进 pendingFiles 数组，
    // 然后在 app ready 事件中处理这些文件。
    app.whenReady().then(() => {
      const { win, loadPromise } = createWindow()
      // 等 window 对象加载完页面后，再发送事件，让页面处理。
      loadPromise.then(() => {
        emitOpenFile(win, { url })
      })
    })
  })
})

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  let loadPromise: Promise<void>
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loadPromise = win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    loadPromise = win.loadFile(join(__dirname, '../renderer/index.html'))
  }
  return {
    win,
    loadPromise,
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('peer-video-player')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
