import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Stack, Paper, List, ListItem,
  ListItemText, IconButton, Autocomplete, MenuItem, Snackbar, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Pagamento = () => {
  const [produtosOpcoes, setProdutosOpcoes] = useState([]);
  const [servicosOpcoes, setServicosOpcoes] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [itensVenda, setItensVenda] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [sucesso, setSucesso] = useState(false);

  const buscarProdutos = async (texto) => {
    const res = await fetch(`http://localhost:3001/produtos?nome=${texto}`);
    const data = await res.json();
    setProdutosOpcoes(data);
  };

  const buscarServicos = async (texto) => {
    const res = await fetch(`http://localhost:3001/servicos?nome=${texto}`);
    const data = await res.json();
    setServicosOpcoes(data);
  };

  const adicionarItem = (item, tipo, quantidade = 1) => {
    if (item) {
      const itemFormatado = {
        tipo,
        id: item._id,
        nome: item.nome,
        preco: tipo === 'produto' ? item.preco : item.valor,
        quantidade,
      };
      setItensVenda(prev => [...prev, itemFormatado]);
      if (tipo === 'produto') {
        setProdutoSelecionado(null);
        setQuantidadeProduto(1);
      }
      if (tipo === 'servico') setServicoSelecionado(null);
    }
  };

  const removerItem = (index) => {
    const novaLista = [...itensVenda];
    novaLista.splice(index, 1);
    setItensVenda(novaLista);
  };

  const total = itensVenda.reduce(
    (soma, item) => soma + (Number(item.preco || 0) * (item.quantidade || 1)),
    0
  );

  const finalizarPagamento = async () => {
    if (!formaPagamento || itensVenda.length === 0) {
      alert('Selecione a forma de pagamento e adicione itens!');
      return;
    }

    try {
      const body = {
        itens: itensVenda,
        formaPagamento,
        valorTotal: total,
        data: new Date(),
      };

      const res = await fetch('http://localhost:3001/pagamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setItensVenda([]);
        setFormaPagamento('');
        setSucesso(true);
      } else {
        alert('Erro ao finalizar pagamento');
      }
    } catch (err) {
      console.error('Erro ao finalizar:', err);
      alert('Erro ao finalizar pagamento');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Pagamento</Typography>

      {/* Produto */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Autocomplete
          options={produtosOpcoes}
          getOptionLabel={(option) => `${option.nome} - £${option.preco}`}
          value={produtoSelecionado}
          onInputChange={(event, newInputValue) => buscarProdutos(newInputValue)}
          onChange={(event, newValue) => setProdutoSelecionado(newValue)}
          renderInput={(params) => <TextField {...params} label="Buscar produto" />}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Qtd"
          type="number"
          inputProps={{ min: 1 }}
          value={quantidadeProduto}
          onChange={(e) => setQuantidadeProduto(Number(e.target.value))}
          sx={{ width: 100 }}
        />
        <Button
          variant="contained"
          onClick={() => adicionarItem(produtoSelecionado, 'produto', quantidadeProduto)}
        >
          Adicionar Produto
        </Button>
      </Stack>

      {/* Serviço */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Autocomplete
          options={servicosOpcoes}
          getOptionLabel={(option) => `${option.nome} - £${option.valor}`}
          value={servicoSelecionado}
          onInputChange={(event, newInputValue) => buscarServicos(newInputValue)}
          onChange={(event, newValue) => setServicoSelecionado(newValue)}
          renderInput={(params) => <TextField {...params} label="Buscar serviço" />}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          onClick={() => adicionarItem(servicoSelecionado, 'servico')}
        >
          Adicionar Serviço
        </Button>
      </Stack>

      {/* Lista de venda */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Itens da Venda</Typography>
        <List>
          {itensVenda.map((item, i) => (
            <ListItem
              key={i}
              secondaryAction={
                <IconButton edge="end" onClick={() => removerItem(i)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${item.nome} (${item.tipo})`}
                secondary={`£${item.preco} x ${item.quantidade} = £${(item.preco * item.quantidade).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
        <Typography variant="h6" sx={{ mt: 2 }}>Total: £{total.toFixed(2)}</Typography>
      </Paper>

      {/* Forma de pagamento */}
      <TextField
        select
        label="Forma de Pagamento"
        fullWidth
        value={formaPagamento}
        onChange={(e) => setFormaPagamento(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="dinheiro">Dinheiro</MenuItem>
        <MenuItem value="cartao">Cartão Presencial</MenuItem>
        <MenuItem value="agendado">Agendado</MenuItem>
      </TextField>

      {/* Finalizar */}
      <Button variant="contained" color="success" fullWidth onClick={finalizarPagamento}>
        Finalizar Pagamento
      </Button>

      <Snackbar open={sucesso} autoHideDuration={4000} onClose={() => setSucesso(false)}>
        <Alert severity="success" onClose={() => setSucesso(false)}>
          Pagamento salvo com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Pagamento;
