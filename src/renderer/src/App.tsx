import { FC, PropsWithChildren } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.min.css'

const App: FC<PropsWithChildren> = ({ children }) => {
  // useEffect(() => {
  //   const player = videojs('video', { errorDisplay: false, controls: true })
  //   player.play()
  // }, [])

  return <div id="container">{children}</div>
}

export default App
