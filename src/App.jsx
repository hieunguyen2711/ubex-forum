import './App.css'
import { useRoutes, useLocation } from 'react-router-dom'
import LogIn from './components/auth/login/LogIn'
import Register from './components/auth/register/Register'
import { AuthProvider } from './contexts/authContext'
import Home from './pages/Home'
import Forum from './pages/Forum'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import SideNav from './components/SideNav'
import ReadPost from './pages/ReadPost'

function App() {
  const location = useLocation();

  const routesArray = [
    {
      path: '/',
      element: <Home/>,
    },
    {
      path: '/login',
      element: <LogIn/>,
    },
    {
      path: '/signup',
      element: <Register/>,
    },
    {
      path: '/home',
      element: <Forum/>,
    },
    {
      path: '/createPost',
      element: <CreatePost/>
    },
    {
      path: '/edit/:id',
      element: <EditPost/>
    },
    {
      path: '/view/:id',
      element: <ReadPost/>
    }
  ];

  let element = useRoutes(routesArray);

  return (
    <AuthProvider>
      {location.pathname !== '/' && location.pathname !== "/login" && location.pathname !== "/signup" && <SideNav/>}
      <div className="App" style={{ minHeight: '100vh', backgroundColor: '#242424', color: 'white' }}>
        {element}
      </div>
    </AuthProvider>  
  )
}

export default App
