import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Box, Typography, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const FormularioAluguel = () => {
  const [formData, setFormData] = useState({
    cliente: '',
    moto: '',
    retirada: '',
    devolucao: '',
    valor: '',
    observacoes: '',
  });

  const [alugueis, setAlugueis] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [filtro, setFiltro] = useState({ cliente: '', moto: '', data: '' });

  const API = 'http://localhost:3001/alugueis';

  // Carregar aluguéis do backend
  const carregarAlugueis = async () => {
    const params = {};
    if (filtro.cliente) params.cliente = filtro.cliente;
    if (filtro.moto) params.moto = filtro.moto;
    if (filtro.data) params.data = filtro.data;

    const res = await axios.get(API, { params });
    setAlugueis(res.data);
  };

  useEffect(() => {
    carregarAlugueis();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editandoId) {
      await axios.put(`${API}/${editandoId}`, formData);
      setEditandoId(null);
    } else {
      await axios.post(API, formData);
    }
    setFormData({ cliente: '', moto: '', retirada: '', devolucao: '', valor: '', observacoes: '' });
    carregarAlugueis();
  };

  const handleEditar = (aluguel) => {
    setFormData(aluguel);
    setEditandoId(aluguel._id);
  };

  const handleExcluir = async (id) => {
    await axios.delete(`${API}/${id}`);
    carregarAlugueis();
  };

  const aplicarFiltro = () => {
    carregarAlugueis();
  };

  const limparFiltro = () => {
    setFiltro({ cliente: '', moto: '', data: '' });
    carregarAlugueis();
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', mt: 4 }}>
      <Paper sx={{ padding: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {editandoId ? 'Editar Aluguel' : 'Alugar Moto'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Cliente" name="cliente" value={formData.cliente}
            onChange={handleChange} fullWidth margin="normal" required />

          <TextField label="Moto (modelo ou placa)" name="moto" value={formData.moto}
            onChange={handleChange} fullWidth margin="normal" required />

          <TextField label="Retirada" name="retirada" type="date" value={formData.retirada}
            onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />

          <TextField label="Devolução" name="devolucao" type="date" value={formData.devolucao}
            onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true }} required />

          <TextField label="Valor" name="valor" type="number" value={formData.valor}
            onChange={handleChange} fullWidth margin="normal" required />

          <TextField label="Observações" name="observacoes" value={formData.observacoes}
            onChange={handleChange} fullWidth margin="normal" multiline rows={2} />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            {editandoId ? 'Salvar Alterações' : 'Registrar Aluguel'}
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ padding: 2, mb: 2 }}>
        <Typography variant="h6">Filtrar Aluguéis</Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
          <TextField label="Cliente" name="cliente" value={filtro.cliente} onChange={handleFiltroChange} />
          <TextField label="Moto" name="moto" value={filtro.moto} onChange={handleFiltroChange} />
          <TextField label="Data de Retirada" name="data" type="date"
            value={filtro.data} onChange={handleFiltroChange} InputLabelProps={{ shrink: true }} />
          <Button variant="outlined" onClick={aplicarFiltro}>Aplicar Filtro</Button>
          <Button variant="text" onClick={limparFiltro}>Limpar</Button>
        </Box>
      </Paper>

      <Typography variant="h6">Lista de Aluguéis</Typography>
      {alugueis.length === 0 ? (
        <Typography>Nenhum aluguel registrado.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cliente</TableCell>
                <TableCell>Moto</TableCell>
                <TableCell>Retirada</TableCell>
                <TableCell>Devolução</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Observações</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alugueis.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.cliente}</TableCell>
                  <TableCell>{a.moto}</TableCell>
                  <TableCell>{a.retirada?.slice(0, 10)}</TableCell>
                  <TableCell>{a.devolucao?.slice(0, 10)}</TableCell>
                  <TableCell>R$ {a.valor}</TableCell>
                  <TableCell>{a.observacoes}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditar(a)}><EditIcon /></IconButton>
                    <IconButton onClick={() => handleExcluir(a._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FormularioAluguel;
