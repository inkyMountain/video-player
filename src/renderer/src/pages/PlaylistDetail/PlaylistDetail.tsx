import usePlaylistStore from '@renderer/store/playlist'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './PlaylistDetail.scss'
import { useAsyncEffect } from 'ahooks'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'

interface IProps {}

const PlaylistDetail: React.FunctionComponent<IProps> = () => {
  const pathParams = useParams<{ folderPath: string }>()
  const navigate = useNavigate()
  const playlistStore = usePlaylistStore()

  const folderPath = pathParams.folderPath
  useAsyncEffect(async () => {
    if (!folderPath) {
      return
    }
    const playlistDetail = playlistStore.playlists[folderPath]
    if (playlistDetail) {
      return
    }
    const playlist = await window.api.fileIpc.emitGetPlaylistAt({
      folderPath,
    })
    if (playlist === null) {
      return
    }
    playlistStore.addPlaylist(playlist)
  }, [])

  const gotoPlayerPage = (filePath: string) => {
    const searchParams = new URLSearchParams({
      filePath,
      folderPath: folderPath ?? '',
    })
    navigate(`/video/player?${searchParams.toString()}`)
  }

  if (!folderPath) {
    return null
  }
  const files = playlistStore.playlists[folderPath]?.files ?? []

  return (
    <div className="playlist-detail">
      <NavigationBar />
      {/* 文件夹路径 */}
      <h1 className="folder-path">{pathParams.folderPath}</h1>

      {/* 展示播放列表中的每个文件 */}
      <div className="playlist">
        {/*
          files 这个数组是只读的 (zustand的限制),
          所以需要浅拷贝，产生一个可修改的新数组，用于排序。
        */}
        {[...files]
          .sort((a, b) => {
            const aFilename = a.filename ?? ''
            const bFilename = b.filename ?? ''
            if (aFilename === bFilename) {
              return 0
            } else if (aFilename > bFilename) {
              return 1
            } else {
              return -1
            }
          })
          .map((file) => {
            return (
              <div
                className="video-item"
                onClick={() => {
                  if (file.path) {
                    gotoPlayerPage(file.path)
                  }
                }}
                key={file.filename}
              >
                <img
                  className="video-thumbnail"
                  src={`thumbnail://${encodeURIComponent(
                    file.path ?? '',
                  )}?${new URLSearchParams({
                    timestamps: JSON.stringify(['50%']),
                  })}`}
                  alt=""
                />
                <div className="filename">{file.filename}</div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

export default PlaylistDetail
