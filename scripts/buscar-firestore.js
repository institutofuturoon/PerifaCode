/**
 * Script para buscar dados no Firestore via CLI
 * 
 * Uso:
 * node scripts/buscar-firestore.js [comando] [filtro]
 * 
 * Comandos:
 * - voluntarios: Lista todos os voluntários
 * - alunos: Lista todos os alunos
 * - inativos: Lista usuários inativos
 * - email [email]: Busca por email
 * - id [userId]: Busca por ID
 */

const admin = require('firebase-admin');
require('dotenv').config();

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

// Funções de busca
async function buscarVoluntarios() {
  console.log('\n🔍 Buscando voluntários...\n');
  const snapshot = await db.collection('users')
    .where('role', 'in', ['instructor', 'admin'])
    .get();
  
  console.log(`📊 Total: ${snapshot.size} voluntários\n`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`👤 ${data.name}`);
    console.log(`   📧 ${data.email}`);
    console.log(`   🎯 Role: ${data.role}`);
    console.log(`   ✅ Status: ${data.accountStatus || 'active'}`);
    console.log(`   💡 Mentor: ${data.isMentor ? 'Sim' : 'Não'}`);
    console.log('');
  });
}

async function buscarAlunos() {
  console.log('\n🔍 Buscando alunos...\n');
  const snapshot = await db.collection('users')
    .where('role', '==', 'student')
    .get();
  
  console.log(`📊 Total: ${snapshot.size} alunos\n`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`👤 ${data.name}`);
    console.log(`   📧 ${data.email}`);
    console.log(`   ✅ Status: ${data.accountStatus || 'active'}`);
    console.log(`   ⭐ XP: ${data.xp || 0}`);
    console.log('');
  });
}

async function buscarInativos() {
  console.log('\n🔍 Buscando usuários inativos...\n');
  const snapshot = await db.collection('users')
    .where('accountStatus', '==', 'inactive')
    .get();
  
  console.log(`📊 Total: ${snapshot.size} inativos\n`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`👤 ${data.name}`);
    console.log(`   📧 ${data.email}`);
    console.log(`   🎯 Role: ${data.role}`);
    console.log(`   🚫 Status: INATIVO`);
    console.log('');
  });
}

async function buscarPorEmail(email) {
  console.log(`\n🔍 Buscando por email: ${email}\n`);
  const snapshot = await db.collection('users')
    .where('email', '==', email)
    .get();
  
  if (snapshot.empty) {
    console.log('❌ Nenhum usuário encontrado com este email.');
    return;
  }
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`✅ Usuário encontrado:`);
    console.log(`   🆔 ID: ${doc.id}`);
    console.log(`   👤 Nome: ${data.name}`);
    console.log(`   📧 Email: ${data.email}`);
    console.log(`   🎯 Role: ${data.role}`);
    console.log(`   ✅ Status: ${data.accountStatus || 'active'}`);
    console.log(`   💡 Mentor: ${data.isMentor ? 'Sim' : 'Não'}`);
    console.log('');
  });
}

async function buscarPorId(userId) {
  console.log(`\n🔍 Buscando por ID: ${userId}\n`);
  const doc = await db.collection('users').doc(userId).get();
  
  if (!doc.exists) {
    console.log('❌ Usuário não encontrado.');
    return;
  }
  
  const data = doc.data();
  console.log(`✅ Usuário encontrado:`);
  console.log(`   🆔 ID: ${doc.id}`);
  console.log(`   👤 Nome: ${data.name}`);
  console.log(`   📧 Email: ${data.email}`);
  console.log(`   🎯 Role: ${data.role}`);
  console.log(`   ✅ Status: ${data.accountStatus || 'active'}`);
  console.log(`   💡 Mentor: ${data.isMentor ? 'Sim' : 'Não'}`);
  console.log('');
}

async function listarTodos() {
  console.log('\n🔍 Listando todos os usuários...\n');
  const snapshot = await db.collection('users').get();
  
  const stats = {
    total: snapshot.size,
    alunos: 0,
    voluntarios: 0,
    admins: 0,
    ativos: 0,
    inativos: 0,
    mentores: 0
  };
  
  snapshot.forEach(doc => {
    const data = doc.data();
    
    if (data.role === 'student') stats.alunos++;
    if (data.role === 'instructor') stats.voluntarios++;
    if (data.role === 'admin') stats.admins++;
    if (data.accountStatus === 'active' || !data.accountStatus) stats.ativos++;
    if (data.accountStatus === 'inactive') stats.inativos++;
    if (data.isMentor) stats.mentores++;
  });
  
  console.log('📊 Estatísticas:');
  console.log(`   👥 Total: ${stats.total}`);
  console.log(`   🎓 Alunos: ${stats.alunos}`);
  console.log(`   👨‍🏫 Voluntários: ${stats.voluntarios}`);
  console.log(`   👑 Admins: ${stats.admins}`);
  console.log(`   ✅ Ativos: ${stats.ativos}`);
  console.log(`   🚫 Inativos: ${stats.inativos}`);
  console.log(`   💡 Mentores: ${stats.mentores}`);
  console.log('');
}

// Processar argumentos
const comando = process.argv[2];
const parametro = process.argv[3];

async function main() {
  try {
    switch (comando) {
      case 'voluntarios':
        await buscarVoluntarios();
        break;
      case 'alunos':
        await buscarAlunos();
        break;
      case 'inativos':
        await buscarInativos();
        break;
      case 'email':
        if (!parametro) {
          console.log('❌ Forneça um email: node scripts/buscar-firestore.js email usuario@exemplo.com');
          return;
        }
        await buscarPorEmail(parametro);
        break;
      case 'id':
        if (!parametro) {
          console.log('❌ Forneça um ID: node scripts/buscar-firestore.js id USER_ID');
          return;
        }
        await buscarPorId(parametro);
        break;
      case 'todos':
      case 'stats':
        await listarTodos();
        break;
      default:
        console.log(`
🔥 Buscar Firestore - Comandos Disponíveis

Uso: node scripts/buscar-firestore.js [comando] [parametro]

Comandos:
  voluntarios          Lista todos os voluntários (instructors + admins)
  alunos              Lista todos os alunos
  inativos            Lista usuários inativos
  email [email]       Busca por email específico
  id [userId]         Busca por ID específico
  todos               Mostra estatísticas gerais
  stats               Alias para 'todos'

Exemplos:
  node scripts/buscar-firestore.js voluntarios
  node scripts/buscar-firestore.js email joao@exemplo.com
  node scripts/buscar-firestore.js id abc123xyz
  node scripts/buscar-firestore.js todos
        `);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
