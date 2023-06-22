import React, { useMemo } from 'react'
import './Home.scss'
import usePlaylistStore from '@renderer/store/playlist'
import { useNavigate } from 'react-router-dom'

interface IProps {}

const Home: React.FunctionComponent<IProps> = (props) => {
  const navigate = useNavigate()
  const playlistStore = usePlaylistStore()
  console.log('playlistStore ===========>', playlistStore)

  const gotoPlaylistDetailPage = (folderPath: string) => {
    navigate(`/playlist-detail/${encodeURIComponent(folderPath)}`)
  }

  const folderPathSet = useMemo(() => {
    return playlistStore.playlistLocation.reduce<Set<string>>(
      (set, { folderPath }) => {
        if (folderPath) {
          set.add(folderPath)
        }
        return set
      },
      new Set(),
    )
  }, [playlistStore.playlistLocation])

  return (
    <div className="home">
      <main className="playlists">
        {playlistStore.playlistLocation.map(({ folderPath }) => {
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
              <div className="folder-path">{folderPath}</div>
            </article>
          )
        })}
      </main>

      <button
        onClick={async () => {
          const addedPlaylists = await window.api.fileIpc.emitAddFolder()
          if (
            addedPlaylists.folderPath &&
            !folderPathSet.has(addedPlaylists.folderPath)
          ) {
            playlistStore.pushPlaylistLocations(addedPlaylists)
          }
          console.log('res ===========>', addedPlaylists)
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
