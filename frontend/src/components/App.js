import './App.css';
import Login from "./login";
import Chat from './chat';
import ErrorPage from './errorpage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';

async function isAuthenticated() {
  try{
    const response = await axios.get('http://localhost:8080/authenticate', { withCredentials: true});
    return response.data.result;
  }catch (e) {
    console.log(e);
  }
}

function App() {

  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      console.log(auth);
      setUserIsAuthenticated(auth);
    }
    checkAuth();
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path='/' element={ userIsAuthenticated ? <Navigate to='/chat' /> : <Login /> } />
      <Route path='/chat' element={ userIsAuthenticated ? <Chat /> : <Navigate to='/' /> } />
      <Route path='*' element={ <ErrorPage title="Page Not Found" message="The resource that you're looking for is not available. Please check again the url of the resource that you're looking for." /> } />
    </Routes>
  );
}

export default App;
