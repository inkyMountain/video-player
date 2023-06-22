import { FC, useEffect, useRef } from 'react'
import './Player.scss'
import 'video.js/dist/video-js.min.css'
import '@videojs/themes/dist/city/index.css'
import '@videojs/themes/dist/sea/index.css'
import '@videojs/themes/dist/fantasy/index.css'
import '@videojs/themes/dist/forest/index.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import Player from 'video.js/dist/types/player'
import { useFullscreen, useMemoizedFn } from 'ahooks'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'

const VideoPlayer: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
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

  const togglePlayState = useMemoizedFn(() => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  })

  return (
    <div className="player">
      <header className="navigation-bar-wrapper">
        <NavigationBar />
      </header>
      {filePath ? (
        <video
          onDoubleClick={() => {
            toggleFullscreen()
          }}
          onContextMenu={() => {
            togglePlayState()
          }}
          onClick={() => {
            togglePlayState()
          }}
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
    </div>
  )
}

export default VideoPlayer
