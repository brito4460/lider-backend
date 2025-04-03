// src/pages/Servicos.jsx
import React, { useEffect, useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Servicos = () => {
  const [servicos, setServicos] = useState([]);
  const [novo, setNovo] = useState({ nome: '', descricao: '', valor: '' });
  const [busca, setBusca] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);

  const buscar = async () => {
    const res = await fetch('http://localhost:3001/servicos');
    const data = await res.json();
    setServicos(data);
  };

  const salvar = async () => {
    const res = await fetch('http://localhost:3001/servicos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...novo, valor: parseFloat(novo.valor) }),
    });
    const salvo = await res.json();
    setServicos([...servicos, salvo]);
    setNovo({ nome: '', descricao: '', valor: '' });
  };

  const deletar = async (id) => {
    if (!window.confirm('Excluir este serviço?')) return;
    await fetch(`http://localhost:3001/servicos/${id}`, { method: 'DELETE' });
    setServicos(servicos.filter((s) => s._id !== id));
  };

  const abrirEdicao = (servico) => {
    setServicoEditando({ ...servico });
    setEditDialogOpen(true);
  };

  const salvarEdicao = async () => {
    const res = await fetch(`http://localhost:3001/servicos/${servicoEditando._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...servicoEditando,
        valor: parseFloat(servicoEditando.valor),
      }),
    });
    const atualizado = await res.json();
    setServicos(servicos.map((s) => (s._id === atualizado._id ? atualizado : s)));
    setEditDialogOpen(false);
  };

  useEffect(() => {
    buscar();
  }, []);

  const servicosFiltrados = servicos.filter((s) =>
    s.nome.toLowerCase().includes(busca.toLowerCase()) ||
    s.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Serviços</Typography>

      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6">Novo Serviço</Typography>
        <Stack spacing={2} direction="row" sx={{ mt: 2, flexWrap: 'wrap' }}>
          <TextField label="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
          <TextField label="Descrição" value={novo.descricao} onChange={(e) => setNovo({ ...novo, descricao: e.target.value })} sx={{ minWidth: 200 }} />
          <TextField label="Valor (R$)" type="number" value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: e.target.value })} />
          <Button variant="contained" onClick={salvar}>Salvar</Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Serviços Cadastrados</Typography>

        <TextField
          label="Buscar serviço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicosFiltrados.map((s) => (
                <TableRow key={s._id}>
                  <TableCell>{s.nome}</TableCell>
                  <TableCell>{s.descricao}</TableCell>
                  <TableCell>R$ {s.valor.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => abrirEdicao(s)}><EditIcon /></IconButton>
                    <IconButton onClick={() => deletar(s._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Editar Serviço</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome"
              value={servicoEditando?.nome || ''}
              onChange={(e) => setServicoEditando({ ...servicoEditando, nome: e.target.value })}
            />
            <TextField
              label="Descrição"
              value={servicoEditando?.descricao || ''}
              onChange={(e) => setServicoEditando({ ...servicoEditando, descricao: e.target.value })}
            />
            <TextField
              label="Valor (R$)"
              type="number"
              value={servicoEditando?.valor || ''}
              onChange={(e) => setServicoEditando({ ...servicoEditando, valor: e.target.value })}
            />
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

export default Servicos;
