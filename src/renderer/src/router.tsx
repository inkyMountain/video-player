import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import Player from './pages/Player'
import Detail from './pages/Detail'
import History from './pages/History'
import Home from './pages/Home/Home'
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail'

const routes: Array<RouteObject> = [
  {
    element: <Home />,
    path: '',
  },
  {
    element: <PlaylistDetail />,
    path: 'playlist-detail/:folderPath',
  },
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
const router: Router = createHashRouter(routes)

export default router
