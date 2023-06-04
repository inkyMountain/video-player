import { ipcRenderer } from 'electron-better-ipc'

const listenOpenFile = (
  callback: (data: VideoIpc.OpenFileReq) => VideoIpc.OpenFileRes,
) => {
  return ipcRenderer.answerMain('open-file', callback)
}

const videoIpc = {
  listenOpenFile,
}

export default videoIpc
