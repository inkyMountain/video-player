import { globby } from 'globby'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import log from 'electron-log'

const setFfmpegAndFfprobePath = () => {
  const ffmpegBinName =
    process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg-universal'
  const ffmpegBinPath =
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), `resources/ffmpeg-binaries/${ffmpegBinName}`)
      : path.join(process.resourcesPath, ffmpegBinName)
  const ffprobeBinName =
    process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe-universal'
  const ffprobeBinPath =
    process.env.NODE_ENV === 'development'
      ? path.join(process.cwd(), `resources/ffmpeg-binaries/${ffprobeBinName}`)
      : path.join(process.resourcesPath, ffprobeBinName)

  log.info(`
NODE_ENV: ${process.env.NODE_ENV}
ffmpeg路径:${ffmpegBinPath},
ffprobe路径:${ffprobeBinPath},
`)
  ffmpeg.setFfmpegPath(ffmpegBinPath)
  ffmpeg.setFfprobePath(ffprobeBinPath)
}

setFfmpegAndFfprobePath()

const ffprobe = (filePath: string) => {
  return new Promise<ffmpeg.FfprobeData>((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      resolve(data)
    })
  })
}

/**
 * 读取一个文件夹中，指定扩展名的视频文件，
 * 获取它们的视频、音频、字幕等内容的编码格式等媒体信息。
 * @param folderPath 文件夹路径
 * @param extensions 需要过滤出的视频扩展名
 * @returns 文件夹中指定扩展名视频的数据列表
 */
const getVideosStatsIn = async (folderPath: string, extensions: string[]) => {
  const videoFiles = await globVideosIn(folderPath, extensions)
  const res = await Promise.all(videoFiles.map((filePath) => ffprobe(filePath)))

  const result: FileIpc.AddLocalFolderRes = {
    folderPath,
    folderName: path.basename(folderPath),
    files: res.map((stat) => {
      const videoStream = stat.streams.find(
        (stream) => stream.codec_type === 'video',
      )
      const audioStream = stat.streams.find(
        (stream) => stream.codec_type === 'audio',
      )
      const subtitleStreams = stat.streams.filter(
        (stream) => stream.codec_type === 'subtitle',
      )
      return {
        filename: path.basename(stat.format.filename ?? ''),
        bitrate: stat.format.bit_rate,
        path: stat.format.filename,
        video: {
          codec: videoStream?.codec_name,
          width: 0,
          height: 0,
        },
        audio: {
          codec: audioStream?.codec_name,
        },
        subtitles: subtitleStreams.map(({ codec_name }) => {
          return {
            codec: codec_name,
          }
        }),
      }
    }),
  }
  return result
}

const globVideosIn = async (folderPath: string, extensions: string[]) => {
  return globby([`**/*.{${extensions.join(',')}}`], {
    cwd: folderPath,
    absolute: true,
  })
}

const fileUtils = {
  getVideosStatsIn,
  globVideosIn,
}

export default fileUtils
