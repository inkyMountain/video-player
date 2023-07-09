import { app, net, protocol } from 'electron'
import { AppMiddleware } from './types'
import fs from 'fs-extra'

const protocolMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    app.whenReady().then(() => {
      // electron v25 废弃了 registerFileProtocol，需要改成 protocol.handle
      // 但是试了一会，video 标签无法正常播放视频。所以暂时使用 electron v22。
      // protocol.handle('local-file', async (request) => {
      //   const url = new URL(request.url)
      //   const resolvedFilePath = `file://${decodeURIComponent(url.pathname)}`
      //   // const resolvedFilePath = decodeURIComponent(url.pathname)
      //   console.log('request.url ==========>', request.url, resolvedFilePath)
      //   return net.fetch(resolvedFilePath, {
      //     bypassCustomProtocolHandlers: true,
      //   })
      // })
      protocol.registerFileProtocol('local-file', (request, callback) => {
        console.log('request.url ==========>', request.url)
        const requestedFilePath = decodeURIComponent(
          request.url.replace(/^local-file:(\/\/)?/, ''),
        )
        console.log('requestedFilePath ==========>', requestedFilePath)
        callback({
          path: requestedFilePath,
        })
      })
    })
  },
}

export default protocolMiddleware
