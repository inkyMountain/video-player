import { FC, useEffect, useRef } from 'react'
import './Player.scss'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import { useSearchParams } from 'react-router-dom'

const Player: FC<{}> = () => {
  const videoRef = useRef<HTMLVideoElement>(null!)
  useEffect(() => {
    const player = videojs(videoRef.current)
    player.play()
    // videoRef.current.play()
  }, [])

  const [searchParams, _setSearchParams] = useSearchParams()
  const searchParamsMap = new Map(searchParams.entries())
  const filePath = searchParamsMap.get('filePath')

  return (
    <div className="player">
      filePath: {filePath}
      {filePath ? (
        <video ref={videoRef}>
          {/* <source src="local-file:///Users/chenyitao/Downloads/test.jpg" /> */}
          <source src={`local-file://${filePath}`} />
        </video>
      ) : (
        '无视频地址'
      )}
      {/* <img src="local-file:///Users/chenyitao/Downloads/test.jpg" alt="" /> */}
    </div>
  )
}

export default Player
