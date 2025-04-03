const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API da Lider Motorcycles rodando!");
});


// Conexão com MongoDB Atlas
const mongoURI = 'mongodb+srv://ider_stock:4WfR21tTHMlBfVK1@liderstockcluster.ehd2ofv.mongodb.net/lider_stock?retryWrites=true&w=majority&appName=LiderStockCluster';
mongoose.connect(mongoURI)
  .then(() => console.log('🟢 Conectado ao MongoDB Atlas!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Modelos
const Produto = mongoose.model('Produto', {
  nome: String,
  tipo: String,
  quantidade: Number,
  preco: Number,
  codigo: String
});

const Cliente = mongoose.model('Cliente', {
  nome: String,
  telefone: String,
  placa: String,
  modelo: String,
  observacoes: String
});

const Orcamento = mongoose.model('Orcamento', {
  cliente: String,
  descricao: String,
  valor: Number,
});

const Servico = mongoose.model('Servico', {
  nome: String,
  descricao: String,
  valor: Number,
});

const Gasto = mongoose.model('Gasto', {
  categoria: String,
  descricao: String,
  valor: Number,
  data: String,
});

const Pagamento = mongoose.model('Pagamento', {
  clienteId: String,
  formaPagamento: String,
  observacoes: String,
  valorTotal: Number,
  data: Date,
  itens: Array, // Salva todos os itens da venda (produtos e serviços)
});

// ROTAS ====================================================

// PRODUTOS
app.get('/produtos', async (req, res) => {
  const { nome } = req.query;

  try {
    if (nome) {
      const produtosFiltrados = await Produto.find({
        nome: { $regex: nome, $options: 'i' },
      });
      res.json(produtosFiltrados);
    } else {
      const todos = await Produto.find();
      res.json(todos);
    }
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

app.post('/produtos', async (req, res) => {
  const novoProduto = new Produto(req.body);
  await novoProduto.save();
  res.json(novoProduto);
});

app.put('/produtos/:id', async (req, res) => {
  const atualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizado);
});

app.delete('/produtos/:id', async (req, res) => {
  await Produto.findByIdAndDelete(req.params.id);
  res.json({ mensagem: 'Produto deletado com sucesso.' });
});

// CLIENTES
app.post('/clientes', async (req, res) => {
  const novoCliente = new Cliente(req.body);
  await novoCliente.save();
  res.json(novoCliente);
});

app.get('/clientes', async (req, res) => {
  const clientes = await Cliente.find();
  res.json(clientes);
});

app.put('/clientes/:id', async (req, res) => {
  const atualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizado);
});

app.delete('/clientes/:id', async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.json({ mensagem: 'Cliente deletado com sucesso.' });
});

// ORÇAMENTOS
app.get('/orcamentos', async (req, res) => {
  const orcamentos = await Orcamento.find();
  res.json(orcamentos);
});

app.post('/orcamentos', async (req, res) => {
  const novo = new Orcamento(req.body);
  await novo.save();
  res.json(novo);
});

app.delete('/orcamentos/:id', async (req, res) => {
  await Orcamento.findByIdAndDelete(req.params.id);
  res.json({ mensagem: 'Orçamento removido com sucesso.' });
});

// SERVIÇOS
app.get('/servicos', async (req, res) => {
  const { nome } = req.query;

  try {
    if (nome) {
      const filtrados = await Servico.find({
        nome: { $regex: nome, $options: 'i' },
      });
      res.json(filtrados);
    } else {
      const todos = await Servico.find();
      res.json(todos);
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar serviços' });
  }
});

app.post('/servicos', async (req, res) => {
  const novo = new Servico(req.body);
  await novo.save();
  res.json(novo);
});

app.put('/servicos/:id', async (req, res) => {
  const atualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizado);
});

app.delete('/servicos/:id', async (req, res) => {
  await Servico.findByIdAndDelete(req.params.id);
  res.json({ mensagem: 'Serviço deletado com sucesso.' });
});

// GASTOS
app.post('/gastos', async (req, res) => {
  try {
    const novo = new Gasto(req.body);
    await novo.save();
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar gasto' });
  }
});

app.get('/gastos', async (req, res) => {
  try {
    const todos = await Gasto.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar gastos' });
  }
});

// PAGAMENTOS - com redução automática do estoque
app.post('/pagamentos', async (req, res) => {
  try {
    const dados = req.body;

    // 1. Criar pagamento completo com itens
    const novoPagamento = new Pagamento({
      ...dados,
      data: new Date(),
    });
    await novoPagamento.save();

    // 2. Reduzir estoque dos produtos comprados
    if (Array.isArray(dados.itens)) {
      for (const item of dados.itens) {
        if (item.tipo === 'produto' && item.id) {
          const produto = await Produto.findById(item.id);
          if (produto) {
            produto.quantidade = produto.quantidade - (item.quantidade || 1);
            await produto.save();
          }
        }
      }
    }

    res.status(201).json(novoPagamento);
  } catch (err) {
    console.error('Erro ao salvar pagamento:', err);
    res.status(500).json({ erro: 'Erro ao salvar pagamento' });
  }
});

app.get('/pagamentos', async (req, res) => {
  try {
    const lista = await Pagamento.find();
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pagamentos' });
  }
});
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
