import { FC, PropsWithChildren } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'
import Versions from './components/Versions'

const App: FC<PropsWithChildren> = ({ children }) => {
  // useEffect(() => {
  //   const player = videojs('video', { errorDisplay: false, controls: true })
  //   player.play()
  // }, [])

  return (
    <div className="container">
      <Versions></Versions>
      {children}
    </div>
  )
}

export default App
