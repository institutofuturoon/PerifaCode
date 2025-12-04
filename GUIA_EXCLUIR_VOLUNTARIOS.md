# 🗑️ Guia: Excluir Voluntários (Desativar e Deletar)

## ✅ Implementação Concluída

### 🎯 O Que Foi Implementado

Duas opções para remover voluntários:

1. **"Desativar"** (Soft Delete) - Reversível
2. **"Deletar"** (Hard Delete) - Permanente e irreversível

---

## 🚀 Como Usar (Admin)

### Opção 1: Desativar (Recomendado)

**Quando usar:** Membro saiu temporariamente ou pode voltar

1. **Acesse:** Dashboard → Equipe & Voluntários
2. **Localize** o membro na tabela
3. **Clique:** "Desativar" (botão laranja)
4. **Confirme** a ação no popup
5. **Resultado:** Membro fica com status "Inativo"

**O Que Acontece:**
- ✅ Campo `accountStatus` muda para `'inactive'`
- ✅ Dados preservados no banco
- ✅ Pode ser reativado depois
- ✅ Aparece badge "🚫 Inativo"
- ✅ Botão "🗑️ Deletar" fica disponível

---

### Opção 2: Deletar Permanentemente (Cuidado!)

**Quando usar:** Membro nunca mais voltará e você quer limpar dados

1. **Primeiro desative** o membro (Opção 1)
2. **Aparece botão** "🗑️ Deletar" (vermelho escuro)
3. **Clique** em "🗑️ Deletar"
4. **Digite "DELETAR"** no prompt (exatamente assim, em maiúsculas)
5. **Confirme** a ação

**O Que Acontece:**
- ⚠️ Removido do Firestore (permanente)
- ⚠️ Todos os dados perdidos
- ⚠️ Não pode ser desfeito
- ⚠️ Precisa deletar manualmente do Firebase Auth Console
- ❌ IRREVERSÍVEL

---

## 🔍 Diferenças: Desativar vs Deletar

| Aspecto | Desativar (Soft Delete) | Deletar (Hard Delete) |
|---------|-------------------------|----------------------|
| **Dados** | ✅ Preservados | ❌ Perdidos |
| **Reversível** | ✅ Sim | ❌ Não |
| **Firebase Auth** | ✅ Mantém | ⚠️ Precisa deletar manual |
| **Histórico** | ✅ Mantém | ❌ Perde |
| **Referências** | ✅ Mantém | ⚠️ Pode quebrar |
| **Auditoria** | ✅ Completa | ❌ Perdida |
| **Quando usar** | Saída temporária | Nunca mais volta |
| **Segurança** | ✅ Seguro | ⚠️ Perigoso |
| **Confirmação** | Simples | Dupla (prompt) |

### ⚠️ DESATIVAR (Recomendado)

**Vantagens:**
- ✅ Seguro (não perde dados)
- ✅ Reversível
- ✅ Mantém integridade referencial
- ✅ Auditoria completa
- ✅ Pode reativar depois

**Quando usar:**
- Membro saiu temporariamente
- Pode voltar no futuro
- Quer manter histórico
- Precisa de auditoria

### 🗑️ DELETAR (Use com Cuidado!)

**Desvantagens:**
- ❌ Perde histórico
- ❌ Pode quebrar referências
- ❌ Não pode desfazer
- ❌ Problemas de auditoria
- ❌ Precisa deletar Auth manualmente

**Quando usar:**
- Membro nunca mais voltará
- Quer limpar dados antigos
- Conformidade com LGPD/GDPR
- Teste/dados incorretos

---

## 🔄 Como Reativar um Voluntário

### Opção 1: Editar Manualmente

1. **Acesse:** Dashboard → Equipe & Voluntários
2. **Clique:** "Editar" no membro inativo
3. **No Firestore Console:**
   - Vá para `users/{userId}`
   - Mude `accountStatus: 'inactive'` → `'active'`
4. **Salve** as alterações

### Opção 2: Adicionar Botão "Reativar" (Futura)

```typescript
// Código para implementar depois
const handleReactivateUser = async (userId: string) => {
  await updateDoc(doc(db, "users", userId), { 
    accountStatus: 'active' 
  });
  showToast("✅ Usuário reativado!");
};
```

---

## 🎨 Interface

### Botão "Desativar"

**Aparece quando:**
- ✅ Usuário logado é admin
- ✅ Membro está ativo

**Estilo:**
- 🔴 Texto vermelho
- 🔴 Hover mais claro
- 🔴 Transição suave

**Código:**
```tsx
{user?.role === 'admin' && member.accountStatus === 'active' && (
  <button 
    onClick={() => handleDeleteUser(member.id)} 
    className="text-red-500 hover:text-red-400 transition-colors"
    title="Desativar membro"
  >
    Desativar
  </button>
)}
```

