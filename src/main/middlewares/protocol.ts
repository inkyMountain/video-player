import { app, protocol, shell } from 'electron'
import { AppMiddleware } from './types'
import fileUtils from '@main/utils/file'
import path from 'path'
import fsExtra from 'fs-extra'

const thumbnailOutputDir = path.join(app.getPath('temp'), app.name)
fsExtra
  .pathExists(thumbnailOutputDir)
  .then((isExist) => {
    if (!isExist) {
      fsExtra.ensureDir(thumbnailOutputDir)
      return
    }
  })
  .finally(() => {
    shell.openPath(thumbnailOutputDir)
  })

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
        const requestedFilePath = decodeURIComponent(
          request.url.replace(/^local-file:(\/\/)?/, ''),
        )
        callback({
          path: requestedFilePath,
        })
      })

      protocol.registerFileProtocol('thumbnail', async (request, callback) => {
        const url = new URL(request.url)
        const searchParams = Object.fromEntries(url.searchParams)
        const timestamps = searchParams.timestamps
          ? JSON.parse(searchParams.timestamps)
          : ['50%']
        // 需要生成缩略图的视频文件路径
        const videoFilePath = decodeURIComponent(url.host)
        // 缩略图的输出路径
        const outputFilePath = path.join(
          thumbnailOutputDir,
          `${path.basename(videoFilePath)}.png`,
        )
        const isExist = await fsExtra.pathExists(outputFilePath)
        // 如果缩略图文件已经存在，则直接返回文件路径，避免重复生成。
        if (isExist) {
          callback({
            path: outputFilePath,
          })
          return
        }
        fileUtils
          .generateThumbnail({
            filePath: videoFilePath,
            outputDir: thumbnailOutputDir,
            timestamps,
            // %f 代表一个占位符，代表视频文件的文件名。效果是让缩略图文件的名字和视频文件一样。
            filename: '%f',
          })
          .then(() => {
            console.log(
              `缩略图转换成功, from: ${videoFilePath}, to: ${outputFilePath}`,
            )
            callback({
              path: outputFilePath,
            })
          })
          .catch((error) => {
            console.log('缩略图转换失败', error.message, videoFilePath)
            callback({
              path: '',
            })
          })
      })
    })
  },
}

export default protocolMiddleware
