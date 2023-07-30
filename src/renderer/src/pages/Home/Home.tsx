import React, { useMemo, useState } from 'react'
import './Home.scss'
import usePlaylistStore from '@renderer/store/playlist'
import { useNavigate } from 'react-router-dom'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import Modal, { Classes } from 'react-modal'
import useSystemInfoStore from '@renderer/store/systemInfoStore'

interface IProps {}

const isDarkMode = Boolean(
  window.matchMedia('(prefers-color-scheme: dark)').matches,
)

const Home: React.FunctionComponent<IProps> = (props) => {
  const systemInfoStore = useSystemInfoStore()
  const navigate = useNavigate()
  const playlistStore = usePlaylistStore()

  const gotoPlaylistDetailPage = (folderPath: string) => {
    navigate(`/playlist-detail/${encodeURIComponent(folderPath)}`)
  }

  const [joinSessionModalVisible, setJoinSessionModalVisible] = useState(false)
  const [remotePeerId, setRemotePeerId] = useState('')

  const onJoinSessionClick = () => {
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
              const search = new URLSearchParams({
                remotePeerId,
              }).toString()
              navigate({
                pathname: '/video/follower',
                search,
              })
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