### Badge "Inativo"

**Aparece quando:**
- ✅ Membro está inativo

**Estilo:**
- 🔴 Fundo vermelho translúcido
- 🔴 Texto vermelho
- 🔴 Borda vermelha
- 🚫 Emoji de bloqueio

---

## 🔒 Segurança

### Validações Implementadas

1. **Confirmação obrigatória:**
   ```javascript
   if (window.confirm("Tem certeza que deseja desativar este usuário?"))
   ```

2. **Apenas admins:**
   ```tsx
   {user?.role === 'admin' && ...}
   ```

3. **Não pode desativar a si mesmo** (recomendado adicionar):
   ```typescript
   {user?.role === 'admin' && member.id !== user.id && ...}
   ```

---

## 📊 Estatísticas Atualizadas

O painel já mostra:
- **Total** de membros
- **Ativos** (verde)
- **Inativos** (vermelho)
- **Mentores** ativos
- **Admins** e **Instrutores**

Quando desativa um membro:
- ✅ "Ativos" diminui
- ✅ "Inativos" aumenta
- ✅ "Mentores" atualiza (se era mentor)

---

## 🧪 Como Testar

### Teste 1: Desativar Voluntário

1. **Acesse:** `/admin` → Equipe & Voluntários
2. **Clique:** "Desativar" em um membro
3. **Confirme** no popup
4. **Verifique:**
   - Badge "🚫 Inativo" aparece
   - Botão "Desativar" some
   - Estatísticas atualizam

### Teste 2: Membro Não Consegue Logar

1. **Faça logout**
2. **Tente logar** com email do membro desativado
3. **Resultado:** Login funciona, mas pode adicionar validação

### Teste 3: Filtros e Busca

1. **Busque** por nome do membro inativo
2. **Verifique** que aparece na lista
3. **Confirme** que badge "Inativo" está visível

---

## 🔧 Melhorias Futuras

### Curto Prazo
- [ ] Botão "Reativar" para membros inativos
- [ ] Impedir desativar a si mesmo
- [ ] Bloquear login de usuários inativos
- [ ] Filtro "Ativos/Inativos/Todos"

### Médio Prazo
- [ ] Histórico de ativações/desativações
- [ ] Motivo da desativação (campo texto)
- [ ] Notificação por email ao desativar
- [ ] Desativação automática após X dias inativo

### Longo Prazo
- [ ] Soft delete com período de retenção
- [ ] Arquivamento de dados
- [ ] Exportação antes de deletar
- [ ] GDPR compliance (direito ao esquecimento)

---

## 📋 Checklist de Implementação

- [x] Função `handleDeleteUser` reutilizada
- [x] Botão "Desativar" adicionado
- [x] Validação de role (apenas admin)
- [x] Confirmação obrigatória
- [x] Badge "Inativo" visível
- [x] Estatísticas atualizadas
- [x] Build testado
- [x] Documentação criada

---

## 🆘 Troubleshooting

### Problema: Botão não aparece

**Causa:** Usuário não é admin

**Solução:** Faça login com conta admin

### Problema: Membro inativo ainda faz login

**Causa:** Validação não implementada no login

**Solução futura:**
```typescript
// Em Login.tsx, após signInWithEmailAndPassword
const userDoc = await getDoc(doc(db, 'users', user.uid));
if (userDoc.data()?.accountStatus === 'inactive') {
  await signOut(auth);
  throw new Error('Conta desativada');
}
```

### Problema: Não consigo reativar

**Causa:** Botão "Reativar" não implementado

**Solução:** Use Firestore Console manualmente

---

## 📞 Comparação com Alunos

| Aspecto | Alunos | Voluntários |
|---------|--------|-------------|
| **Botão** | "Desativar" | "Desativar" |
| **Função** | `handleDeleteUser` | `handleDeleteUser` |
| **Localização** | Painel "Alunos" | Painel "Equipe" |
| **Permissão** | Apenas admin | Apenas admin |
| **Confirmação** | Sim | Sim |
| **Reversível** | Sim (manual) | Sim (manual) |

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Status:** ✅ Implementado e Testado  
**Versão:** 1.0


---

## ⚠️ IMPORTANTE: Deletar do Firebase Auth

### Por Que Precisa Deletar Manualmente?

O Firebase Auth **não pode ser deletado do frontend** por segurança. Apenas o Firebase Admin SDK (backend) pode fazer isso.

### Como Deletar do Firebase Auth Console

1. **Acesse:** https://console.firebase.google.com
2. **Selecione** seu projeto
3. **Vá em:** Authentication → Users
4. **Busque** pelo email do usuário
5. **Clique** nos 3 pontinhos (⋮)
6. **Selecione:** "Delete account"
7. **Confirme** a exclusão

