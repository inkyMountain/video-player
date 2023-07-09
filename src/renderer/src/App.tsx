import { FC, PropsWithChildren, useEffect } from 'react'
import './App.scss'
import { useAsyncEffect } from 'ahooks'
import usePlaylistStore from './store/playlist'

const App: FC<PropsWithChildren> = ({ children }) => {
  const playlistStore = usePlaylistStore()
  useAsyncEffect(async () => {
    // 通过ipc通信，获取播放列表文件夹。
    const { playlistLocations: latestPlaylistLocations } =
      await window.api.fileIpc.emitGetPlaylists()
    // 把文件夹列表，设置全局store中。
    playlistStore.setPlaylistLocations(latestPlaylistLocations)
  }, [])

  return <div id="container">{children}</div>
}

export default App
