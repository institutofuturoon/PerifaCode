/**
 * Script para REATIVAR TODOS OS ALUNOS
 * 
 * Uso:
 * node scripts/reativar-todos-alunos.js
 * 
 * O que faz:
 * 1. Lista todos os alunos inativos
 * 2. Pede confirmação
 * 3. Muda accountStatus para 'active'
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

// Função para perguntar
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Função principal
async function reativarTodosAlunos() {
  console.log('\n♻️  REATIVAR TODOS OS ALUNOS\n');

  try {
    // 1. Buscar todos os alunos inativos
    console.log('📊 Buscando alunos inativos...\n');
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .where('accountStatus', '==', 'inactive')
      .get();

    if (snapshot.empty) {
      console.log('✅ Nenhum aluno inativo encontrado.\n');
      rl.close();
      return;
    }

    const alunosInativos = [];
    snapshot.forEach(doc => {
      alunosInativos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📋 Alunos inativos: ${alunosInativos.length}\n`);

    // Mostrar primeiros 10
    console.log('👥 Primeiros alunos inativos:');
    alunosInativos.slice(0, 10).forEach((aluno, index) => {
      console.log(`   ${index + 1}. ${aluno.name} (${aluno.email})`);
    });
    
    if (alunosInativos.length > 10) {
      console.log(`   ... e mais ${alunosInativos.length - 10} alunos\n`);
    } else {
      console.log('');
    }

    // 2. Confirmação
    const resposta = await question(`❓ Reativar ${alunosInativos.length} alunos? (sim/não): `);
    
    if (resposta.toLowerCase() !== 'sim') {
      console.log('\n❌ Operação cancelada.\n');
      rl.close();
      return;
    }

    // 3. Reativar em lote
    console.log('\n♻️  Reativando alunos...\n');
    
    const batch = db.batch();
    let count = 0;

    alunosInativos.forEach(aluno => {
      const ref = db.collection('users').doc(aluno.id);
      batch.update(ref, { accountStatus: 'active' });
      count++;
      
      if (count % 500 === 0) {
        console.log(`   Processando lote ${Math.floor(count / 500)}...`);
      }
    });

    await batch.commit();

    // 4. Resumo
    console.log('\n📊 Resumo:\n');
    console.log(`   ✅ Alunos reativados: ${alunosInativos.length}`);
    console.log('');
    console.log('🎉 Alunos reativados com sucesso!\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Executar
reativarTodosAlunos();
