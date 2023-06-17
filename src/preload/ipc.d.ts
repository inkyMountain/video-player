declare namespace VideoIpc {
  export interface OpenVideoReq {
    url: string
  }
  export type OpenVideoRes = {} | void
}

declare namespace FileIpc {
  export type AddLocalFolderReq = {} | void
  export type AddLocalFolderRes = Common.Playlist

  export type GetPlaylistsReq = {} | void
  export type GetPlaylistsRes = {
    playlists: Array<Common.Playlist>
  }
  export type RevealDbFileReq = {} | void
  export type RevealDbFileRes = void
}

interface PlaylistLocation {
  folderPath?: string
}
