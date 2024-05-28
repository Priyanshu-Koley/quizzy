import './App.css';
import React, { useEffect, useState } from 'react';
// import { Routes, Route, Navigate} from 'react-router';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import CreateMcqSingle from './components/CreateMcqSingle';
import QuizList from './components/QuizList';
import PlayQuiz from './components/PlayQuiz';
import NotFound from './components/NotFound';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState("");

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      let userObj = jwtDecode(jwt);
      userObj.firstLetter = userObj.name.charAt(0);
      setUser(userObj);
    }
  }, []);
  
  const isLoggedIn = () => {
    const jwt = localStorage.getItem('token');
    if (jwt) {
      // Decode the JWT
      const decodedJwt = jwtDecode(jwt);
      // Check if the JWT is expired
      if (decodedJwt.exp < Date.now() / 1000) {
        // The JWT is expired, so the user is not logged in
        localStorage.removeItem("token");
        return false;
      } else {
        // The JWT is valid, so the user is logged in
        return true;
      }
    } else {
      // The user is not logged in
      localStorage.removeItem("token");
      return false;
    }
  };

  const PrivateRoute = ({ element, token, ...rest }) => {
    return isLoggedIn() ? element : <Navigate to="/login" />;
  };
  
  return (
    <div className='app'>      
    {/* defining the routes */}
        <Routes>
          <Route path="/login" element={<Login setToken={setToken} setUser={setUser}/>} />
          <Route path="/" element={<PrivateRoute token={token} element={<Home user={user} />} />} />
          <Route path="/mcq-single" element={<PrivateRoute token={token} element={<CreateMcqSingle user={user} />} />} />
          <Route path="/quizzes" element={<PrivateRoute token={token} element={<QuizList user={user} />} />} />
          <Route path="/play" element={<PrivateRoute token={token} element={<PlayQuiz user={user} />} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </div>
    
  );
}



export default App;
