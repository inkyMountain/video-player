import { FC, PropsWithChildren } from 'react'
import './App.scss'
import { useAsyncEffect } from 'ahooks'
import usePlaylistStore from './store/playlist'
import router from './router'

const App: FC<PropsWithChildren> = ({ children }) => {
  const playlistStore = usePlaylistStore()
  useAsyncEffect(async () => {
    const { playlistLocations: latestPlaylistLocations } =
      await window.api.fileIpc.emitGetPlaylists()
    playlistStore.setPlaylistLocations(latestPlaylistLocations)
  }, [])

  return (
    <div id="container">
      {/* <header className="draggable-bar" /> */}
      {/* 返回按钮 */}
      {/* <button
        onClick={() => {
          router.navigate(-1)
        }}
      >
        back
      </button> */}
      {children}
    </div>
  )
}

export default App