### Alternativa: Cloud Function (Futuro)

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.deleteUser = functions.https.onCall(async (data, context) => {
  // Verificar se é admin
  if (!context.auth || context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied');
  }

  const { userId } = data;

  try {
    // Deletar do Auth
    await admin.auth().deleteUser(userId);
    
    // Deletar do Firestore
    await admin.firestore().collection('users').doc(userId).delete();
    
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

---

## 🎨 Interface Atualizada

### Botões por Status

**Membro Ativo:**
- 🔵 "Editar" (azul)
- 🟠 "Desativar" (laranja)

**Membro Inativo:**
- 🔵 "Editar" (azul)
- ⚪ "Inativo" (cinza, texto)
- 🔴 "🗑️ Deletar" (vermelho escuro, bold)

### Cores dos Botões

```tsx
// Desativar (laranja - reversível)
className="text-orange-500 hover:text-orange-400"

// Deletar (vermelho escuro - permanente)
className="text-red-600 hover:text-red-500 font-bold"
```

---

## 🔒 Segurança da Deleção

### Confirmação em Duas Etapas

1. **Primeira etapa:** Desativar
   - Confirmação simples (OK/Cancelar)
   - Membro fica inativo

2. **Segunda etapa:** Deletar
   - Prompt com mensagem de aviso
   - Precisa digitar "DELETAR" exatamente
   - Não aceita minúsculas ou variações

### Mensagem de Confirmação

```
⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL!

Você está prestes a DELETAR PERMANENTEMENTE:
• [Nome do Membro]
• Todos os dados serão perdidos
• Não poderá ser desfeito

Digite "DELETAR" para confirmar:
```

### Validação

```typescript
if (confirmation !== 'DELETAR') {
  showToast("❌ Operação cancelada. Digite exatamente 'DELETAR' para confirmar.");
  return;
}
```

---

## 🧪 Testes Atualizados

### Teste 1: Desativar Voluntário

1. **Acesse:** `/admin` → Equipe & Voluntários
2. **Clique:** "Desativar" em um membro ativo
3. **Confirme** no popup
4. **Verifique:**
   - Badge "🚫 Inativo" aparece
   - Botão "Desativar" some
   - Botão "🗑️ Deletar" aparece
   - Estatísticas atualizam

### Teste 2: Cancelar Deleção

1. **Clique:** "🗑️ Deletar" em membro inativo
2. **Digite:** "deletar" (minúsculo)
3. **Resultado:** Operação cancelada
4. **Verifique:** Membro ainda existe

### Teste 3: Deletar Permanentemente

1. **Clique:** "🗑️ Deletar" em membro inativo
2. **Digite:** "DELETAR" (maiúsculo)
3. **Confirme**
4. **Verifique:**
   - Membro some da lista
   - Toast de confirmação aparece
   - Aviso sobre Firebase Auth
5. **Delete manualmente** do Firebase Auth Console

### Teste 4: Verificar Firestore

1. **Acesse:** Firebase Console → Firestore
2. **Busque** pelo ID do usuário deletado
3. **Resultado:** Documento não existe mais

---

## 📋 Checklist Atualizado

- [x] Função `handleDeleteUser` (desativar)
- [x] Função `handlePermanentDeleteUser` (deletar)
- [x] Botão "Desativar" (laranja)
- [x] Botão "🗑️ Deletar" (vermelho)
- [x] Confirmação dupla (prompt)
- [x] Validação "DELETAR" exata
- [x] Remove do Firestore
- [x] Aviso sobre Firebase Auth
- [x] Build testado
- [x] Documentação atualizada

---

## 🔄 Fluxo Completo

```
┌─────────────────┐
│ Membro Ativo    │
│ [Editar]        │
│ [Desativar]     │ ← Botão laranja
└────────┬────────┘
         │ Clique "Desativar"
         ↓
┌─────────────────┐
│ Confirmação     │
│ OK / Cancelar   │
└────────┬────────┘
         │ OK
         ↓
┌─────────────────┐
│ Membro Inativo  │
│ [Editar]        │
│ "Inativo"       │
│ [🗑️ Deletar]   │ ← Botão vermelho
└────────┬────────┘
         │ Clique "Deletar"
         ↓
┌─────────────────┐
│ Prompt          │
│ Digite "DELETAR"│
└────────┬────────┘
         │ "DELETAR"
         ↓
┌─────────────────┐
│ Deletado        │
│ (Firestore)     │
│ ⚠️ Auth manual  │
└─────────────────┘
```

---

**Atualizado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Status:** ✅ Implementado e Testado  
**Versão:** 2.0 (com deleção permanente)
