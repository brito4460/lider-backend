import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('auth') === 'true'; // Verifica se o usuário está autenticado
  return isAuthenticated ? element : <Navigate to="/login" />; // Se não autenticado, redireciona para o login
};

export default PrivateRoute;
