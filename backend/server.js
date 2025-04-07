const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API da Lider Motorcycles rodando!");
});

const mongoURI = 'mongodb+srv://ider_stock:4WfR21tTHMlBfVK1@liderstockcluster.ehd2ofv.mongodb.net/lider_stock?retryWrites=true&w=majority&appName=LiderStockCluster';
mongoose.connect(mongoURI)
  .then(() => console.log('🟢 Conectado ao MongoDB Atlas!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

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
  observacoes: String,
  saldoDevedor: {
    type: Number,
    default: 0
  }
});

const Moto = mongoose.model('Moto', {
  placa: String,
  modelo: String,
  estaAlugada: Boolean,
  cliente: String,
  telefone: String
});

const Orcamento = mongoose.model('Orcamento', {
  cliente: String,
  descricao: String,
  valor: Number
});

const Servico = mongoose.model('Servico', {
  nome: String,
  descricao: String,
  valor: Number
});

const Gasto = mongoose.model('Gasto', {
  categoria: String,
  descricao: String,
  valor: Number,
  data: String
});

const Pagamento = mongoose.model('Pagamento', {
  clienteId: String,
  motoId: String,
  formaPagamento: String,
  observacoes: String,
  valorTotal: Number,
  data: Date,
  itens: Array
});

const Aluguel = mongoose.model('Aluguel', {
  cliente: String,
  moto: String,
  retirada: Date,
  devolucao: Date,
  valor: Number,
  observacoes: String
});

// === ROTAS ===

// PRODUTOS
app.get('/produtos', async (req, res) => {
  const { nome } = req.query;
  try {
    if (nome) {
      const produtosFiltrados = await Produto.find({ nome: { $regex: nome, $options: 'i' } });
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

app.get('/clientes-busca', async (req, res) => {
  const busca = req.query.busca || '';
  try {
    const clientes = await Cliente.find({
      $or: [
        { nome: { $regex: busca, $options: 'i' } },
        { telefone: { $regex: busca, $options: 'i' } },
        { placa: { $regex: busca, $options: 'i' } }
      ]
    });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar clientes' });
  }
});

app.put('/clientes/:id', async (req, res) => {
  const atualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(atualizado);
});

app.delete('/clientes/:id', async (req, res) => {
  await Cliente.findByIdAndDelete(req.params.id);
  res.json({ mensagem: 'Cliente deletado com sucesso.' });
});

// MOTO
app.get('/motos', async (req, res) => {
  try {
    const motos = await Moto.find();
    res.json(motos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar motos' });
  }
});

app.post('/motos', async (req, res) => {
  try {
    const nova = new Moto(req.body);
    await nova.save();
    res.json(nova);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar moto' });
  }
});

app.put('/motos/:id', async (req, res) => {
  try {
    const atualizado = await Moto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar moto' });
  }
});

app.delete('/motos/:id', async (req, res) => {
  try {
    await Moto.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Moto deletada com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir moto' });
  }
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
      const filtrados = await Servico.find({ nome: { $regex: nome, $options: 'i' } });
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

// PAGAMENTOS
app.post('/pagamentos', async (req, res) => {
  try {
    const dados = req.body;
    if (!dados.itens || !Array.isArray(dados.itens)) {
      return res.status(400).json({ erro: 'Itens de pagamento ausentes ou inválidos' });
    }

    const novoPagamento = new Pagamento({ ...dados, data: new Date() });
    await novoPagamento.save();

    for (const item of dados.itens) {
      if (item.tipo === 'produto' && item.id) {
        const produto = await Produto.findById(item.id);
        if (produto) {
          produto.quantidade -= item.quantidade || 1;
          await produto.save();
        }
      }
    }

    if (dados.formaPagamento === 'pagamento-divida' && dados.clienteId && dados.valorTotal) {
      const cliente = await Cliente.findById(dados.clienteId);
      if (cliente) {
        cliente.saldoDevedor = (cliente.saldoDevedor || 0) - dados.valorTotal;
        await cliente.save();
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

// ALUGUEIS
app.get('/alugueis', async (req, res) => {
  const { cliente, moto, data } = req.query;
  const filtro = {};
  if (cliente) filtro.cliente = new RegExp(cliente, 'i');
  if (moto) filtro.moto = new RegExp(moto, 'i');
  if (data) filtro.retirada = { $gte: new Date(data) };
  try {
    const alugueis = await Aluguel.find(filtro).sort({ createdAt: -1 });
    res.json(alugueis);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar aluguéis' });
  }
});

app.post('/alugueis', async (req, res) => {
  try {
    const novo = new Aluguel(req.body);
    await novo.save();
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar aluguel' });
  }
});

app.put('/alugueis/:id', async (req, res) => {
  try {
    const atualizado = await Aluguel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar aluguel' });
  }
});

app.delete('/alugueis/:id', async (req, res) => {
  try {
    await Aluguel.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Aluguel deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir aluguel' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
