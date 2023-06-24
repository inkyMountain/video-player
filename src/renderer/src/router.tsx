import {
  RouteObject,
  createBrowserRouter,
  createHashRouter,
} from 'react-router-dom'
import VideoPlayer from './pages/Player/Player'
import History from './pages/History/History'
import Home from './pages/Home/Home'
import PlaylistDetail from './pages/PlaylistDetail/PlaylistDetail'
import Follower from './pages/Follower/Follower'

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
    element: <VideoPlayer />,
    path: 'video/player',
  },
  {
    element: <History />,
    path: 'video/history',
  },
  {
    element: <Follower />,
    path: 'video/follower',
  },
]

type Router = ReturnType<typeof createBrowserRouter>
const router: Router = createHashRouter(routes)

export default router
