import type { AppMiddleware } from './types'
import localFileIpc from '@main/ipc-events/localFile'
import { app, dialog, shell } from 'electron'
import appDataDb, { appConfigDbPath } from '@main/utils/lowdb'
import fileUtils from '@main/utils/file'
import { SUPPORTED_VIDEO_EXTENSIONS } from '@main/consts'

const ipcMiddleware: AppMiddleware = {
  when: 'all',
  apply() {
    app.whenReady().then(() => {
      localFileIpc.onAddLocalFolder(async () => {
        const emptyResult = { folderPath: '', folderName: '', files: [] }
        const { canceled, filePaths } = await dialog.showOpenDialog({
          title: '添加一个包含视频的文件夹',
          properties: ['openDirectory'],
        })
        if (canceled) {
          return emptyResult
        }
        const folderPath = filePaths[0]
        // 将用户选择的文件夹路径，存储到文件数据库中。
        const isDuplicate = appDataDb.data.playlistLocations.some(
          (location) => location.folderPath === folderPath,
        )
        if (!isDuplicate) {
          appDataDb.data.playlistLocations.push({ folderPath })
          await appDataDb.write()
          return fileUtils.getVideosStatsIn(
            folderPath,
            SUPPORTED_VIDEO_EXTENSIONS,
          )
        }

        return emptyResult
      })

      localFileIpc.onGetPlaylists(async () => {
        await appDataDb.read()
        const locations = appDataDb.data.playlistLocations ?? []
        const playlistDetailCollectResults = locations.map((location) => {
          if (!location.folderPath) {
            return Promise.reject()
          }
          return fileUtils.getVideosStatsIn(
            location.folderPath,
            SUPPORTED_VIDEO_EXTENSIONS,
          )
        })
        const results = await Promise.allSettled(playlistDetailCollectResults)
        const playlists = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => {
            return (
              result as {
                value: Common.Playlist
                status: 'fulfilled'
              }
            ).value
          })
        return {
          playlists,
        }
      })

      localFileIpc.onRevealDbFile(async () => {
        shell.showItemInFolder(appConfigDbPath)
      })
    })
  },
}

export default ipcMiddleware
