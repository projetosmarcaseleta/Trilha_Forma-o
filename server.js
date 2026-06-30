const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const defaultUsers = {
  'admin@db1.com.br': {
    name: 'Administrador',
    email: 'admin@db1.com.br',
    ph: 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892', // hash for 'adminadmin'
    role: 'admin',
    intern: null
  },
  'bruno.ortega@db1.com.br': {
    name: 'Bruno Andre Fernandes Ortega',
    email: 'bruno.ortega@db1.com.br',
    ph: '0f59bac52957f670f928385fe6bc50318262afb13ef1f0f388f8de105498dcc5',
    role: 'user',
    intern: 'Bruno Andre Fernandes Ortega'
  },
  'enzo.perlato@db1.com.br': {
    name: 'Enzo Gabriel Dias Perlato',
    email: 'enzo.perlato@db1.com.br',
    ph: '90588e1477c43a111d709b87bc9b873e275d9aa1c517bc39ed86eb8f0eb66ded',
    role: 'user',
    intern: 'Enzo Gabriel Dias Perlato'
  },
  'guilherme.araujo@db1.com.br': {
    name: 'Guilherme Estevam Araujo',
    email: 'guilherme.araujo@db1.com.br',
    ph: '25dbbde0f4dab30c91564b90f6fd3257262c4c560faf0e044ba145121810a7ea',
    role: 'user',
    intern: 'Guilherme Estevam Araujo'
  },
  'gustavo.niehues@db1.com.br': {
    name: 'Gustavo Amaro Niehues',
    email: 'gustavo.niehues@db1.com.br',
    ph: '795f743aecee189f5c9286bcfd0db1ddae2454e67f5ffd7402fbb3c6802b2e12',
    role: 'user',
    intern: 'Gustavo Amaro Niehues'
  },
  'gustavo.santos@db1.com.br': {
    name: 'Gustavo dos Santos',
    email: 'gustavo.santos@db1.com.br',
    ph: 'e3a686fcdafba803bfe3f3f0f85207a78a4ae7b69e63be03c031802ec85d1b68',
    role: 'user',
    intern: 'Gustavo dos Santos'
  },
  'kenzo.yamamoto@db1.com.br': {
    name: 'Kenzo Wilder Yamamoto',
    email: 'kenzo.yamamoto@db1.com.br',
    ph: 'cb3565ae63cfce7df6514b83fb990dd423beb905440fd1264fd6f6e8467584a9',
    role: 'user',
    intern: 'Kenzo Wilder Yamamoto'
  },
  'leonardo.cunha@db1.com.br': {
    name: 'Leonardo Amaro Alves Cunha',
    email: 'leonardo.cunha@db1.com.br',
    ph: '978f887a0968d1bbe89b47d800f4661ae56838f1da0cfe3e8d7de2ef7d54ac88',
    role: 'user',
    intern: 'Leonardo Amaro Alves Cunha'
  },
  'lucas.berman@db1.com.br': {
    name: 'Lucas Emiliano Lopes Berman',
    email: 'lucas.berman@db1.com.br',
    ph: 'f5d03c7279f4fe1d5c9856e4ae9a757e2616dbd8497be2ad8fe8bbdf4880666f',
    role: 'user',
    intern: 'Lucas Emiliano Lopes Berman'
  },
  'silva.lucas@db1.com.br': {
    name: 'Lucas Henrique Fernandes Soares da Silva',
    email: 'silva.lucas@db1.com.br',
    ph: '5174f6d01cc92d155b38f4e3c862a9abc5bc39d0e5a76e4bbd5d42365d978c39',
    role: 'user',
    intern: 'Lucas Henrique Fernandes Soares Da Silva'
  },
  'luna.feitosa@db1.com.br': {
    name: 'Luna Halabi Feitosa',
    email: 'luna.feitosa@db1.com.br',
    ph: '08ff12f850af3b69b8a973ead2620da8186005d0a04590e14d608e087d8942a2',
    role: 'user',
    intern: 'Luna Halabi Feitosa'
  },
  'matheus.zamferrari@db1.com.br': {
    name: 'Matheus Felipe de Souza Zamferrari',
    email: 'matheus.zamferrari@db1.com.br',
    ph: '0cdfa81610a66088e1145fcfbe40e689751806b88c070c7cee7a66c4e0c8c2f2',
    role: 'user',
    intern: 'Matheus Felipe De Souza Zamferrari'
  },
  'paola.silva@db1.com.br': {
    name: 'Paola Rodrigues da Silva',
    email: 'paola.silva@db1.com.br',
    ph: 'f45d24ac126098604673cbdb73a4c44f7a31c02396b236efa51ff7e7351059be',
    role: 'user',
    intern: 'Paola Rodrigues da Silva'
  },
  'rafael.ribeiro@db1.com.br': {
    name: 'Rafael Garcia Ribeiro',
    email: 'rafael.ribeiro@db1.com.br',
    ph: '598bb4feb55f72490c349d45c2b4cf7738ed9f9a88ddd9e8db172efb42ed7e37',
    role: 'user',
    intern: 'Rafael Garcia Ribeiro'
  },
  'samuel.hungaro@db1.com.br': {
    name: 'Samuel Hungaro da Silva',
    email: 'samuel.hungaro@db1.com.br',
    ph: '004774e16534e9d2f49e32d3aa415dffd1d9d2a6c7db9769649630ad5aa60187',
    role: 'user',
    intern: 'Samuel Hungaro da Silva'
  },
  'layza.miranda@db1.com.br': {
    name: 'Layza Lopes De Miranda',
    email: 'layza.miranda@db1.com.br',
    ph: '2a89b116f3af11749f6a8bda8b4e1f0aadfda797ba1288c5a4e233d44e52d865',
    role: 'user',
    intern: null
  },
  'joana.andreghetti@db1.com.br': {
    name: 'Joana Andreghetti',
    email: 'joana.andreghetti@db1.com.br',
    ph: '7df3f12690afb6f8cd38b3e77b9db5e273efbdb5a39c5aa286b0c32f706a73e4',
    role: 'user',
    intern: null
  }
};

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
    users: JSON.parse(JSON.stringify(defaultUsers)),
    texts: {},
    internData: {} // internName: { c: {}, a: 'kam', p: 'eng' }
  }, null, 2));
}

function getDb() {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  let needsUpdate = false;
  
  if (!db.users) {
    db.users = {};
    needsUpdate = true;
  }
  
  // Ensure all default users exist in local db.json
  for (const email of Object.keys(defaultUsers)) {
    if (!db.users[email]) {
      db.users[email] = defaultUsers[email];
      needsUpdate = true;
    }
  }
  
  if (needsUpdate) {
    saveDb(db);
  }
  return db;
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
