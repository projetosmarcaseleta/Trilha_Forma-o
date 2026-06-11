const defaultDb = {
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
  internData: {}
};

export async function onRequestGet(context) {
  const KV = context.env.MARCA_SELETA_DB;
  if (!KV) {
    return new Response(JSON.stringify({ error: "KV Storage not configured" }), { status: 500 });
  }
  
  let db = await KV.get("db_data", { type: "json" });
  if (!db) {
    db = defaultDb;
    // Seed initial admin user
    db.users['admin@db1.com.br'] = {
      name: 'Administrador',
      email: 'admin@db1.com.br',
      ph: 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892', // hash for 'adminadmin'
      role: 'admin',
      intern: null
    };
    await KV.put("db_data", JSON.stringify(db));
  }
  
  return new Response(JSON.stringify(db), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export async function onRequestPost(context) {
  const KV = context.env.MARCA_SELETA_DB;
  if (!KV) {
    return new Response(JSON.stringify({ error: "KV Storage not configured" }), { status: 500 });
  }
  
  let currentDb = await KV.get("db_data", { type: "json" });
  if (!currentDb) {
    currentDb = defaultDb;
    currentDb.users['admin@db1.com.br'] = {
      name: 'Administrador',
      email: 'admin@db1.com.br',
      ph: 'd82494f05d6917ba02f7aaa29689ccb444bb73f20380876cb05d1f37537b7892',
      role: 'admin',
      intern: null
    };
  }
  
  const data = await context.request.json();
  if (!data || typeof data !== 'object') {
    return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
  }
  
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

  await KV.put("db_data", JSON.stringify(currentDb));
  
  return new Response(JSON.stringify({ success: true, db: currentDb }), {
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

// Configurar opções para CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
