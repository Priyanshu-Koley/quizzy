import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/Login.css'
import { FormControl, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import { CircularProgress, IconButton } from '@mui/joy';
import { toast } from 'react-toastify';

const Login = ({ setToken, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('https://localhost:7085/api/Account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          throw new Error(errorData.message || 'Unauthorized access - please check your credentials.');
        } else {
          throw new Error(errorData.message || 'Login failed!');
        }
      }
      else{
        const data = await response.json();
        setToken(data.token);
        let userObj = jwtDecode(data.token);
        userObj.firstLetter = userObj.name.charAt(0);
    
        setUser(userObj);
        localStorage.setItem('token', data.token);
    
        toast.success('Logged in successfully 👌');
        navigate('/');
      }
  
    } catch (error) {
      toast.error(`Login failed! 🤯 ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="form-container">
      {loading ?
        <CircularProgress
          color="primary"
          size="lg"
          value={50}
        />
        :
        <form onSubmit={login} className="login-form">
          <h2>Login</h2>
          <h4>Hello! Login to get started</h4>

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
            <OutlinedInput
              onChange={(e) => setEmail(e.target.value)}
              id="outlined-adornment-email"
              label="Email"
            />
          </FormControl>

          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              onChange={(e) => setPassword(e.target.value)}
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <button type="submit" className='login-btn'>Login</button>
        </form>}
    </div>
  );
};

export default Login;
