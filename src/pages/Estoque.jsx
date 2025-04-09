// src/pages/Estoque.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, CircularProgress, TextField, Button, Stack, IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const API_URL = import.meta.env.VITE_API_URL; // para Vite (altere se estiver usando CRA)

const Estoque = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [editando, setEditando] = useState({});
  const [novoProduto, setNovoProduto] = useState({
    nome: '', tipo: '', quantidade: '', preco: '', codigo: '',
  });

  const buscarProdutos = async () => {
    try {
      const resposta = await fetch(`${import.meta.env.VITE.API_URL}/produtos`);
      if (!resposta.ok) throw new Error("Erro ao buscar produtos");
      const dados = await resposta.json();
      setProdutos(dados);
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro);
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async () => {
    try {
      const resposta = await fetch(`${import.meta.env.VITE.API_URL}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: novoProduto.nome,
          tipo: novoProduto.tipo,
          quantidade: Number(novoProduto.quantidade),
          preco: Number(novoProduto.preco),
          codigo: novoProduto.codigo,
        }),
      });

      if (!resposta.ok) throw new Error("Erro ao adicionar produto");

      const produtoAdicionado = await resposta.json();
      setProdutos((prev) => [...prev, produtoAdicionado]);
      setNovoProduto({ nome: '', tipo: '', quantidade: '', preco: '', codigo: '' });
    } catch (erro) {
      console.error('Erro ao adicionar produto:', erro);
    }
  };

  const salvarEdicao = async (id) => {
    const produtoEditado = produtos.find(p => p._id === id);
    try {
      const resposta = await fetch(`${import.meta.env.VITE.API_URL}/produtos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoEditado),
      });
      if (!resposta.ok) throw new Error("Erro ao salvar edição");
      alert('Alterações salvas!');
    } catch (erro) {
      console.error('Erro ao salvar edições:', erro);
    }
  };

  const handleEdicao = (id, campo, valor) => {
    setProdutos(prev =>
      prev.map(p => (p._id === id ? { ...p, [campo]: valor } : p))
    );
    setEditando(prev => ({ ...prev, [id]: true }));
  };

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.tipo.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(busca.toLowerCase())
  );

  const totalEstoque = produtos.reduce((soma, p) => soma + (p.preco || 0) * p.quantidade, 0);

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>Estoque de Produtos</Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Adicionar Novo Produto</Typography>
        <Stack spacing={2} direction="row" sx={{ flexWrap: 'wrap' }}>
          <TextField label="Nome" value={novoProduto.nome} onChange={(e) => setNovoProduto({ ...novoProduto, nome: e.target.value })} />
          <TextField label="Tipo" value={novoProduto.tipo} onChange={(e) => setNovoProduto({ ...novoProduto, tipo: e.target.value })} />
          <TextField label="Quantidade" type="number" value={novoProduto.quantidade} onChange={(e) => setNovoProduto({ ...novoProduto, quantidade: e.target.value })} />
          <TextField label="Preço (£)" type="number" value={novoProduto.preco} onChange={(e) => setNovoProduto({ ...novoProduto, preco: e.target.value })} />
          <TextField label="Código de Barras" value={novoProduto.codigo} onChange={(e) => setNovoProduto({ ...novoProduto, codigo: e.target.value })} />
          <Button variant="contained" onClick={adicionarProduto}>Adicionar Produto</Button>
        </Stack>
      </Paper>

      <TextField
        label="Buscar por nome, tipo ou código"
        fullWidth
        margin="normal"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Código</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Preço (£)</TableCell>
                    <TableCell>Total (£)</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {produtosFiltrados.map((produto) => (
                    <TableRow key={produto._id}>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.tipo}</TableCell>
                      <TableCell>{produto.codigo || '-'}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={produto.quantidade}
                          onChange={(e) => handleEdicao(produto._id, 'quantidade', Number(e.target.value))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={produto.preco}
                          onChange={(e) => handleEdicao(produto._id, 'preco', Number(e.target.value))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>£{(produto.preco * produto.quantidade).toFixed(2)}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => salvarEdicao(produto._id)}>
                          <SaveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Valor Total em Estoque: £{totalEstoque.toFixed(2)}
            </Typography>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Estoque;
