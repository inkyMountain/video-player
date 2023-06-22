import { FC, useEffect, useRef } from 'react'
import './Player.scss'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import '@videojs/themes/dist/city/index.css'
import '@videojs/themes/dist/sea/index.css'
import '@videojs/themes/dist/fantasy/index.css'
import '@videojs/themes/dist/forest/index.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { useImmer } from 'use-immer'
import Player from 'video.js/dist/types/player'
import { useFullscreen } from 'ahooks'

const VideoPlayer: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const player = useRef<Player>()
  const navigate = useNavigate()

  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] =
    useFullscreen(videoRef.current, {})

  useEffect(() => {
    const onCanplayThrough = () => {
      videoRef.current?.play()
    }
    videoRef.current?.addEventListener('canplaythrough', onCanplayThrough)
    return () => {
      videoRef.current?.removeEventListener('canplaythrough', onCanplayThrough)
    }
    // player.current = videojs(videoRef.current, {
    //   controls: true,
    //   // autoPlay: true,
    // })
    // const onPlay = () => {
    //   const videoWidth = player.current?.videoWidth()
    //   const videoHeight = player.current?.videoHeight()
    //   if (videoWidth && videoHeight) {
    //     window.api.fileIpc.emitSetWindowSize({
    //       width: videoWidth,
    //       height: videoHeight,
    //     })
    //   }
    //   console.log(`videoWidth: ${videoWidth}`, `videoHeight: ${videoHeight}`)
    // }
    // videoRef.current.addEventListener('canplaythrough', onPlay)
    // return () => {
    //   videoRef.current.removeEventListener('canplaythrough', onPlay)
    //   player.current?.dispose()
    // }
  }, [])

  const [searchParams, _setSearchParams] = useSearchParams()
  const searchParamsMap = new Map(searchParams.entries())
  const filePath = searchParamsMap.get('filePath')

  return (
    <div className="player">
      {filePath ? (
        <video
          onDoubleClick={() => {
            alert(isFullscreen)
            toggleFullscreen()
          }}
          onContextMenu={() => {
            if (videoRef.current?.paused) {
              videoRef.current?.play()
            } else {
              videoRef.current?.pause()
            }
          }}
          onClick={(event) => {}}
          className={classnames(
            'video-js',
            'vjs-theme-sea',
            // 'vjs-theme-city',
            // 'vjs-theme-fantasy',
            // 'vjs-theme-forest',
          )}
          ref={videoRef}
        >
          <source src={`local-file://${filePath}`} />
          {/* <source src={`http://localhost:5173/h264.mp4`} /> */}
        </video>
      ) : (
        '无视频地址'
      )}

      <button
        className="close-button"
        onClick={() => {
          navigate(-1)
        }}
      >
        关闭
      </button>
    </div>
  )
}

export default VideoPlayer