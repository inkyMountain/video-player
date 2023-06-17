import { ipcRenderer } from 'electron-better-ipc'

const listenOpenFile = (
  callback: (data: VideoIpc.OpenVideoReq) => VideoIpc.OpenVideoRes,
) => {
  return ipcRenderer.answerMain('open-video', callback)
}

const videoIpc = {
  listenOpenFile,
}

export default videoIpc
