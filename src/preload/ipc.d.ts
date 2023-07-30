declare namespace SystemInfoIpc {
  export type PlatformRes = NodeJS.Platform
}
declare namespace VideoIpc {
  export interface OpenVideoReq {
    url: string
  }
  export type OpenVideoRes = {} | void
}

declare namespace FileIpc {
  export type AddLocalFolderReq = {} | void
  export type AddLocalFolderRes = Common.PlaylistLocation | null

  export type GetPlaylistsReq = {} | void
  export type GetPlaylistsRes = {
    playlistLocations: Array<Common.PlaylistLocation>
  }
  export type RevealDbFileReq = {} | void
  export type RevealDbFileRes = void

  export type SetWindowSizeReq = { width: number; height: number }
  export type SetWindowSizeRes = void

  export type GetPlaylistAtReq = Common.PlaylistLocation
  export type GetPlaylistAtRes = Common.Playlist | null

  export type DeletePlaylistLocationReq = Common.PlaylistLocation
  export type DeletePlaylistLocationRes = void
}
