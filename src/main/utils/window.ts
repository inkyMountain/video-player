import { BrowserWindow, shell } from 'electron'
import path from 'path'
import icon from '../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'

export const DEFAULT_DEV_URL = process.env['ELECTRON_RENDERER_URL']!
export const DEFAULT_URL = path.join(__dirname, '../renderer/index.html')

// 创建一个应用窗口，加载 html 文件。
export function createWindow(options?: { devUrl?: string; url?: string }) {
  const defaultOptions = {
    devUrl: DEFAULT_DEV_URL,
    url: DEFAULT_URL,
  }
  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  const win = new BrowserWindow({
    width: 1200,
    height: 1000,
    show: false,
    autoHideMenuBar: true,
    // frame: false,
    // titleBarStyle: 'customButtonsOnHover',
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    // titleBarOverlay: {
    //   color: '#ffff00',
    //   symbolColor: '#00ffff',
    // },
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
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
  const loadPromise = is.dev
    ? win.loadURL(mergedOptions.devUrl ?? mergedOptions.url)
    : win.loadFile(mergedOptions.url)
  return {
    win,
    loadPromise,
  }
}
