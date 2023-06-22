import { FC, PropsWithChildren, useEffect } from 'react'
import './App.scss'
import { useAsyncEffect } from 'ahooks'
import usePlaylistStore from './store/playlist'

const App: FC<PropsWithChildren> = ({ children }) => {
  const playlistStore = usePlaylistStore()
  useAsyncEffect(async () => {
    const { playlistLocations: latestPlaylistLocations } =
      await window.api.fileIpc.emitGetPlaylists()
    playlistStore.setPlaylistLocations(latestPlaylistLocations)
  }, [])

  return <div id="container">{children}</div>
}

export default App
