import { FC, useEffect, useRef, useState } from 'react'
import './Player.scss'
import 'video.js/dist/video-js.min.css'
import '@videojs/themes/dist/city/index.css'
import '@videojs/themes/dist/sea/index.css'
import '@videojs/themes/dist/fantasy/index.css'
import '@videojs/themes/dist/forest/index.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import classnames from 'classnames'
import { useImmer } from 'use-immer'
import { useDebounceFn, useFullscreen, useMemoizedFn } from 'ahooks'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import NavigationBar from '@renderer/components/NavigationBar/NavigationBar'
import { MediaConnection, Peer } from 'peerjs'
import Modal from 'react-modal'
import usePeerStore from '@renderer/store/peerStore'
import { Left } from '@icon-park/react'

const VideoPlayer: FC<{}> = () => {
  const videoRef = useRef<
    HTMLVideoElement & { captureStream: HTMLCanvasElement['captureStream'] }
  >(null)
  const wrapperRef = useRef<HTMLDivElement>(null!)
  const peerStore = usePeerStore()
  // useEffect(() => {
  //   return () => {
  //     peerStore.peer.off('open', onOpen)
  //     peerStore.peer.off('disconnected', onDisconnected)
  //   }
  // }, [])

  const navigate = useNavigate()
  const [isFullscreen, { enterFullscreen, exitFullscreen, toggleFullscreen }] =
    useFullscreen(wrapperRef.current, {})

  const [progress, setProgress] = useImmer({
    duration: 0,
    currentTime: 0,
  })

  // const [controlsVisible, setControlsVisible] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const { run: hideControls } = useDebounceFn(
    () => {
      // setControlsVisible(false)
    },
    { wait: 1000 },
  )
  useEffect(() => {
    const onMouseMove = () => {
      // setControlsVisible(true)
      hideControls()
    }
    const onMouseLeave = () => {
      // setControlsVisible(false)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  // 等视频加载完成后，自动开始播放。
  useEffect(() => {
    const onCanplayThrough = () => {
      videoRef.current?.play()
      const videoWidth = videoRef.current?.videoWidth
      const videoHeight = videoRef.current?.videoHeight
      // if (videoWidth && videoHeight) {
      //   window.api.fileIpc.emitSetWindowSize({
      //     width: videoWidth,
      //     height: videoHeight,
      //   })
      // }
    }
    const onTimeUpdate = () => {
      // if (videoRef.current?.currentTime && videoRef.current?.duration) {
      //   updateProgress({})
      // }
      setProgress((p) => {
        if (videoRef.current?.currentTime) {
          p.currentTime = videoRef.current?.currentTime
        }
        if (videoRef.current?.duration) {
          p.duration = videoRef.current?.duration
        }
      })
    }
    videoRef.current?.addEventListener('timeupdate', onTimeUpdate)
    videoRef.current?.addEventListener('canplaythrough', onCanplayThrough, {
      once: true,
    })
    return () => {
      videoRef.current?.removeEventListener('canplaythrough', onCanplayThrough)
      videoRef.current?.removeEventListener('progress', onTimeUpdate)
    }
  }, [])

  const [searchParams, _setSearchParams] = useSearchParams()
  const searchParamsMap = new Map(searchParams.entries())
  const filePath = searchParamsMap.get('filePath')

  // const peer = useRef<Peer>()
  // const peerId = useRef<string>()
  // const [localPeerId, setLocalPeerId] = useState<string>()
  // if (!peer.current) {
  //   peer.current = new Peer()
  //   peer.current.once('open', (id) => {
  //     console.log('id ===========>', id)
  //     setLocalPeerId(id)
  //   })
  //   peer.current.on('error', (error) => {
  //     console.error('peerjs出错', error)
  //   })
  // }

  const togglePlayState = useMemoizedFn(() => {
    if (videoRef.current?.paused) {
      videoRef.current?.play()
    } else {
      videoRef.current?.pause()
    }
  })

  const [hoverIndicatorPercent, setHoverIndicatorPercent] = useState(0)
  const [hoverIndicatorVisible, setHoverIndicatorVisible] = useState(false)

  const [shareModalVisible, setShareModalVisible] = useState(false)

  useEffect(() => {
    const listener = (call: MediaConnection) => {
      const stream = videoRef.current?.captureStream()
      // const track = document.createElement('track')
      // track.track
      if (stream) {
        call.answer(stream)
        console.log('call answer')
      }
    }
    peerStore.getPeer().on?.('call', listener)
    return () => {
      peerStore.getPeer().off?.('call', listener)
    }
  }, [])

  useEffect(() => {
    document.title = '分享者'
  }, [])

  return (
    <div className="player" ref={wrapperRef}>
      {filePath ? (
        <video
          autoPlay
          loop={false}
          onDoubleClick={() => {
            toggleFullscreen()
          }}
          onContextMenu={() => {
            togglePlayState()
          }}
          onClick={() => {
            // togglePlayState()
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

      <div className="control-layer">
        <header
          className="navigation-bar-wrapper"
          style={{
            opacity: controlsVisible ? 1 : 0,
            pointerEvents: controlsVisible ? 'all' : 'none',
          }}
        >
          <NavigationBar
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
            backButton={<Left style={{ color: 'whitesmoke' }} />}
          />
        </header>

        <footer
          className="control-bar"
          style={{
            opacity: controlsVisible ? 1 : 0,
            pointerEvents: controlsVisible ? 'all' : 'none',
          }}
        >
          <div className="first-row">
            <div className="left-buttons">
              <button
                onClick={() => {
                  setShareModalVisible(true)
                }}
              >
                分享画面
              </button>
            </div>
            <div className="center-buttons">
              <button>上一集</button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime -= 10
                  }
                }}
              >
                快退10s
              </button>
              <button onClick={() => togglePlayState()}>
                {videoRef.current?.paused ? '播放' : '暂停'}
              </button>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime += 10
                  }
                }}
              >
                快进10s
              </button>
              <button>下一集</button>
            </div>
            <div className="right-buttons">
              <button
                onClick={() => {
                  toggleFullscreen()
                }}
              >
                全屏
              </button>
            </div>
          </div>

          <div className="second-row">
            <div
              className="progress"
              onMouseMove={(event) => {
                setHoverIndicatorVisible(true)
                const { left, width } =
                  event.currentTarget.getBoundingClientRect()
                const newPercent = (event.clientX - left) / width
                setHoverIndicatorPercent(newPercent)
              }}
              onMouseLeave={() => {
                setHoverIndicatorVisible(false)
              }}
              onClick={(event) => {
                setHoverIndicatorVisible(false)
                const { width, left } =
                  event.currentTarget.getBoundingClientRect()
                const percent = (event.clientX - left) / width
                if (videoRef.current) {
                  const currentTime = videoRef.current.duration * percent
                  videoRef.current.currentTime = currentTime
                  setProgress((p) => {
                    p.currentTime = currentTime
                  })
                }
              }}
            >
              <div
                className="done"
                style={{
                  transform: `translateX(${
                    (progress.currentTime / progress.duration) * 100
                  }%)`,
                }}
              />
              {hoverIndicatorVisible && (
                <div
                  className="hover-indicator"
                  style={{
                    transform: `translateX(${hoverIndicatorPercent * 100}%)`,
                  }}
                />
              )}
              <div className="current-time">
                {progress.currentTime.toFixed(0)}
              </div>
              <div className="total-time">{progress.duration.toFixed(0)}</div>
            </div>
          </div>
        </footer>
      </div>

      <Modal
        // style={{ content: { inset: 'auto' } }}
        isOpen={shareModalVisible}
        shouldCloseOnEsc={true}
      >
        <div>复制这个id发送给朋友，ta将看到你的视频画面。</div>
        <div>
          {peerStore.localPeerId}
          <CopyToClipboard
            text={peerStore.localPeerId}
            onCopy={() => {
              setShareModalVisible(false)
            }}
          >
            <button>点击复制</button>
          </CopyToClipboard>
        </div>
        <button
          onClick={() => {
            setShareModalVisible(false)
          }}
        >
          关闭弹窗
        </button>
      </Modal>
    </div>
  )
}

export default VideoPlayer
