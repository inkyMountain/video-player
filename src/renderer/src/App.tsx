import { useAsyncEffect } from 'ahooks'
import { FC, PropsWithChildren } from 'react'
import Modal from 'react-modal'
import './App.scss'
import usePlaylistStore from './store/playlist'

Modal.setAppElement('#root')
Modal.defaultStyles.content = {
  inset: 'auto',
  top: 0,
  left: 0,
  backgroundColor: '#ffffff',
  borderRadius: 4,
  padding: 10,
}
Modal.defaultStyles.overlay = {
  position: 'fixed',
  zIndex: 1,
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(255, 255, 255, .3)',
}

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
