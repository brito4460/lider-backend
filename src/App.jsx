import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import PrivateRoute from './components/PrivateRoute';
import Sidebar from './components/Sidebar';
import Estoque from './pages/Estoque';
import Pagamento from './pages/Pagamento';
import Relatorio from './pages/Relatorio';
import Login from './pages/Login';
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

  const handleLogin = () => {
    localStorage.setItem('auth', 'true');
    setIsAuthenticated(true);
    navigate('/estoque');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('auth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ display: 'flex' }}>
        {/* Sidebar dentro da classe no-print */}
        {isAuthenticated && (
          <div className="no-print">
            <Sidebar />
          </div>
        )}

        <Box component="main" sx={{ flexGrow: 1, padding: 2 }}>
          {/* Topbar também dentro da no-print */}
          <div className="no-print">
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Lider Motorcycles
                </Typography>
                <IconButton color="inherit" onClick={() => setModoEscuro(!modoEscuro)}>
                  {modoEscuro ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
                {isAuthenticated && (
                  <Button color="inherit" onClick={handleLogout}>
                    LOGOUT
                  </Button>
                )}
              </Toolbar>
            </AppBar>
          </div>

          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/" element={<PrivateRoute element={<Estoque />} />} />
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

      {/* Estilo global para esconder elementos na impressão */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }

          .print-only {
            display: block !important;
          }

          body {
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }

        .print-only {
          display: none;
        }
      `}</style>
    </ThemeProvider>
  );
}

export default App;
