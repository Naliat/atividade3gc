const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');

const app = express();
const PORT = 3000;

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'; 

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro de conexão com o MongoDB:', err));

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Item = mongoose.model('Item', ItemSchema);

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Welcome to the Node.js API!'); 
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find({}); 
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar itens no DB', error });
  }
});

app.post('/items', async (req, res) => {
  try {
    const { name } = req.body;
    
    const newItem = new Item({ name: name });
    const savedItem = await newItem.save();

    res.status(201).json({ 
      message: 'Item added successfully!', 
      item: { id: savedItem._id, name: savedItem.name } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar item no DB', error });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});