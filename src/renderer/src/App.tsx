import { FC, PropsWithChildren } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import Versions from './components/Versions'

const App: FC<PropsWithChildren> = () => {
  // useEffect(() => {
  //   const player = videojs('video', { errorDisplay: false, controls: true })
  //   player.play()
  // }, [])

  return (
    <div className="container">
      <Versions></Versions>
      {/* <video id="video" autoPlay>
        <source src="http://localhost:4000/h264.mp4" />
        <source src="http://localhost:8888/h265.mp4" type="video/mp4" />
      </video> */}
    </div>
  )
}

export default App
