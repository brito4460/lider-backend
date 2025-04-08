// src/pages/Clientes.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', placa: '', modelo: '', observacoes: '', saldoDevedor: 0 });
  const [busca, setBusca] = useState('');
  const [clienteEditando, setClienteEditando] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const buscarClientes = async () => {
    try {
      const resposta = await fetch('${process.env.REACT_APP_API_URL}/clientes');
      const dados = await resposta.json();
      setClientes(dados);
    } catch (erro) {
      console.error('Erro ao buscar clientes:', erro);
    }
  };

  const adicionarCliente = async () => {
    try {
      const resposta = await fetch('${process.env.REACT_APP_API_URL}/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoCliente),
      });
      const clienteAdicionado = await resposta.json();
      setClientes((prev) => [...prev, clienteAdicionado]);
      setNovoCliente({ nome: '', telefone: '', placa: '', modelo: '', observacoes: '', saldoDevedor: 0 });
    } catch (erro) {
      console.error('Erro ao cadastrar cliente:', erro);
    }
  };

  const deletarCliente = async (id) => {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/clientes/${id}`, { method: 'DELETE' });
      setClientes(clientes.filter((c) => c._id !== id));
    } catch (erro) {
      console.error('Erro ao deletar cliente:', erro);
    }
  };

  const abrirEdicao = (cliente) => {
    setClienteEditando({ ...cliente });
    setEditDialogOpen(true);
  };

  const salvarEdicao = async () => {
    try {
      const resposta = await fetch(`${process.env.REACT_APP_API_URL}/clientes/${clienteEditando._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteEditando),
      });
      const atualizado = await resposta.json();
      setClientes(clientes.map((c) => (c._id === atualizado._id ? atualizado : c)));
      setEditDialogOpen(false);
    } catch (erro) {
      console.error('Erro ao editar cliente:', erro);
    }
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.placa.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Clientes
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Cadastrar Novo Cliente
        </Typography>

        <Stack spacing={2} direction="row" sx={{ mb: 2, flexWrap: 'wrap' }}>
          <TextField label="Nome" value={novoCliente.nome} onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })} />
          <TextField label="Telefone" value={novoCliente.telefone} onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })} />
          <TextField label="Placa da Moto" value={novoCliente.placa} onChange={(e) => setNovoCliente({ ...novoCliente, placa: e.target.value })} />
          <TextField label="Modelo da Moto" value={novoCliente.modelo} onChange={(e) => setNovoCliente({ ...novoCliente, modelo: e.target.value })} />
          <TextField label="Observações" value={novoCliente.observacoes} onChange={(e) => setNovoCliente({ ...novoCliente, observacoes: e.target.value })} />
          <TextField label="Saldo Devedor (£)" type="number" value={novoCliente.saldoDevedor} onChange={(e) => setNovoCliente({ ...novoCliente, saldoDevedor: Number(e.target.value) })} />
          <Button variant="contained" onClick={adicionarCliente}>Cadastrar Cliente</Button>
        </Stack>
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Lista de Clientes
        </Typography>

        <TextField
          label="Buscar por nome, telefone ou placa"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {clientesFiltrados.length === 0 ? (
          <Typography>Nenhum cliente encontrado.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Telefone</TableCell>
                  <TableCell>Placa</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Observações</TableCell>
                  <TableCell>Saldo Devedor (£)</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clientesFiltrados.map((cliente) => (
                  <TableRow key={cliente._id}>
                    <TableCell>{cliente.nome}</TableCell>
                    <TableCell>{cliente.telefone}</TableCell>
                    <TableCell>{cliente.placa}</TableCell>
                    <TableCell>{cliente.modelo}</TableCell>
                    <TableCell>{cliente.observacoes}</TableCell>
                    <TableCell>{cliente.saldoDevedor?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => abrirEdicao(cliente)}><EditIcon /></IconButton>
                      <IconButton onClick={() => deletarCliente(cliente._id)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Nome" value={clienteEditando?.nome || ''} onChange={(e) => setClienteEditando({ ...clienteEditando, nome: e.target.value })} />
            <TextField label="Telefone" value={clienteEditando?.telefone || ''} onChange={(e) => setClienteEditando({ ...clienteEditando, telefone: e.target.value })} />
            <TextField label="Placa da Moto" value={clienteEditando?.placa || ''} onChange={(e) => setClienteEditando({ ...clienteEditando, placa: e.target.value })} />
            <TextField label="Modelo da Moto" value={clienteEditando?.modelo || ''} onChange={(e) => setClienteEditando({ ...clienteEditando, modelo: e.target.value })} />
            <TextField label="Observações" value={clienteEditando?.observacoes || ''} onChange={(e) => setClienteEditando({ ...clienteEditando, observacoes: e.target.value })} />
            <TextField label="Saldo Devedor (£)" type="number" value={clienteEditando?.saldoDevedor || 0} onChange={(e) => setClienteEditando({ ...clienteEditando, saldoDevedor: Number(e.target.value) })} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={salvarEdicao}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clientes;
