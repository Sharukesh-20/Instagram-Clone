import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import ViewStory from './ViewStory.jsx'
import Profile from './Profile.jsx'
import Notifications from './Notifications.jsx'
import Search from './Search.jsx'
import Messages from './Messages.jsx'
import Reels from './Reels.jsx'
import Explores from './Explores.jsx'
import Creates from './Creates.jsx'

const router = createBrowserRouter(
  [
    {path:'/',element: <App/>},
    {path:'/story/:id/:tot',element: <ViewStory/>},
    {path:'/profile',element: <Profile/>},
    {path:'/notifications',element: <Notifications/>},
    {path:'/search',element: <Search/>},
    {path:'/message',element: <Messages/>},
    {path:'/reels',element: <Reels/>},
    {path:'/explore',element: <Explores/>},
    {path:'/create',element: <Creates/>}
  ]
)

createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
  