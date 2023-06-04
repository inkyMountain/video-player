import { ipcRenderer } from 'electron-better-ipc'

export const createIpcListener = <Req, Res>(channel: string, callback: (data: Req) => Res) => {
  ipcRenderer.answerMain<Req, Res>(channel, (data) => callback(data))
}
