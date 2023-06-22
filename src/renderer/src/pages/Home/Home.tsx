import React, { useMemo } from 'react'
import './Home.scss'
import usePlaylistStore from '@renderer/store/playlist'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'

interface IProps {}

const Home: React.FunctionComponent<IProps> = (props) => {
  const navigate = useNavigate()
  const playlistStore = usePlaylistStore()

  const gotoPlaylistDetailPage = (folderPath: string) => {
    navigate(`/playlist-detail/${encodeURIComponent(folderPath)}`)
  }

  const folderPathSet = useMemo(() => {
    return playlistStore.playlistLocations.reduce<Set<string>>(
      (set, { folderPath }) => {
        if (folderPath) {
          set.add(folderPath)
        }
        return set
      },
      new Set(),
    )
  }, [playlistStore.playlistLocations])

  return (
    <div className="home">
      <NavigationBar backButtonVisible={false} />
      <main className="playlists">
        {playlistStore.playlistLocations.map((location) => {
          const { folderPath } = location
          return (
            <article
              className="playlist"
              onClick={() => {
                if (folderPath) {
                  gotoPlaylistDetailPage(folderPath)
                }
              }}
              key={folderPath}
            >
              <div className="folder-path">
                <div className="path-text">{folderPath}</div>
                <button
                  className="delete-button"
                  onClick={async (event) => {
                    event.stopPropagation()
                    if (!folderPath) {
                      return
                    }
                    await window.api.fileIpc.emitDeletePlaylistLocation(
                      location,
                    )
                    const { playlistLocations: latestPlaylistLocations } =
                      await window.api.fileIpc.emitGetPlaylists()
                    playlistStore.setPlaylistLocations(latestPlaylistLocations)
                  }}
                >
                  删除
                </button>
              </div>
            </article>
          )
        })}
      </main>

      <button
        onClick={async () => {
          const addedPlaylistLocation = await window.api.fileIpc.emitAddFolder()
          if (
            addedPlaylistLocation !== null &&
            addedPlaylistLocation !== undefined
          ) {
            playlistStore.pushPlaylistLocation(addedPlaylistLocation)
          }
        }}
      >
        选择文件夹
      </button>

      <button
        onClick={() => {
          window.api.fileIpc.emitRevealDbFile()
        }}
      >
        在finder中显示db文件
      </button>
    </div>
  )
}

export default Home
