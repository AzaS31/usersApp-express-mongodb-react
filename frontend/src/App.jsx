import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Users from './pages/Users';          
import EditUserPage from './pages/EditUserPage'; 

import Header from './components/Header';
import Footer from './components/Footer';
import { Box } from '@mui/material';

function PrivateRoute({ token, children }) {
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header token={token} logout={logout} />

        <Box component="main" sx={{ flex: 1, p: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={setToken} />} />

            {/* Список пользователей */}
            <Route
              path="/users"
              element={
                <PrivateRoute token={token}>
                  <Users />
                </PrivateRoute>
              }
            />

            {/* Добавление нового пользователя */}
            <Route
              path="/users/add"
              element={
                <PrivateRoute token={token}>
                  <EditUserPage />
                </PrivateRoute>
              }
            />

            {/* Редактирование существующего пользователя */}
            <Route
              path="/users/edit/:id"
              element={
                <PrivateRoute token={token}>
                  <EditUserPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}
