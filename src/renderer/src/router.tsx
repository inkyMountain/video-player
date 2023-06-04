import { RouteObject, createBrowserRouter } from 'react-router-dom'
import Player from './pages/Player'
import Detail from './pages/Detail'
import History from './pages/History'

const routes: Array<RouteObject> = [
  {
    element: <Player />,
    path: 'video/player/:url',
  },
  {
    element: <History />,
    path: 'video/history',
  },
  {
    element: <Detail />,
    path: 'video/detail',
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createBrowserRouter(routes)

export default router
