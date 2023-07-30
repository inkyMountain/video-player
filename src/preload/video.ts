import { ipcRenderer } from 'electron-better-ipc'

const onOpenFile = (
  callback: (data: VideoIpc.OpenVideoReq) => VideoIpc.OpenVideoRes,
) => {
  return ipcRenderer.answerMain('open-video', callback)
}

const emitSubtitleGenerate = (
  data: VideoIpc.SubtitleGenerateReq,
): Promise<VideoIpc.SubtitleGenerateRes> => {
  return ipcRenderer.callMain('subtitle-generate', data)
}

const videoIpc = {
  onOpenFile,
  emitSubtitleGenerate,
}

export default videoIpc
