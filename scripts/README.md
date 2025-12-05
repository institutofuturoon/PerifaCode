# 🛠️ Scripts CLI - Firestore

Scripts para gerenciar e consultar dados do Firestore via linha de comando.

## 📁 Scripts Disponíveis

### 1. `buscar-firestore.js` - Busca Rápida
Comandos diretos para buscar dados específicos.

### 2. `query-firestore.js` - Queries Interativas
Interface interativa com queries tipo SQL.

### 3. `desativar-todos-alunos.js` - Desativar Alunos (NOVO!)
Desativa todos os alunos de uma vez (soft delete, reversível).

### 4. `reativar-todos-alunos.js` - Reativar Alunos (NOVO!)
Reativa todos os alunos desativados.

### 5. `deletar-todos-alunos.js` - Deletar Alunos (CUIDADO!)
Deleta permanentemente todos os alunos (irreversível).

---

## 📋 Pré-requisitos

### 1. Instalar Firebase Admin SDK

```bash
npm install firebase-admin dotenv
```

### 2. Configurar Credenciais

Adicione no `.env.local`:

```env
FIREBASE_CLIENT_EMAIL=seu-service-account@projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Como obter:**
1. Firebase Console → Project Settings → Service Accounts
2. Generate New Private Key
3. Copie `client_email` e `private_key` para o `.env.local`

---

## 🔍 Buscar Dados

### Comandos Disponíveis

```bash
# Listar todos os voluntários
node scripts/buscar-firestore.js voluntarios

# Listar todos os alunos
node scripts/buscar-firestore.js alunos

# Listar usuários inativos
node scripts/buscar-firestore.js inativos

# Buscar por email
node scripts/buscar-firestore.js email joao@exemplo.com

# Buscar por ID
node scripts/buscar-firestore.js id abc123xyz

# Ver estatísticas gerais
node scripts/buscar-firestore.js todos
```

### Exemplos de Saída

**Voluntários:**
```
🔍 Buscando voluntários...

📊 Total: 5 voluntários

👤 João Silva
   📧 joao@exemplo.com
   🎯 Role: instructor
   ✅ Status: active
   💡 Mentor: Sim
```

**Estatísticas:**
```
📊 Estatísticas:
   👥 Total: 150
   🎓 Alunos: 140
   👨‍🏫 Voluntários: 8
   👑 Admins: 2
   ✅ Ativos: 145
   🚫 Inativos: 5
   💡 Mentores: 6
```

---

## 🔧 Troubleshooting

### Erro: "Cannot find module 'firebase-admin'"

```bash
npm install firebase-admin
```

### Erro: "credential-internal-error"

Verifique se as credenciais no `.env.local` estão corretas:
- `FIREBASE_CLIENT_EMAIL` deve ser um email válido
- `FIREBASE_PRIVATE_KEY` deve incluir `\n` para quebras de linha

### Erro: "PERMISSION_DENIED"

Verifique as regras do Firestore ou use credenciais de admin.

---

## 📚 Adicionar Novos Comandos

Edite `scripts/buscar-firestore.js` e adicione:

```javascript
async function meuNovoComando() {
  console.log('\n🔍 Meu comando...\n');
  const snapshot = await db.collection('users')
    .where('campo', '==', 'valor')
    .get();
  
  snapshot.forEach(doc => {
    console.log(doc.data());
  });
}

// No switch:
case 'meucomando':
  await meuNovoComando();
  break;
```

---

---

## 🔍 Queries Interativas (NOVO!)

### Uso

```bash
node scripts/query-firestore.js
```

### Queries Disponíveis

1. **Todos os alunos** - `SELECT * FROM users WHERE role = "student"`
2. **Voluntários e admins** - `SELECT * FROM users WHERE role IN (...)`
3. **Usuários inativos** - `SELECT * FROM users WHERE accountStatus = "inactive"`
4. **Apenas mentores** - `SELECT * FROM users WHERE isMentor = true`
5. **Alunos com +1000 XP** - `SELECT * FROM users WHERE xp > 1000`
6. **Top 10 usuários** - `SELECT * FROM users ORDER BY name LIMIT 10`
7. **Contar por role** - `SELECT COUNT(*) GROUP BY role`
8. **Emails Gmail** - `SELECT * WHERE email LIKE "%@gmail.com"`
9. **Todos os cursos** - `SELECT * FROM courses`
10. **Artigos publicados** - `SELECT * FROM articles WHERE status = "published"`
11. **Query customizada** - Digite sua própria query

### Exemplo de Saída

```
📊 Resultados:

name                 | email                | accountStatus        | xp                  
-------------------------------------------------------------------------------------
João Silva           | joao@gmail.com       | active               | 1500                
Maria Santos         | maria@gmail.com      | active               | 850                 

✅ Total: 2 registros
```

---

## 🗑️ Gerenciamento em Lote de Alunos (NOVO!)

### Desativar Todos os Alunos (Seguro)

```bash
node scripts/desativar-todos-alunos.js
```

**O que faz:**
- ✅ Desativa todos os alunos (accountStatus = 'inactive')
- ✅ Dados preservados
- ✅ Reversível
- ✅ Seguro para testes

**Quando usar:**
- Limpar dados de teste
- Resetar plataforma
- Preparar para novo semestre

---

### Reativar Todos os Alunos

```bash
node scripts/reativar-todos-alunos.js
```

**O que faz:**
- ♻️ Reativa todos os alunos inativos
- ✅ Restaura acesso

---

### Deletar Todos os Alunos (CUIDADO!)

```bash
node scripts/deletar-todos-alunos.js
```

**⚠️ ATENÇÃO: IRREVERSÍVEL!**

**O que faz:**
- 🗑️ Deleta do Firestore
- 🗑️ Deleta do Firebase Auth
- ❌ Perde todos os dados
- ❌ NÃO pode ser desfeito

**Confirmação dupla:**
1. Digite "sim"
2. Digite "DELETAR TUDO"

**Quando usar:**
- Apenas para limpar dados de teste
- NUNCA em produção com dados reais

---

## 🚀 Próximos Scripts

- [x] Queries interativas tipo SQL
- [x] Desativar usuários em lote
- [x] Reativar usuários em lote
- [x] Deletar usuários em lote
- [ ] Exportar dados para CSV
- [ ] Backup de coleções
- [ ] Migração de dados
