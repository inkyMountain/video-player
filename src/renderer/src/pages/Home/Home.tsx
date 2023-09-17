import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import usePeerStore from '@renderer/store/peerStore'
import usePlaylistStore from '@renderer/store/playlist'
import useSystemInfoStore from '@renderer/store/systemInfoStore'
import React, { useRef, useState } from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import './Home.scss'

interface IProps {}

// const isDarkMode = Boolean(
//   window.matchMedia('(prefers-color-scheme: dark)').matches,
// )

const Home: React.FunctionComponent<IProps> = () => {
  const systemInfoStore = useSystemInfoStore()
  const navigate = useNavigate()
  const playlistStore = usePlaylistStore()
  const peerStore = usePeerStore()

  const gotoPlaylistDetailPage = (folderPath: string) => {
    navigate(`/playlist-detail/${encodeURIComponent(folderPath)}`)
  }

  const [joinSessionModalVisible, setJoinSessionModalVisible] = useState(false)
  const sessionModalTarget = useRef<'video' | 'data'>('video')
  const [remotePeerId, setRemotePeerId] = useState('')

  const onJoinSessionClick = () => {
    sessionModalTarget.current = 'video'
    setJoinSessionModalVisible(true)
  }

  return (
    <>
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
                  {/* 删除按钮。点击后，通过ipc通信，让主进程删除数据库文件中的这个文件夹路径。 */}
                  <button
                    className="delete-button"
                    onClick={async (event) => {
                      event.stopPropagation()
                      if (!folderPath) {
                        return
                      }
                      // 让主进程删除数据库文件中的这个文件夹路径
                      await window.api.fileIpc.emitDeletePlaylistLocation(
                        location,
                      )
                      // 文件中的路径被删除后，再次获取删除完成后的所有播放列表。
                      // 设置到全局 store 中。
                      const { playlistLocations: latestPlaylistLocations } =
                        await window.api.fileIpc.emitGetPlaylists()
                      playlistStore.setPlaylistLocations(
                        latestPlaylistLocations,
                      )
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
            // 告诉主进程展示文件夹选择窗口，选择一个文件夹作为播放列表。
            const addedPlaylistLocation =
              await window.api.fileIpc.emitAddFolder()
            // 如果文件夹路径有效
            if (
              addedPlaylistLocation !== null &&
              addedPlaylistLocation !== undefined
            ) {
              // 就push到全局store中。
              playlistStore.pushPlaylistLocation(addedPlaylistLocation)
            }
          }}
        >
          选择文件夹
        </button>

        <button onClick={onJoinSessionClick}>加入他人分享</button>

        <button
          onClick={() => {
            sessionModalTarget.current = 'data'
            setJoinSessionModalVisible(true)
          }}
        >
          建立数据连接
        </button>

        {systemInfoStore.isDev && (
          <button
            onClick={() => {
              window.api.fileIpc.emitRevealDbFile()
            }}
          >
            在finder中显示db文件
          </button>
        )}
      </div>

      <Modal
        isOpen={joinSessionModalVisible}
        shouldCloseOnEsc={true}
        style={
          {
            // content: {
            //   backgroundColor: isDarkMode ? 'black' : 'whitesmoke',
            // },
            // overlay: {
            //   backgroundColor: isDarkMode ? 'black' : 'whitesmoke',
            //   color: isDarkMode ? 'black' : 'whitesmoke',
            // },
          }
        }
      >
        <input
          className="remote-peer-id-input"
          type="text"
          value={remotePeerId}
          onChange={(event) => {
            const peerId = event.target.value
            setRemotePeerId(peerId)
          }}
        />
        <div>
          <button
            onClick={() => {
              console.log(
                'sessionModalTarget.current ===========>',
                sessionModalTarget.current,
              )
              if (sessionModalTarget.current === 'video') {
                const search = new URLSearchParams({
                  remotePeerId,
                }).toString()
                navigate({
                  pathname: '/video/follower',
                  search,
                })
              } else {
                const peer = peerStore.getPeer()
                // 和远方建立数据连接
                const connection = peer.connect(remotePeerId)
                // 把这个连接放到store中，方便后续的使用。
                peerStore.setDataConnection(connection)
                // 监听对方发来的消息，并打印出来。
                connection.on('data', (data) => {
                  console.log('对方发来消息', data)
                })
              }
            }}
          >
            加入会话
          </button>
          <button
            onClick={() => {
              setJoinSessionModalVisible(false)
            }}
          >
            关闭弹窗
          </button>
        </div>
      </Modal>
    </>
  )
}

export default Home
