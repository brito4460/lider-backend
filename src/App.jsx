// src/App.jsx
import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import '@fontsource/orbitron/600.css'; // peso médio


import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Estoque from './pages/Estoque';
import Clientes from './pages/Clientes';
import Pagamento from './pages/Pagamento';
import Orcamento from './pages/Orcamento';
import Relatorio from './pages/Relatorio';
import Servicos from './pages/Servicos';
import Gastos from './pages/Gastos';

function App() {
  const [modoEscuro, setModoEscuro] = useState(false);

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  Lider Motorcycles
                </Typography>
                <IconButton color="inherit" onClick={() => setModoEscuro(!modoEscuro)}>
                  {modoEscuro ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Toolbar>
            </AppBar>

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/orcamento" element={<Orcamento />} />
              <Route path="/relatorio" element={<Relatorio />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/gastos" element={<Gastos />} />
              <Route path="/pagamento" element={<Pagamento/>} />
              
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
