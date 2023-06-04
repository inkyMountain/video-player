import { contextBridge } from 'electron'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import videoIpc from './video'

const api = {
  videoIpc,
}

// 根据是否开启 contextIsolated，来采取不同的 api 注入方式。
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('process', {
      type: process.type,
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.process = {
    type: process.type,
  }
}

declare global {
  interface Window {
    api: typeof api
    electron: ElectronAPI
  }
}
