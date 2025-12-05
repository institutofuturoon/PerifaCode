/**
 * Script para DELETAR TODOS OS ALUNOS
 * 
 * ⚠️ ATENÇÃO: ESTE SCRIPT É IRREVERSÍVEL!
 * 
 * Uso:
 * node scripts/deletar-todos-alunos.js
 * 
 * O que faz:
 * 1. Lista todos os alunos (role: 'student')
 * 2. Pede confirmação DUPLA
 * 3. Deleta do Firestore
 * 4. Deleta do Firebase Auth
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
const auth = admin.auth();

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
async function deletarTodosAlunos() {
  console.log('\n🔥 DELETAR TODOS OS ALUNOS\n');
  console.log('⚠️  ATENÇÃO: ESTA AÇÃO É IRREVERSÍVEL!\n');

  try {
    // 1. Buscar todos os alunos
    console.log('📊 Buscando alunos...\n');
    const snapshot = await db.collection('users')
      .where('role', '==', 'student')
      .get();

    if (snapshot.empty) {
      console.log('✅ Nenhum aluno encontrado.\n');
      rl.close();
      return;
    }

    const alunos = [];
    snapshot.forEach(doc => {
      alunos.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`📋 Encontrados: ${alunos.length} alunos\n`);
    
    // Mostrar primeiros 10
    console.log('👥 Primeiros alunos:');
    alunos.slice(0, 10).forEach((aluno, index) => {
      console.log(`   ${index + 1}. ${aluno.name} (${aluno.email})`);
    });
    
    if (alunos.length > 10) {
      console.log(`   ... e mais ${alunos.length - 10} alunos\n`);
    } else {
      console.log('');
    }

    // 2. Primeira confirmação
    const resposta1 = await question('❓ Tem certeza que deseja DELETAR TODOS esses alunos? (sim/não): ');
    
    if (resposta1.toLowerCase() !== 'sim') {
      console.log('\n❌ Operação cancelada.\n');
      rl.close();
      return;
    }

    // 3. Segunda confirmação (mais forte)
    console.log('\n⚠️  ÚLTIMA CHANCE!\n');
    console.log('Esta ação irá:');
    console.log('  • Deletar todos os alunos do Firestore');
    console.log('  • Deletar todos os alunos do Firebase Auth');
    console.log('  • Perder TODOS os dados (XP, progresso, etc.)');
    console.log('  • NÃO PODE SER DESFEITO\n');
    
    const resposta2 = await question('Digite "DELETAR TUDO" para confirmar: ');
    
    if (resposta2 !== 'DELETAR TUDO') {
      console.log('\n❌ Operação cancelada.\n');
      rl.close();
      return;
    }

    // 4. Deletar
    console.log('\n🗑️  Deletando alunos...\n');
    
    let sucessos = 0;
    let erros = 0;
    let errosAuth = 0;

    for (const aluno of alunos) {
      try {
        // Deletar do Firestore
        await db.collection('users').doc(aluno.id).delete();
        console.log(`✅ Firestore: ${aluno.name}`);
        sucessos++;

        // Tentar deletar do Auth
        try {
          await auth.deleteUser(aluno.id);
          console.log(`✅ Auth: ${aluno.name}`);
        } catch (authError) {
          console.log(`⚠️  Auth não encontrado: ${aluno.name}`);
          errosAuth++;
        }

      } catch (error) {
        console.error(`❌ Erro ao deletar ${aluno.name}:`, error.message);
        erros++;
      }
    }

    // 5. Resumo
    console.log('\n📊 Resumo:\n');
    console.log(`   ✅ Deletados do Firestore: ${sucessos}`);
    console.log(`   ⚠️  Não encontrados no Auth: ${errosAuth}`);
    console.log(`   ❌ Erros: ${erros}`);
    console.log('');

    if (sucessos > 0) {
      console.log('🎉 Alunos deletados com sucesso!\n');
    }

  } catch (error) {
    console.error('\n❌ Erro:', error.message);
  } finally {
    rl.close();
    process.exit(0);
  }
}

// Executar
deletarTodosAlunos();
