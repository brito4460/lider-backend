// src/pages/Relatorio.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { saveAs } from 'file-saver';

const Relatorio = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [pagamentos, setPagamentos] = useState([]);
  const [busca, setBusca] = useState('');

  const buscarDados = async () => {
    try {
      const [resOrc, resGas, resPag] = await Promise.all([
        fetch('${process.env.REACT_APP_API_URL}orcamentos'),
        fetch('${process.env.REACT_APP_API_URL}/gastos'),
        fetch('${process.env.REACT_APP_API_URL}/pagamentos'),
      ]);
      const [dataOrc, dataGas, dataPag] = await Promise.all([
        resOrc.json(),
        resGas.json(),
        resPag.json(),
      ]);
      setOrcamentos(dataOrc);
      setGastos(dataGas);
      setPagamentos(dataPag);
    } catch (erro) {
      console.error('Erro ao buscar dados:', erro);
    }
  };

  useEffect(() => {
    buscarDados();
  }, []);

  const orcFiltrados = orcamentos.filter((item) =>
    item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    item.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const totalReceita = orcFiltrados.reduce((acc, item) => acc + item.valor, 0);
  const totalDespesa = gastos.reduce((acc, g) => acc + g.valor, 0);
  const totalPagamentos = pagamentos.reduce((acc, p) => acc + p.valorTotal, 0);
  const lucroLiquido = totalReceita - totalDespesa;

  const agrupadoMensal = {};
  [...orcFiltrados, ...gastos].forEach((item) => {
    const tipo = item.cliente ? 'receita' : 'despesa';
    const data = new Date(item.data || item.createdAt || new Date());
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    if (!agrupadoMensal[chave]) agrupadoMensal[chave] = { mes: chave, receita: 0, despesa: 0 };
    agrupadoMensal[chave][tipo] += item.valor;
  });
  const comparativoMes = Object.values(agrupadoMensal).sort((a, b) => a.mes.localeCompare(b.mes));

  const exportarCSV = () => {
    const linhas = [
      ['Cliente', 'Descrição', 'Valor'],
      ...orcFiltrados.map((item) => [item.cliente, item.descricao, item.valor.toFixed(2)]),
      ['Total Receita', '', totalReceita.toFixed(2)],
      ['', '', ''],
      ['Categoria', 'Descrição', 'Valor', 'Data'],
      ...gastos.map((g) => [g.categoria, g.descricao, g.valor.toFixed(2), g.data]),
      ['Total Despesa', '', totalDespesa.toFixed(2), ''],
      ['', '', '', ''],
      ['Lucro Líquido', '', lucroLiquido.toFixed(2), '']
    ];
    const conteudo = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'relatorio-completo.csv');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Relatório Financeiro Completo
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2">Receita Total</Typography>
            <Typography variant="h6">£{totalReceita.toFixed(2)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2">Despesas Totais</Typography>
            <Typography variant="h6">£{totalDespesa.toFixed(2)}</Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2">Lucro Líquido</Typography>
            <Typography variant="h6" color={lucroLiquido >= 0 ? 'green' : 'error'}>
              £ {lucroLiquido.toFixed(2)}
            </Typography>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card><CardContent>
            <Typography variant="subtitle2">Total em Pagamentos</Typography>
            <Typography variant="h6">£{totalPagamentos.toFixed(2)}</Typography>
          </CardContent></Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Buscar por cliente ou descrição"
            fullWidth
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Button variant="outlined" onClick={exportarCSV}>Exportar CSV</Button>
        </Stack>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Comparativo Receita vs Despesa</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparativoMes}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="receita" fill="#4caf50" name="Receita" />
                <Bar dataKey="despesa" fill="#f44336" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Resumo de Orçamentos</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orcFiltrados.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.cliente}</TableCell>
                  <TableCell>{item.descricao}</TableCell>
                  <TableCell>£{item.valor.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Pagamentos Recentes</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Forma</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagamentos.slice(0, 10).map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.formaPagamento}</TableCell>
                  <TableCell>£{p.valorTotal.toFixed(2)}</TableCell>
                  <TableCell>{new Date(p.data).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Relatorio;
