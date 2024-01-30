import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil';
import Navbar from './Components/Navbar/Navbar'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import SendMoney from './Pages/SendMoney'
import ErrorPage from './Pages/ErrorPage'
import UserInfo from './Store/User';
import { useCallback, useEffect } from 'react';
import errorPopup from './Store/Error';
import fetchData from './Hooks/ApiCall';
import { useNavigate } from 'react-router-dom'
import isLoggedIn from './Store/IsLoggedIn';
function App() {
  const [user, setUser] = useRecoilState(UserInfo);
  const checkLogin = useRecoilValue(isLoggedIn);
  const [error, setError] = useRecoilState(errorPopup);
  const navigate = useNavigate();
  // call api to get logged in user details
  const getUserDetails = useCallback(async (setError) => {
    try {
      let params = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      }
      const res = await fetchData('/user/detail', params, setError);

      if (res) {
        setUser(res.user);
      } else {
        navigate('/login', { replace: true });
      }
    } catch (error) {
      // Handle error appropriately, e.g., set an error state
      setError(error.message);
    }
  }, [checkLogin]);

  useEffect(() => {
    getUserDetails(setError);
  }, [getUserDetails]);
  return (

    <div className='w-full h-screen overflow-hidden'>
      <Navbar />
      <Routes>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/send' element={<SendMoney />}></Route>
        <Route path='*' element={<ErrorPage />}></Route>
      </Routes>
      {error}
    </div>

  )
}

export default App
