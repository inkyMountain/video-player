import { globby } from 'globby'
import ffmpeg from 'fluent-ffmpeg'
import path from 'path'
import log from 'electron-log'
import fsExtra from 'fs-extra'

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

  const result: Common.Playlist = {
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
  }).then((filePaths) => {
    return filePaths.map((p) => path.join(p))
  })
}

const generateThumbnail = async (params: {
  filePath: string
  filename: string
  outputDir: string
  timestamps: string[]
}) => {
  const { filePath, timestamps, outputDir, filename } = params
  return new Promise<void>((resolve, reject) => {
    ffmpeg(filePath)
      .thumbnail({
        filename,
        count: timestamps.length,
        timestamps,
        folder: outputDir,
      })
      .once('error', (error) => reject(error))
      .once('end', () => {
        resolve()
      })
  })
}

const generateSubtitle = async (params: {
  filePath: string
  subtitleLength: number
  outDir: string
}) => {
  const { filePath, subtitleLength, outDir } = params
  const promises: Array<Promise<string>> = []
  for (let i = 0; i < subtitleLength; i++) {
    const parsedFilePath = path.parse(filePath)
    const outputPath = path.join(outDir, `${parsedFilePath.name}_${i}.vtt`)
    const isExist = fsExtra.pathExistsSync(outputPath)
    if (isExist) {
      console.log('字幕文件生成，跳过文件', outputPath)
      promises.push(Promise.resolve(outputPath))
      continue
    }
    const promise = new Promise<string>((resolve, reject) => {
      ffmpeg(filePath)
        .outputOption([`-map 0:s:${i}`])
        .output(outputPath)
        .once('error', (error) => {
          console.log('error ==========>', error)
          reject(error)
        })
        .once('end', () => {
          console.log('end ==========>', outputPath)
          resolve(outputPath)
        })
        .run()
    })
    promises.push(promise)
  }
  // Promise.allSettled的作用是，等待所有 Promise resolve 或者 reject
  return Promise.allSettled(promises)
    .then((settledPromises) => {
      // 筛选出所有成功的结果
      return settledPromises.filter(({ status }) => status === 'fulfilled')
    })
    .then((result) => {
      // 在使用 filter 之后，只剩下成功的结果了。但是ts还不知道，所以需要 as 来断言成成功结果。
      const fulfilledResult = result as Array<PromiseFulfilledResult<string>>
      return fulfilledResult.map(({ value }) => value)
    })
}

const fileUtils = {
  getVideosStatsIn,
  globVideosIn,
  generateThumbnail,
  generateSubtitle,
}

export default fileUtils
