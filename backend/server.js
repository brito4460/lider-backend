const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verificação da variável de ambiente para MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('A variável de ambiente MONGO_URI não foi definida!');
  process.exit(1); // Encerra o servidor se a variável de ambiente não estiver definida
}

// Conexão com MongoDB Atlas
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('🟢 Conectado ao MongoDB Atlas!'))
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);  // Encerra o servidor caso a conexão falhe
  });

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
    console.error('Erro ao buscar produtos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar produtos', detalhes: erro.message });
  }
});

app.post('/produtos', async (req, res) => {
  try {
    const novoProduto = new Produto(req.body);
    await novoProduto.save();
    res.json(novoProduto);
  } catch (erro) {
    console.error('Erro ao salvar produto:', erro);
    res.status(500).json({ erro: 'Erro ao salvar produto', detalhes: erro.message });
  }
});

app.put('/produtos/:id', async (req, res) => {
  try {
    const atualizado = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar produto', detalhes: erro.message });
  }
});

app.delete('/produtos/:id', async (req, res) => {
  try {
    await Produto.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Produto deletado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao deletar produto:', erro);
    res.status(500).json({ erro: 'Erro ao deletar produto', detalhes: erro.message });
  }
});

// CLIENTES
app.post('/clientes', async (req, res) => {
  try {
    const novoCliente = new Cliente(req.body);
    await novoCliente.save();
    res.json(novoCliente);
  } catch (erro) {
    console.error('Erro ao salvar cliente:', erro);
    res.status(500).json({ erro: 'Erro ao salvar cliente', detalhes: erro.message });
  }
});

app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (erro) {
    console.error('Erro ao buscar clientes:', erro);
    res.status(500).json({ erro: 'Erro ao buscar clientes', detalhes: erro.message });
  }
});

app.put('/clientes/:id', async (req, res) => {
  try {
    const atualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar cliente', detalhes: erro.message });
  }
});

app.delete('/clientes/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Cliente deletado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao deletar cliente:', erro);
    res.status(500).json({ erro: 'Erro ao deletar cliente', detalhes: erro.message });
  }
});

// ORÇAMENTOS
app.get('/orcamentos', async (req, res) => {
  try {
    const orcamentos = await Orcamento.find();
    res.json(orcamentos);
  } catch (erro) {
    console.error('Erro ao buscar orçamentos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar orçamentos', detalhes: erro.message });
  }
});

app.post('/orcamentos', async (req, res) => {
  try {
    const novo = new Orcamento(req.body);
    await novo.save();
    res.json(novo);
  } catch (erro) {
    console.error('Erro ao salvar orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao salvar orçamento', detalhes: erro.message });
  }
});

app.delete('/orcamentos/:id', async (req, res) => {
  try {
    await Orcamento.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Orçamento removido com sucesso.' });
  } catch (erro) {
    console.error('Erro ao remover orçamento:', erro);
    res.status(500).json({ erro: 'Erro ao remover orçamento', detalhes: erro.message });
  }
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
    console.error('Erro ao buscar serviços:', err);
    res.status(500).json({ erro: 'Erro ao buscar serviços', detalhes: err.message });
  }
});

app.post('/servicos', async (req, res) => {
  try {
    const novo = new Servico(req.body);
    await novo.save();
    res.json(novo);
  } catch (erro) {
    console.error('Erro ao salvar serviço:', erro);
    res.status(500).json({ erro: 'Erro ao salvar serviço', detalhes: erro.message });
  }
});

app.put('/servicos/:id', async (req, res) => {
  try {
    const atualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (erro) {
    console.error('Erro ao atualizar serviço:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar serviço', detalhes: erro.message });
  }
});

app.delete('/servicos/:id', async (req, res) => {
  try {
    await Servico.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Serviço deletado com sucesso.' });
  } catch (erro) {
    console.error('Erro ao deletar serviço:', erro);
    res.status(500).json({ erro: 'Erro ao deletar serviço', detalhes: erro.message });
  }
});

// GASTOS
app.post('/gastos', async (req, res) => {
  try {
    const novo = new Gasto(req.body);
    await novo.save();
    res.json(novo);
  } catch (err) {
    console.error('Erro ao salvar gasto:', err);
    res.status(500).json({ erro: 'Erro ao salvar gasto', detalhes: err.message });
  }
});

app.get('/gastos', async (req, res) => {
  try {
    const todos = await Gasto.find();
    res.json(todos);
  } catch (err) {
    console.error('Erro ao buscar gastos:', err);
    res.status(500).json({ erro: 'Erro ao buscar gastos', detalhes: err.message });
  }
});

// PAGAMENTOS
app.post('/pagamentos', async (req, res) => {
  try {
    const dados = req.body;

    // Criar pagamento
    const novoPagamento = new Pagamento({ ...dados, data: new Date() });
    await novoPagamento.save();

    // Reduzir estoque dos produtos
    if (Array.isArray(dados.itens)) {
      for (const item of dados.itens) {
        if (item.tipo === 'produto' && item.id) {
          const produto = await Produto.findById(item.id);
          if (produto) {
            produto.quantidade -= (item.quantidade || 1);
            await produto.save();
          }
        }
      }
    }

    res.status(201).json(novoPagamento);
  } catch (err) {
    console.error('Erro ao salvar pagamento:', err);
    res.status(500).json({ erro: 'Erro ao salvar pagamento', detalhes: err.message });
  }
});

app.get('/pagamentos', async (req, res) => {
  try {
    const lista = await Pagamento.find();
    res.json(lista);
  } catch (err) {
    console.error('Erro ao buscar pagamentos:', err);
    res.status(500).json({ erro: 'Erro ao buscar pagamentos', detalhes: err.message });
  }
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('Erro interno do servidor:', err);
  res.status(500).json({ erro: 'Erro interno do servidor', detalhes: err.message });
});

// Configuração da porta
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
