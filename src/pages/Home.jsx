// src/pages/Home.jsx
import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Bem-vindo à Lider Motorcycles
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Escolha uma opção:
        </Typography>

        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/estoque')}>
              Estoque
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/clientes')}>
              Clientes
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/pagamento')}>
              Pagamento
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/orcamento')}>
              Orçamento
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/relatorio')}>
              Relatório
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/servicos')}>
              Serviços
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={() => navigate('/gastos')}>
            Gastos
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Home;
