import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PlaylistStore {
  playlists: Array<Common.Playlist>
  setPlaylists: (playlists: Array<Common.Playlist>) => void
  pushPlaylist: (playlist: Common.Playlist) => void
  clearPlaylists: () => void
}

const usePlaylistStore = create(
  immer<PlaylistStore>((set, get) => {
    return {
      playlists: [],
      setPlaylists(newPlaylists) {
        set((store) => {
          store.playlists = newPlaylists
        })
      },
      pushPlaylist(newPlaylist) {
        set(({ playlists }) => {
          playlists.push(newPlaylist)
        })
      },
      clearPlaylists() {
        set((store) => {
          store.playlists = []
        })
      },
    }
  }),
)

export default usePlaylistStore
