// src/pages/Orcamento.jsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

const Orcamento = () => {
  const [orcamentos, setOrcamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [novoOrcamento, setNovoOrcamento] = useState({ cliente: '', descricao: '', valor: '' });
  const [valorManual, setValorManual] = useState('');
  const [busca, setBusca] = useState('');
  const [orcamentoSelecionado, setOrcamentoSelecionado] = useState(null);
  const [mostrarPrint, setMostrarPrint] = useState(false);

  const buscarOrcamentos = async () => {
    try {
      const res = await fetch('http://localhost:3001/orcamentos');
      const data = await res.json();
      setOrcamentos(data);
    } catch (erro) {
      console.error('Erro ao buscar orçamentos:', erro);
    }
  };

  const buscarServicos = async () => {
    try {
      const res = await fetch('http://localhost:3001/servicos');
      const data = await res.json();
      setServicos(data);
    } catch (erro) {
      console.error('Erro ao buscar serviços:', erro);
    }
  };

  const calcularDescricaoEValor = (ids) => {
    const selecionados = servicos.filter((s) => ids.includes(s._id));
    const descricao = selecionados.map((s) => s.nome).join(', ');
    const valorTotal = selecionados.reduce((acc, s) => acc + s.valor, 0);
    setNovoOrcamento((prev) => ({ ...prev, descricao, valor: valorTotal }));
    setValorManual(valorTotal);
  };

  const adicionarOrcamento = async () => {
    try {
      const res = await fetch('http://localhost:3001/orcamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...novoOrcamento,
          valor: parseFloat(valorManual),
        }),
      });
      const criado = await res.json();
      setOrcamentos((prev) => [...prev, criado]);
      setNovoOrcamento({ cliente: '', descricao: '', valor: '' });
      setValorManual('');
      setServicosSelecionados([]);
    } catch (erro) {
      console.error('Erro ao adicionar orçamento:', erro);
    }
  };

  const deletarOrcamento = async (id) => {
    if (!window.confirm('Deseja realmente excluir este orçamento?')) return;
    try {
      await fetch(`http://localhost:3001/orcamentos/${id}`, { method: 'DELETE' });
      setOrcamentos(orcamentos.filter((o) => o._id !== id));
    } catch (erro) {
      console.error('Erro ao deletar orçamento:', erro);
    }
  };

  const imprimirOrcamento = (orcamento) => {
    setOrcamentoSelecionado(orcamento);
    setMostrarPrint(true);
    setTimeout(() => {
      window.print();
      setMostrarPrint(false);
    }, 300);
  };

  useEffect(() => {
    buscarOrcamentos();
    buscarServicos();
  }, []);

  const orcamentosFiltrados = orcamentos.filter((orc) =>
    orc.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    orc.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Orçamentos
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }} className="no-print">
        <Typography variant="h6">Criar Novo Orçamento</Typography>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField label="Nome do Cliente" value={novoOrcamento.cliente} onChange={(e) => setNovoOrcamento({ ...novoOrcamento, cliente: e.target.value })} />

          <FormControl>
            <InputLabel>Selecionar Serviços</InputLabel>
            <Select multiple value={servicosSelecionados} onChange={(e) => { const ids = e.target.value; setServicosSelecionados(ids); calcularDescricaoEValor(ids); }} renderValue={(selected) => servicos.filter((s) => selected.includes(s._id)).map((s) => s.nome).join(', ')}>
              {servicos.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  <Checkbox checked={servicosSelecionados.includes(s._id)} />
                  <ListItemText primary={`${s.nome} - £ ${s.valor}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Descrição" multiline value={novoOrcamento.descricao} onChange={(e) => setNovoOrcamento({ ...novoOrcamento, descricao: e.target.value })} />

          <TextField label="Valor Total (£)" type="number" value={valorManual} onChange={(e) => setValorManual(e.target.value)} />

          <Button variant="contained" onClick={adicionarOrcamento}>Salvar Orçamento</Button>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }} className="no-print">
        <Typography variant="h6">Orçamentos Salvos</Typography>

        <TextField label="Buscar por cliente ou descrição" value={busca} onChange={(e) => setBusca(e.target.value)} fullWidth sx={{ mt: 2, mb: 2 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orcamentosFiltrados.map((orc) => (
                <TableRow key={orc._id}>
                  <TableCell>{orc.cliente}</TableCell>
                  <TableCell>{orc.descricao}</TableCell>
                  <TableCell>£{orc.valor.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => imprimirOrcamento(orc)}><PrintIcon /></IconButton>
                    <IconButton onClick={() => deletarOrcamento(orc._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Layout de impressão individual */}
      {mostrarPrint && orcamentoSelecionado && (
        <Box sx={{ p: 4 }} className="print-only">
          <Typography variant="h4" gutterBottom>Orçamento - Lider Motorcycles</Typography>
          <Typography variant="subtitle1">Cliente: {orcamentoSelecionado.cliente}</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Descrição: {orcamentoSelecionado.descricao}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>Total:£{orcamentoSelecionado.valor.toFixed(2)}</Typography>
          <Typography sx={{ mt: 4, fontSize: 12 }}>*Este documento é apenas uma proposta de serviço. Válido por 7 dias.</Typography>
        </Box>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
        }
        .print-only { display: none; }
      `}</style>
    </Box>
  );
};

export default Orcamento;
