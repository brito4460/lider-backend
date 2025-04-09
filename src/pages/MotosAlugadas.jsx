// src/pages/MotosAlugadas.jsx
import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import axios from 'axios';

const MotosAlugadas = () => {
  const [formData, setFormData] = useState({ placa: '', modelo: '' });
  const [motos, setMotos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [alugarDialogOpen, setAlugarDialogOpen] = useState(false);
  const [motoSelecionada, setMotoSelecionada] = useState(null);
  const [aluguelData, setAluguelData] = useState({ cliente: '', telefone: '' });

  const API = `${import.meta.env.VITE.API_URL}/motos`;

  const carregarMotos = async () => {
    const res = await axios.get(API);
    setMotos(res.data);
  };

  useEffect(() => {
    carregarMotos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await axios.put(`${API}/${editandoId}`, formData);
      setEditandoId(null);
    } else {
      await axios.post(API, { ...formData, estaAlugada: false, cliente: '', telefone: '' });
    }
    setFormData({ placa: '', modelo: '' });
    carregarMotos();
  };

  const handleEditar = (moto) => {
    setFormData(moto);
    setEditandoId(moto._id);
  };

  const handleExcluir = async (id) => {
    await axios.delete(`${API}/${id}`);
    carregarMotos();
  };

  const abrirDialogAluguel = (moto) => {
    setMotoSelecionada(moto);
    setAluguelData({ cliente: '', telefone: '' });
    setAlugarDialogOpen(true);
  };

  const confirmarAluguel = async () => {
    if (motoSelecionada) {
      await axios.put(`${API}/${motoSelecionada._id}`, {
        ...motoSelecionada,
        estaAlugada: true,
        cliente: aluguelData.cliente,
        telefone: aluguelData.telefone
      });
      setAlugarDialogOpen(false);
      setMotoSelecionada(null);
      carregarMotos();
    }
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
      <Paper sx={{ padding: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editandoId ? 'Editar Moto' : 'Cadastrar Moto'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Placa" name="placa" value={formData.placa} onChange={handleChange} fullWidth margin="normal" required />
          <TextField label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} fullWidth margin="normal" required />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {editandoId ? 'Salvar Alterações' : 'Cadastrar Moto'}
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6">Motos Registradas</Typography>
      {motos.length === 0 ? (
        <Typography>Nenhuma moto cadastrada.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Placa</TableCell>
                <TableCell>Modelo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {motos.map((moto) => (
                <TableRow key={moto._id}>
                  <TableCell>{moto.placa}</TableCell>
                  <TableCell>{moto.modelo}</TableCell>
                  <TableCell>{moto.estaAlugada ? 'Alugada' : 'Disponível'}</TableCell>
                  <TableCell>{moto.cliente}</TableCell>
                  <TableCell>{moto.telefone}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditar(moto)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleExcluir(moto._id)}><DeleteIcon /></IconButton>
                    {!moto.estaAlugada && (
                      <IconButton onClick={() => abrirDialogAluguel(moto)}><DirectionsBikeIcon /></IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={alugarDialogOpen} onClose={() => setAlugarDialogOpen(false)}>
        <DialogTitle>Alugar Moto</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome do Cliente"
            name="cliente"
            value={aluguelData.cliente}
            onChange={(e) => setAluguelData({ ...aluguelData, cliente: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Telefone do Cliente"
            name="telefone"
            value={aluguelData.telefone}
            onChange={(e) => setAluguelData({ ...aluguelData, telefone: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlugarDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={confirmarAluguel}>Confirmar Aluguel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MotosAlugadas;
