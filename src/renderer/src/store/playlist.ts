// create: 创建一个 store
import { create } from 'zustand'
// immer 修改 store 数据的帮助函数
import { immer } from 'zustand/middleware/immer'

interface PlaylistStore {
  playlistLocations: Array<Common.PlaylistLocation>
  setPlaylistLocations: (playlists: Array<Common.PlaylistLocation>) => void
  pushPlaylistLocation: (playlist: Common.PlaylistLocation) => void
  clearPlaylistLocations: () => void

  playlists: Record<string, Common.Playlist>
  setPlaylist: (playlists: Record<string, Common.Playlist>) => void
  addPlaylist: (playlist: Common.Playlist) => void
  clearPlaylists: () => void
}

const usePlaylistStore = create(
  // immer：是一个 zustand store 中间件，克服react傻逼毛病的伟大发明，可以直接修改对象或者数组的属性，
  // 来生成一个新的对象或者数组，确保 store 中的 state 能成功更新界面。

  // set: 更新 store
  // get：获取 store 的值
  immer<PlaylistStore>((set) => {
    return {
      playlistLocations: [],
      // 把播放列表文件夹数组，替换成新传入的数组。
      setPlaylistLocations(newPlaylists) {
        set((store) => {
          store.playlistLocations = newPlaylists
        })
      },
      // 增加一个文件夹路径
      pushPlaylistLocation(newPlaylist) {
        set(({ playlistLocations: playlists }) => {
          playlists.push(newPlaylist)
        })
      },
      // 清空文件夹路径
      clearPlaylistLocations() {
        set((store) => {
          store.playlistLocations = []
        })
      },

      // 所有文件夹的视频文件信息。key是文件夹路径，值是这个文件夹路径下所有视频文件的信息。
      playlists: {},
      // 添加一个文件夹的视频文件信息
      addPlaylist(newPlaylist) {
        set((store) => {
          if (!newPlaylist.folderPath) {
            return
          }
          store.playlists[newPlaylist.folderPath] = newPlaylist
        })
      },
      // 完全替换所有文件夹的视频信息
      setPlaylist(newPlaylists) {
        set((store) => {
          store.playlists = newPlaylists
        })
      },
      // 清空文件夹信息
      clearPlaylists() {
        set((store) => {
          store.playlists = {}
        })
      },
    }
  }),
)

export default usePlaylistStore
