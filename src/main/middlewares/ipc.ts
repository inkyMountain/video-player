import type { AppMiddleware } from './types'
import localFileIpc from '@main/ipc-events/localFile'
import { app, dialog, shell } from 'electron'
import appDataDb, { appConfigDbPath } from '@main/utils/lowdb'
import fileUtils from '@main/utils/file'
import { SUPPORTED_VIDEO_EXTENSIONS } from '@main/consts'
import systemInfoIpc from '@main/ipc-events/systemInfo'
import videoIpc from '@main/ipc-events/video'
import path from 'path'

const tempDir = path.join(app.getPath('temp'), app.name)

const ipcMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    app.whenReady().then(() => {
      localFileIpc.onAddLocalFolder(async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: '添加一个包含视频的文件夹',
          properties: ['openDirectory'],
        })
        if (canceled) {
          return null
        }
        const folderPath = filePaths[0]
        // 将用户选择的文件夹路径，存储到文件数据库中。
        const isDuplicate = appDataDb.data.playlistLocations.some(
          (location) => location.folderPath === folderPath,
        )
        if (!isDuplicate) {
          appDataDb.data.playlistLocations.push({ folderPath })
          await appDataDb.write()
          return {
            folderPath,
          }
        }

        return null
      })

      localFileIpc.onGetPlaylistLocations(async () => {
        await appDataDb.read()
        const locations = appDataDb.data.playlistLocations ?? []
        return {
          playlistLocations: locations,
        }
      })

      localFileIpc.onGetPlaylistAt(async (location) => {
        if (!location.folderPath) {
          return null
        }
        return fileUtils.getVideosStatsIn(
          location.folderPath,
          SUPPORTED_VIDEO_EXTENSIONS,
        )
      })

      localFileIpc.onRevealDbFile(async () => {
        shell.showItemInFolder(appConfigDbPath)
      })

      localFileIpc.onSetWindowSize(async ({ width, height }, win) => {
        win?.setSize(width, height, true)
      })

      localFileIpc.onDeletePlaylistLocation(async ({ folderPath }) => {
        await appDataDb.read()
        const playlistLocations = appDataDb.data.playlistLocations
        const index = playlistLocations.findIndex(
          (location) => location.folderPath === folderPath,
        )
        if (index === -1) {
          return
        }
        playlistLocations.splice(index, 1)
        await appDataDb.write()
      })
    })

    systemInfoIpc.onPlatform((_data, _win) => {
      return process.platform
    })

    videoIpc.onSubtitleGenerate(async (data, _win) => {
      const { videoFilePath, subtitleLength } = data
      const subtitleFilePaths = await fileUtils.generateSubtitle({
        filePath: videoFilePath,
        outDir: tempDir,
        subtitleLength,
      })
      return {
        subtitleFilePaths,
      }
    })
  },
}

export default ipcMiddleware
