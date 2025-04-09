// src/pages/Gastos.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { saveAs } from 'file-saver';

const CATEGORIAS = ['Aluguel', 'Água', 'Energia', 'Funcionários', 'Impostos', 'Outros'];
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00c49f', '#ffbb28'];

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [novoGasto, setNovoGasto] = useState({ categoria: '', descricao: '', valor: '', data: '' });

  const buscarGastos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE.API_URL}/gastos`);
      const data = await res.json();
      setGastos(data);
    } catch (err) {
      console.error('Erro ao buscar gastos:', err);
    }
  };

  const salvarGasto = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE.API_URL}/gastos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...novoGasto,
          valor: parseFloat(novoGasto.valor),
          data: novoGasto.data || new Date().toISOString().split('T')[0],
        }),
      });
      const salvo = await res.json();
      setGastos([...gastos, salvo]);
      setNovoGasto({ categoria: '', descricao: '', valor: '', data: '' });
    } catch (err) {
      console.error('Erro ao salvar gasto:', err);
    }
  };

  const totalGeral = gastos.reduce((acc, g) => acc + g.valor, 0);

  const dadosPizza = CATEGORIAS.map((cat) => {
    const total = gastos.filter((g) => g.categoria === cat).reduce((acc, g) => acc + g.valor, 0);
    return { name: cat, value: total };
  });

  const exportarCSV = () => {
    const linhas = [
      ['Categoria', 'Descrição', 'Valor', 'Data'],
      ...gastos.map((g) => [g.categoria, g.descricao, g.valor.toFixed(2), g.data]),
      ['Total Geral', '', totalGeral.toFixed(2), ''],
    ];
    const conteudo = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'gastos.csv');
  };

  useEffect(() => {
    buscarGastos();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Controle de Gastos</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Adicionar Gasto</Typography>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            select
            label="Categoria"
            value={novoGasto.categoria}
            onChange={(e) => setNovoGasto({ ...novoGasto, categoria: e.target.value })}
          >
            {CATEGORIAS.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Descrição"
            value={novoGasto.descricao}
            onChange={(e) => setNovoGasto({ ...novoGasto, descricao: e.target.value })}
          />

          <TextField
            label="Valor"
            type="number"
            value={novoGasto.valor}
            onChange={(e) => setNovoGasto({ ...novoGasto, valor: e.target.value })}
          />

          <TextField
            label="Data"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={novoGasto.data}
            onChange={(e) => setNovoGasto({ ...novoGasto, data: e.target.value })}
          />

          <Button variant="contained" onClick={salvarGasto}>Salvar</Button>
        </Stack>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Total Geral de Gastos</Typography>
              <Typography variant="h6">£{totalGeral.toFixed(2)}</Typography>
              <Button sx={{ mt: 1 }} onClick={exportarCSV}>Exportar CSV</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Distribuição por Categoria</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dadosPizza}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {dadosPizza.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Lista de Gastos</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gastos.map((g) => (
                <TableRow key={g._id}>
                  <TableCell>{g.categoria}</TableCell>
                  <TableCell>{g.descricao}</TableCell>
                  <TableCell>£{g.valor.toFixed(2)}</TableCell>
                  <TableCell>{g.data}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Gastos;
