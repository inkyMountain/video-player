declare namespace Common {
  export interface Playlist {
    folderPath?: string
    folderName?: string
    files: Array<{
      path?: string
      filename?: string
      bitrate?: number
      video: {
        codec?: string
        width?: number
        height?: number
        bitrate?: number
      }
      audio: {
        codec?: string
      }
      subtitles: Array<{
        codec?: string
      }>
    }>
  }

  export interface PlaylistLocation {
    folderPath?: string
  }
}
