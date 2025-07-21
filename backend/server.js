const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Usando sua string de conexão já existente
const mongoURI = 'mongodb+srv://ider_stock:4WfR21tTHMlBfVK1@liderstockcluster.ehd2ofv.mongodb.net/lider_stock?retryWrites=true&w=majority&appName=LiderStockCluster';
mongoose.connect(mongoURI)
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Conectado ao MongoDB');
}).catch(err => {
  console.error('❌ Erro ao conectar no MongoDB:', err);
});

// Modelo Servico
const ServicoSchema = new mongoose.Schema({
  nome: String,
  descricao: String,
  valor: Number,
});
const Servico = mongoose.model('Servico', ServicoSchema);

// Modelo Aluguel (já existente)
const AluguelSchema = new mongoose.Schema({
  cliente: String,
  data: String,
  valor: Number,
});
const Aluguel = mongoose.model('Aluguel', AluguelSchema);

// Rotas de Serviços
app.get('/servicos', async (req, res) => {
  try {
    const servicos = await Servico.find();
    res.json(servicos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar serviços' });
  }
});

app.post('/servicos', async (req, res) => {
  try {
    const novo = new Servico(req.body);
    await novo.save();
    res.json(novo);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao salvar serviço' });
  }
});

app.put('/servicos/:id', async (req, res) => {
  try {
    const atualizado = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao atualizar serviço' });
  }
});

app.delete('/servicos/:id', async (req, res) => {
  try {
    await Servico.findByIdAndDelete(req.params.id);
    res.json({ mensagem: 'Serviço deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao excluir serviço' });
  }
});

// Rotas de Aluguéis
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

// Start do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
