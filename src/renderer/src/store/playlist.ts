import { create } from 'zustand'
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
  immer<PlaylistStore>((set, get) => {
    return {
      playlistLocations: [],
      setPlaylistLocations(newPlaylists) {
        set((store) => {
          store.playlistLocations = newPlaylists
        })
      },
      pushPlaylistLocation(newPlaylist) {
        set(({ playlistLocations: playlists }) => {
          playlists.push(newPlaylist)
        })
      },
      clearPlaylistLocations() {
        set((store) => {
          store.playlistLocations = []
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
