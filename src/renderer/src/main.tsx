import ReactDOM from 'react-dom/client'
import './assets/index.css'
import App from './App'
import { RouterProvider } from 'react-router-dom'
import router from './router'

window.api.videoIpc.listenOpenFile(({ url }) => {
  console.log('url ===========>', url)
  router.navigate({ pathname: `/video/player/${encodeURIComponent(url)}` })
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App>
    <RouterProvider router={router} />
  </App>,
)
