/**
 * Query Firestore - Queries tipo SQL para Firestore
 * 
 * Uso:
 * node scripts/query-firestore.js
 * 
 * Depois escolha a query interativamente
 */

const admin = require('firebase-admin');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

// Interface readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para formatar resultados como tabela
function formatarTabela(docs, campos) {
  if (docs.length === 0) {
    console.log('\n❌ Nenhum resultado encontrado.\n');
    return;
  }

  console.log('\n📊 Resultados:\n');
  
  // Cabeçalho
  const header = campos.map(c => c.padEnd(20)).join(' | ');
  console.log(header);
  console.log('-'.repeat(header.length));
  
  // Dados
  docs.forEach(doc => {
    const data = doc.data();
    const row = campos.map(campo => {
      let valor = data[campo];
      if (valor === undefined) valor = '';
      if (typeof valor === 'object') valor = JSON.stringify(valor);
      return String(valor).substring(0, 20).padEnd(20);
    }).join(' | ');
    console.log(row);
  });
  
  console.log(`\n✅ Total: ${docs.length} registros\n`);
}

// Queries disponíveis
const queries = {
  '1': {
    nome: 'SELECT * FROM users WHERE role = "student"',
    descricao: 'Todos os alunos',
    executar: async () => {
      const snapshot = await db.collection('users')
        .where('role', '==', 'student')
        .get();
      formatarTabela(snapshot.docs, ['name', 'email', 'accountStatus', 'xp']);
    }
  },
  
  '2': {
    nome: 'SELECT * FROM users WHERE role IN ("instructor", "admin")',
    descricao: 'Todos os voluntários e admins',
    executar: async () => {
      const snapshot = await db.collection('users')
        .where('role', 'in', ['instructor', 'admin'])
        .get();
      formatarTabela(snapshot.docs, ['name', 'email', 'role', 'isMentor']);
    }
  },
  
  '3': {
    nome: 'SELECT * FROM users WHERE accountStatus = "inactive"',
    descricao: 'Usuários inativos',
    executar: async () => {
      const snapshot = await db.collection('users')
        .where('accountStatus', '==', 'inactive')
        .get();
      formatarTabela(snapshot.docs, ['name', 'email', 'role', 'accountStatus']);
    }
  },
  
  '4': {
    nome: 'SELECT * FROM users WHERE isMentor = true',
    descricao: 'Apenas mentores',
    executar: async () => {
      const snapshot = await db.collection('users')
        .where('isMentor', '==', true)
        .get();
      formatarTabela(snapshot.docs, ['name', 'email', 'role', 'title']);
    }
  },
  
  '5': {
    nome: 'SELECT * FROM users WHERE xp > 1000',
    descricao: 'Alunos com mais de 1000 XP',
    executar: async () => {
      const snapshot = await db.collection('users')
        .where('xp', '>', 1000)
        .orderBy('xp', 'desc')
        .get();
      formatarTabela(snapshot.docs, ['name', 'email', 'xp', 'streak']);
    }
  },
  
  '6': {
    nome: 'SELECT name, email FROM users ORDER BY name LIMIT 10',
    descricao: 'Primeiros 10 usuários (ordem alfabética)',
    executar: async () => {
      const snapshot = await db.collection('users')
        .orderBy('name')
        .limit(10)
        .get();
      formatarTabela(snapshot.docs, ['name', 'email', 'role']);
    }
  },
  
  '7': {
    nome: 'SELECT COUNT(*) FROM users GROUP BY role',
    descricao: 'Contar usuários por role',
    executar: async () => {
      const snapshot = await db.collection('users').get();
      const counts = {};
      
      snapshot.forEach(doc => {
        const role = doc.data().role || 'undefined';
        counts[role] = (counts[role] || 0) + 1;
      });
      
      console.log('\n📊 Contagem por Role:\n');
      Object.entries(counts).forEach(([role, count]) => {
        console.log(`   ${role.padEnd(15)} : ${count}`);
      });
      console.log('');
    }
  },
  
  '8': {
    nome: 'SELECT * FROM users WHERE email LIKE "%@gmail.com"',
    descricao: 'Usuários com email Gmail',
    executar: async () => {
      const snapshot = await db.collection('users').get();
      const gmailUsers = snapshot.docs.filter(doc => 
        doc.data().email?.endsWith('@gmail.com')
      );
      formatarTabela(gmailUsers, ['name', 'email', 'role']);
    }
  },
  
  '9': {
    nome: 'SELECT * FROM courses',
    descricao: 'Todos os cursos',
    executar: async () => {
      const snapshot = await db.collection('courses').get();
      formatarTabela(snapshot.docs, ['title', 'track', 'level', 'status']);
    }
  },
  
  '10': {
    nome: 'SELECT * FROM articles WHERE status = "published"',
    descricao: 'Artigos publicados',
    executar: async () => {
      const snapshot = await db.collection('articles')
        .where('status', '==', 'published')
        .get();
      formatarTabela(snapshot.docs, ['title', 'author', 'publishedAt']);
    }
  },
  
  '11': {
    nome: 'Query Customizada',
    descricao: 'Digite sua própria query',
    executar: async () => {
      console.log('\n🔧 Query Customizada\n');
      console.log('Exemplo: users where role == student\n');
      
      rl.question('Coleção: ', async (colecao) => {
        rl.question('Campo: ', async (campo) => {
          rl.question('Operador (==, >, <, >=, <=, in): ', async (operador) => {
            rl.question('Valor: ', async (valor) => {
              try {
                let valorParsed = valor;
                if (valor === 'true') valorParsed = true;
                if (valor === 'false') valorParsed = false;
                if (!isNaN(valor)) valorParsed = Number(valor);
                
                const snapshot = await db.collection(colecao)
                  .where(campo, operador, valorParsed)
                  .get();
                
                if (snapshot.empty) {
                  console.log('\n❌ Nenhum resultado encontrado.\n');
                } else {
                  console.log(`\n✅ ${snapshot.size} resultados:\n`);
                  snapshot.forEach(doc => {
                    console.log(`📄 ${doc.id}:`, doc.data());
                    console.log('');
                  });
                }
                
                mostrarMenu();
              } catch (error) {
                console.error('❌ Erro:', error.message);
                mostrarMenu();
              }
            });
          });
        });
      });
    }
  }
};

// Mostrar menu
function mostrarMenu() {
  console.log('\n🔥 Firestore Query Tool - Queries Disponíveis:\n');
  
  Object.entries(queries).forEach(([key, query]) => {
    console.log(`${key}. ${query.descricao}`);
    console.log(`   ${query.nome}`);
    console.log('');
  });
  
  console.log('0. Sair\n');
  
  rl.question('Escolha uma query (0-11): ', async (opcao) => {
    if (opcao === '0') {
      console.log('\n👋 Até logo!\n');
      rl.close();
      process.exit(0);
      return;
    }
    
    const query = queries[opcao];
    
    if (!query) {
      console.log('\n❌ Opção inválida!\n');
      mostrarMenu();
      return;
    }
    
    console.log(`\n⏳ Executando: ${query.nome}\n`);
    
    try {
      await query.executar();
      mostrarMenu();
    } catch (error) {
      console.error('❌ Erro ao executar query:', error.message);
      mostrarMenu();
    }
  });
}

// Iniciar
console.log('\n🚀 Conectando ao Firestore...\n');
mostrarMenu();
