import ReactDOM from 'react-dom/client'
import './assets/index.scss'
import App from './App'
import { RouterProvider } from 'react-router-dom'
import router from './router'

window.api.videoIpc.onOpenFile(({ url }) => {
  const searchParams = new URLSearchParams({
    filePath: encodeURIComponent(url),
  })
  router.navigate({ pathname: `/video/player?${searchParams.toString()}` })
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App>
    <RouterProvider router={router} />
  </App>,
)
