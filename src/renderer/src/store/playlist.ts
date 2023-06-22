import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface PlaylistStore {
  playlistLocation: Array<Common.PlaylistLocation>
  setPlaylistLocations: (playlists: Array<Common.PlaylistLocation>) => void
  pushPlaylistLocations: (playlist: Common.PlaylistLocation) => void
  clearPlaylistLocations: () => void

  playlists: Record<string, Common.Playlist>
  setPlaylist: (playlists: Record<string, Common.Playlist>) => void
  addPlaylist: (playlist: Common.Playlist) => void
  clearPlaylists: () => void
}

const usePlaylistStore = create(
  immer<PlaylistStore>((set, get) => {
    return {
      playlistLocation: [],
      setPlaylistLocations(newPlaylists) {
        set((store) => {
          store.playlistLocation = newPlaylists
        })
      },
      pushPlaylistLocations(newPlaylist) {
        set(({ playlistLocation: playlists }) => {
          playlists.push(newPlaylist)
        })
      },
      clearPlaylistLocations() {
        set((store) => {
          store.playlistLocation = []
        })
      },

      playlists: {},
      addPlaylist(newPlaylist) {
        set((store) => {
          if (!newPlaylist.folderPath) {
            return
          }
          store.playlists[newPlaylist.folderPath] = newPlaylist
        })
      },
      setPlaylist(newPlaylists) {
        set((store) => {
          store.playlists = newPlaylists
        })
      },
      clearPlaylists() {
        set((store) => {
          store.playlists = {}
        })
      },
    }
  }),
)

export default usePlaylistStore
