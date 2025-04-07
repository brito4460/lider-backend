// src/pages/Pagamento.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Stack, Paper, List, ListItem,
  ListItemText, IconButton, Autocomplete, MenuItem, Snackbar, Alert,
  Divider, Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';

const Pagamento = () => {
  const [produtosOpcoes, setProdutosOpcoes] = useState([]);
  const [servicosOpcoes, setServicosOpcoes] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [quantidadeProduto, setQuantidadeProduto] = useState(1);
  const [itensVenda, setItensVenda] = useState([]);
  const [formaPagamento, setFormaPagamento] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [pagamentoRegistrado, setPagamentoRegistrado] = useState(null);
  const [pagamentosSalvos, setPagamentosSalvos] = useState([]);

  const [descricaoManual, setDescricaoManual] = useState('');
  const [valorManual, setValorManual] = useState('');

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

  const buscarPagamentos = async () => {
    const res = await fetch('http://localhost:3001/pagamentos');
    const data = await res.json();
    setPagamentosSalvos(data.reverse());
  };

  useEffect(() => {
    buscarPagamentos();
  }, []);

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

  const adicionarManual = () => {
    if (!descricaoManual || !valorManual) return;
    const itemManual = {
      tipo: 'manual',
      nome: descricaoManual,
      preco: Number(valorManual),
      quantidade: 1,
    };
    setItensVenda(prev => [...prev, itemManual]);
    setDescricaoManual('');
    setValorManual('');
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

  const imprimirCupom = (pagamento) => {
    const printWindow = window.open('', '', 'width=300,height=600');
    const conteudo = `
      <div style="font-family: monospace; width: 300px; padding: 10px; font-size: 12px; line-height: 1.5;">
        <center>
          <strong>Lider Motorcycles</strong><br />
          www.lidermotorcycles.co.uk<br />
          123 High Street, London<br />
          United Kingdom<br />
          ------------------------------<br />
        </center>
        Data: ${new Date(pagamento.data).toLocaleString()}<br />
        ------------------------------<br />
        ${pagamento.itens.map(item => (
          `${item.nome} (${item.tipo})<br />£${item.preco} x ${item.quantidade} = £${(item.preco * item.quantidade).toFixed(2)}<br />`
        )).join('')}
        ------------------------------<br />
        Total: <strong>£${pagamento.valorTotal.toFixed(2)}</strong><br />
        Pagamento: ${pagamento.formaPagamento}<br />
        ------------------------------<br />
        <center>
          Obrigado pela preferência!<br />
          Este não é um recibo fiscal.<br />
        </center>
      </div>
    `;
    printWindow.document.write(`<html><head><title>Recibo</title></head><body>${conteudo}</body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

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
        const resultado = await res.json();
        setPagamentoRegistrado(resultado);
        setItensVenda([]);
        setFormaPagamento('');
        setSucesso(true);
        buscarPagamentos();

        setTimeout(() => imprimirCupom(resultado), 500);
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

      {/* Pagamento Manual */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Descrição do Pagamento"
          value={descricaoManual}
          onChange={(e) => setDescricaoManual(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Valor (£)"
          type="number"
          value={valorManual}
          onChange={(e) => setValorManual(e.target.value)}
          sx={{ width: 150 }}
        />
        <Button variant="outlined" onClick={adicionarManual}>
          Adicionar Pagamento Manual
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
        <MenuItem value="transferencia">Transferência Bancária</MenuItem>
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

      {/* Histórico de Pagamentos */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>Histórico de Pagamentos</Typography>
      {pagamentosSalvos.length === 0 ? (
        <Typography>Nenhum pagamento registrado ainda.</Typography>
      ) : (
        <List>
          {pagamentosSalvos.slice(0, 10).map((p, i) => (
            <ListItem key={i} secondaryAction={
              <Tooltip title="Reimprimir recibo">
                <IconButton onClick={() => imprimirCupom(p)}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
            }>
              <ListItemText
                primary={`£${p.valorTotal?.toFixed(2)} - ${p.formaPagamento}`}
                secondary={`Data: ${new Date(p.data).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Pagamento;
