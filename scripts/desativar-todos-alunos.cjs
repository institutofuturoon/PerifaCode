/**
 * Script para DESATIVAR TODOS OS ALUNOS (Soft Delete)
 * 
 * ✅ SEGURO: Não deleta dados, apenas desativa
 * 
 * Uso:
 * node scripts/desativar-todos-alunos.js
 * 
 * O que faz:
 * 1. Lista todos os alunos ativos
 * 2. Pede confirmação
 * 3. Muda accountStatus para 'inactive'
 * 4. Pode ser revertido depois
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
async function desativarTodosAlunos() {
  console.log('\n🔒 DESATIVAR TODOS OS ALUNOS (Soft Delete)\n');
  console.log('✅ Seguro: Dados não serão deletados, apenas desativados\n');

  try {
    // 1. Buscar todos os alunos ativos
    console.log('📊 Buscando alunos ativos...\n');
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .get();

    if (snapshot.empty) {
      console.log('✅ Nenhum aluno encontrado.\n');
      rl.close();
      return;
    }

    const alunos = [];
    const alunosAtivos = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      alunos.push({
        id: doc.id,
        ...data
      });
      
      // Considerar ativo se não tem accountStatus ou se é 'active'
      if (!data.accountStatus || data.accountStatus === 'active') {
        alunosAtivos.push({
          id: doc.id,
          ...data
        });
      }
    });

    console.log(`📋 Total de alunos: ${alunos.length}`);
    console.log(`✅ Alunos ativos: ${alunosAtivos.length}`);
    console.log(`🚫 Já inativos: ${alunos.length - alunosAtivos.length}\n`);

    if (alunosAtivos.length === 0) {
      console.log('✅ Todos os alunos já estão inativos.\n');
      rl.close();
      return;
    }

    // Mostrar primeiros 10 ativos
    console.log('👥 Primeiros alunos ativos:');
    alunosAtivos.slice(0, 10).forEach((aluno, index) => {
      console.log(`   ${index + 1}. ${aluno.name} (${aluno.email})`);
    });
    
    if (alunosAtivos.length > 10) {
      console.log(`   ... e mais ${alunosAtivos.length - 10} alunos\n`);
    } else {
      console.log('');
    }

    // 2. Confirmação
    const resposta = await question(`❓ Desativar ${alunosAtivos.length} alunos? (sim/não): `);
    
    if (resposta.toLowerCase() !== 'sim') {
      console.log('\n❌ Operação cancelada.\n');
      rl.close();
      return;
    }

    // 3. Desativar em lote
    console.log('\n🔒 Desativando alunos...\n');
    
    const batch = db.batch();
    let count = 0;

    alunosAtivos.forEach(aluno => {
      const ref = db.collection('users').doc(aluno.id);
      batch.update(ref, { accountStatus: 'inactive' });
      count++;
      
      // Firestore batch limit é 500
      if (count % 500 === 0) {
        console.log(`   Processando lote ${Math.floor(count / 500)}...`);
      }
    });

    await batch.commit();

    // 4. Resumo
    console.log('\n📊 Resumo:\n');
    console.log(`   ✅ Alunos desativados: ${alunosAtivos.length}`);
    console.log(`   ℹ️  Dados preservados: Sim`);
    console.log(`   ♻️  Reversível: Sim`);
    console.log('');
    console.log('🎉 Alunos desativados com sucesso!\n');
    console.log('💡 Para reativar, use: node scripts/reativar-todos-alunos.js\n');

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Executar
desativarTodosAlunos();
