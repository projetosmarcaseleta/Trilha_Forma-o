const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Inicializar db.json se não existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({
    interns: [
      'Bruno Andre Fernandes Ortega',
      'Enzo Gabriel Dias Perlato',
      'Guilherme Estevam Araujo',
      'Gustavo Amaro Niehues',
      'Gustavo dos Santos',
      'Kenzo Wilder Yamamoto',
      'Leonardo Amaro Alves Cunha',
      'Lucas Emiliano Lopes Berman',
      'Lucas Henrique Fernandes Soares Da Silva',
      'Luna Halabi Feitosa',
      'Matheus Felipe De Souza Zamferrari',
      'Paola Rodrigues da Silva',
      'Rafael Garcia Ribeiro',
      'Samuel Hungaro da Silva'
    ],
    users: {},
    texts: {},
    internData: {} // internName: { c: {}, a: 'kam', p: 'eng' }
  }, null, 2));
}

function getDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Endpoints

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/db', (req, res) => {
  res.json(getDb());
});

app.post('/api/db', (req, res) => {
  const data = req.body;
  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Invalid data' });
  }
  
  const currentDb = getDb();
  
  if (data.interns) currentDb.interns = data.interns;
  if (data.users) currentDb.users = data.users;
  if (data.texts) currentDb.texts = data.texts;
  if (data.internData) currentDb.internData = data.internData;
  
  if (data.internName && data.internDataUpdate) {
    if (!currentDb.internData[data.internName]) {
      currentDb.internData[data.internName] = {};
    }
    const internInfo = currentDb.internData[data.internName];
    if (data.internDataUpdate.c !== undefined) internInfo.c = data.internDataUpdate.c;
    if (data.internDataUpdate.a !== undefined) internInfo.a = data.internDataUpdate.a;
    if (data.internDataUpdate.p !== undefined) internInfo.p = data.internDataUpdate.p;
  }
  
  if (data.resetIntern) {
     delete currentDb.internData[data.resetIntern];
  }
  
  if (data.deleteIntern) {
     delete currentDb.internData[data.deleteIntern];
     currentDb.interns = currentDb.interns.filter(i => i !== data.deleteIntern);
  }

  saveDb(currentDb);
  res.json({ success: true, db: currentDb });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
