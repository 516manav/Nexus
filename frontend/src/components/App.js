import Login from "./login";
import Chat from './chat';
import ErrorPage from './errorpage';
import axios from 'axios';
import { useEffect, useState, useContext } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { UserContext } from "./contexts/usercontext.js";
import { SocketProvider } from "./contexts/socketcontext.js";
import { UserClickedProvider } from "./contexts/userclickedcontext.js";
import { UserDetailsProvider } from "./contexts/userdetails.js";
import { ListClickProvider } from "./contexts/listclickcontext.js";
import { TransitionProvider } from "./contexts/transitioncontext.js";
import { UserDeletedProvider } from "./contexts/userdeletedcontext.js";

async function isAuthenticated() {
  try{
    const response = await axios.get('http://localhost:8080/authenticate', { withCredentials: true});
    return response.data;
  }catch (e) {
    console.log(e);
  }
}

function App() {

  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setUserIsAuthenticated(auth.result);
      setUser(auth.user);
      setLoading(false);
    }
    checkAuth();
  }, [location.pathname, setUser]);

  if(loading)
    return <></>
  
  return (
    <Routes>
      <Route path='/' element={ userIsAuthenticated ? <Navigate to='/chat' /> : <Login /> } />
      <Route path='/chat' element={ userIsAuthenticated ? 
      <SocketProvider>
        <UserDetailsProvider>
          <UserClickedProvider>
            <TransitionProvider>
              <ListClickProvider>
                <UserDeletedProvider>
                  <Chat />
                </UserDeletedProvider>
              </ListClickProvider>
            </TransitionProvider>
          </UserClickedProvider>
        </UserDetailsProvider>
      </SocketProvider> : <Navigate to='/' /> } />
      <Route path='*' element={ <ErrorPage /> } />
    </Routes>
  );
}

export default App;
