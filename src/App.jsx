import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box, AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import PrivateRoute from './components/PrivateRoute';  // Verifique se o PrivateRoute está correto
import Sidebar from './components/Sidebar';  // Sidebar fixo
import Estoque from './pages/Estoque';      // Página de Estoque
import Pagamento from './pages/Pagamento';  // Página de Pagamento
import Relatorio from './pages/Relatorio';  // Página de Relatório
import Login from './pages/Login';          // Página de Login
import Orcamento from './pages/Orcamento';
import Gastos from './pages/Gastos';
import Servicos from './pages/Servicos';
import Clientes from './pages/Clientes';
import MotosAlugadas from './pages/MotosAlugadas';

function App() {
  const [modoEscuro, setModoEscuro] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: modoEscuro ? 'dark' : 'light',
          primary: { main: '#1976d2' },
          secondary: { main: '#ff9800' },
        },
      }),
    [modoEscuro]
  );

  // Handle Login
  const handleLogin = () => {
    localStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
    navigate('/estoque'); // Redireciona para Estoque após o login
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Verifica o status de autenticação ao carregar
  useEffect(() => {
    const authStatus = localStorage.getItem('auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        {isAuthenticated && <Sidebar />} {/* Sidebar sempre presente */}

        <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Lider Motorcycles
              </Typography>
              <IconButton color="inherit" onClick={() => setModoEscuro(!modoEscuro)}>
                {modoEscuro ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              {isAuthenticated && (
                <Button color="inherit" onClick={handleLogout}>LOGOUT</Button>
              )}
            </Toolbar>
          </AppBar>

          <Routes>
            {/* Rota do login */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Página inicial */}
            <Route path="/" element={<PrivateRoute element={<Estoque />} />} />

            {/* Outras páginas privadas */}
            <Route path="/estoque" element={<PrivateRoute element={<Estoque />} />} />
            <Route path="/pagamento" element={<PrivateRoute element={<Pagamento />} />} />
            <Route path="/relatorio" element={<PrivateRoute element={<Relatorio />} />} />
            <Route path="/orcamento" element={<PrivateRoute element={<Orcamento />} />} />
            <Route path="/servicos" element={<PrivateRoute element={<Servicos />} />} />
            <Route path="/gastos" element={<PrivateRoute element={<Gastos />} />} />
            <Route path="/clientes" element={<PrivateRoute element={<Clientes />} />} />
            <Route path="/motos-alugadas" element={<PrivateRoute element={<MotosAlugadas />} />} />

          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
