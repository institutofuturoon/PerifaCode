# 🔧 Troubleshooting: Botão de Exclusão Não Aparece

## ❓ Problema

Alguns voluntários não têm botão de "Desativar" ou "Deletar" visível.

---

## 🔍 Causas Possíveis

### 1. Você não é Admin

**Sintoma:** Nenhum botão de exclusão aparece para ninguém

**Causa:** Apenas usuários com `role: 'admin'` podem ver os botões

**Solução:**
1. Verifique seu role no Firestore
2. Acesse: Firebase Console → Firestore → users → [seu ID]
3. Confirme que `role: 'admin'`

---

### 2. Campo `accountStatus` Indefinido

**Sintoma:** Botão "Desativar" não aparece mesmo sendo admin

**Causa:** Voluntários antigos podem não ter o campo `accountStatus` definido

**Solução Implementada:** ✅ Agora o botão aparece se:
- `accountStatus === 'active'` OU
- `accountStatus === undefined` (não definido)

**Código:**
```typescript
{(member.accountStatus === 'active' || !member.accountStatus) && (
  <button onClick={() => handleDeleteUser(member.id)}>
    Desativar
  </button>
)}
```

---

### 3. Status Diferente de 'active' ou 'inactive'

**Sintoma:** Nenhum botão aparece

**Causa:** Campo `accountStatus` tem valor inesperado (ex: 'pending', 'suspended')

**Solução:**
1. Verifique no Firestore
2. Corrija manualmente para 'active' ou 'inactive'

---

## ✅ Lógica Atual dos Botões

### Botão "Desativar" (Laranja)

**Aparece quando:**
- ✅ Usuário logado é admin
- ✅ Membro tem `accountStatus === 'active'`
- ✅ OU membro não tem `accountStatus` definido

**Código:**
```typescript
{user?.role === 'admin' && 
 (member.accountStatus === 'active' || !member.accountStatus) && (
  <button>Desativar</button>
)}
```

---

### Botão "🗑️ Deletar" (Vermelho)

**Aparece quando:**
- ✅ Usuário logado é admin
- ✅ Membro tem `accountStatus === 'inactive'`

**Código:**
```typescript
{user?.role === 'admin' && 
 member.accountStatus === 'inactive' && (
  <button>🗑️ Deletar</button>
)}
```

---

## 🧪 Como Testar

### Teste 1: Verificar seu Role

```javascript
// No console do navegador (F12)
console.log('Meu role:', user?.role);
// Deve mostrar: 'admin'
```

### Teste 2: Verificar Status dos Membros

```javascript
// No console do navegador (F12)
users
  .filter(u => u.role === 'instructor' || u.role === 'admin')
  .forEach(u => {
    console.log(u.name, '→', u.accountStatus || 'UNDEFINED');
  });
```

### Teste 3: Usar Script CLI

```bash
node scripts/buscar-firestore.js voluntarios
```

Verifique a coluna "Status" de cada voluntário.

---

## 🔧 Correções Manuais

### Corrigir Status no Firestore

**Via Console:**
1. Firebase Console → Firestore
2. Navegue até `users/{userId}`
3. Adicione/edite campo: `accountStatus: 'active'`
4. Salve

**Via Script:**
```javascript
// corrigir-status.js
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

async function corrigirStatus() {
  const snapshot = await db.collection('users')
    .where('role', 'in', ['instructor', 'admin'])
    .get();
  
  const batch = db.batch();
  let count = 0;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.accountStatus) {
      batch.update(doc.ref, { accountStatus: 'active' });
      console.log(`✅ Corrigindo: ${data.name}`);
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`\n✅ ${count} usuários corrigidos!`);
  } else {
    console.log('\n✅ Todos os usuários já têm accountStatus definido.');
  }
}

corrigirStatus();
```

Execute:
```bash
node corrigir-status.js
```

---

## 📊 Verificação Completa

### Checklist de Diagnóstico

- [ ] Estou logado como admin?
- [ ] O voluntário tem `accountStatus` definido?
- [ ] O `accountStatus` é 'active' ou 'inactive'?
- [ ] Recarreguei a página após fazer mudanças?
- [ ] Verifiquei o console do navegador (F12)?

### Comandos Úteis

**Ver todos os voluntários:**
```bash
node scripts/buscar-firestore.js voluntarios
```

**Ver usuários inativos:**
```bash
node scripts/buscar-firestore.js inativos
```

**Buscar por email:**
```bash
node scripts/buscar-firestore.js email voluntario@exemplo.com
```

---

## 🎯 Resumo da Correção

### Antes (Problema)

```typescript
// Botão só aparecia se accountStatus === 'active'
{member.accountStatus === 'active' && (
  <button>Desativar</button>
)}
```

**Problema:** Voluntários sem `accountStatus` não tinham botão

---

### Depois (Corrigido) ✅

```typescript
// Botão aparece se active OU undefined
{(member.accountStatus === 'active' || !member.accountStatus) && (
  <button>Desativar</button>
)}
```

**Solução:** Agora funciona para todos os voluntários ativos ou sem status definido

---

## 📞 Ainda Não Funciona?

### Verifique:

1. **Console do navegador (F12):**
   - Há erros em vermelho?
   - O que mostra `console.log(user?.role)`?

2. **Firestore:**
   - O campo `role` está correto?
   - O campo `accountStatus` existe?

3. **Cache:**
   - Limpe o cache do navegador (Ctrl+Shift+Delete)
   - Faça logout e login novamente

4. **Versão:**
   - Faça `git pull` para pegar a última versão
   - Execute `npm run build` novamente

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Status:** ✅ Problema Corrigido  
**Versão:** 1.0
