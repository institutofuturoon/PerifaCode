# 🔧 Troubleshooting: Erro ao Criar Novo Membro

## ❌ Erros Identificados

### Erro 1: Identity Toolkit 400
```
identitytoolkit.googleapis.com/v1/accounts:lookup?key=...
Failed to load resource: the server responded with a status of 400
```

### Erro 2: Missing Permissions
```
Erro ao buscar a coleção 'projects': 
FirebaseError: Missing or insufficient permissions
```

---

## 🔍 Causas e Soluções

### Problema 1: Erro 400 no Identity Toolkit

**Causa:** O email já existe no Firebase Auth ou há problema com as credenciais

**Soluções:**

#### Solução 1A: Verificar se Email Já Existe

1. **Firebase Console:**
   - Acesse: https://console.firebase.google.com
   - Vá em: Authentication → Users
   - Busque pelo email que está tentando cadastrar
   - Se existir, delete ou use outro email

2. **Via Código (Console do Navegador - F12):**
```javascript
// Verificar se email existe
firebase.auth().fetchSignInMethodsForEmail('email@teste.com')
  .then(methods => {
    if (methods.length > 0) {
      console.log('❌ Email já cadastrado');
    } else {
      console.log('✅ Email disponível');
    }
  });
```

#### Solução 1B: Verificar Configuração do Firebase

**Arquivo:** `.env.local`

```bash
# Verificar se as keys estão corretas
VITE_FIREBASE_API_KEY=AIzaSyCfmYEpGNC1gTDtm-7X0OIWP3W3eQGXXYQ
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
```

**Ação:**
1. Confirme que são as keys corretas
2. Reinicie o servidor: `npm run dev`

---

### Problema 2: Missing Permissions (Projects)

**Causa:** As regras do Firestore estão bloqueando a leitura da coleção `projects`

**Regra Atual:**
```javascript
match /projects/{projectId} {
  allow read: if resource.data.status == 'approved' || 
                 isOwner(resource.data.authorId) ||
                 isAdmin();
}
```

**Problema:** Quando não há projetos, `resource.data` é `null`, causando erro

#### Solução 2: Atualizar Firestore Rules

**Arquivo:** `firestore.rules`

**Substituir:**
```javascript
match /projects/{projectId} {
  // Todos podem ler projetos aprovados
  // Autores e admins podem ler seus próprios projetos (mesmo pendentes/rejeitados)
  allow read: if resource.data.status == 'approved' || 
                 isOwner(resource.data.authorId) ||
                 isAdmin();
```

**Por:**
```javascript
match /projects/{projectId} {
  // Todos podem ler projetos aprovados
  // Autores e admins podem ler seus próprios projetos
  // Permite leitura se não houver dados (coleção vazia)
  allow read: if !exists(/databases/$(database)/documents/projects/$(projectId)) ||
                 resource.data.status == 'approved' || 
                 isOwner(resource.data.authorId) ||
                 isAdmin();
```

**Ou mais simples (temporário para desenvolvimento):**
```javascript
match /projects/{projectId} {
  // Leitura pública (temporário)
  allow read: if true;
  
  // Escrita apenas para autenticados
  allow create: if isAuthenticated() && 
                   request.resource.data.authorId == request.auth.uid;
  allow update: if isOwner(resource.data.authorId) || isAdmin();
  allow delete: if isAdmin();
}
```

---

## 🚀 Solução Rápida (Passo a Passo)

### Passo 1: Atualizar Firestore Rules

**Edite:** `firestore.rules`

**Adicione no início (temporário para desenvolvimento):**
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    
    // TEMPORÁRIO: Permitir leitura de todas as coleções vazias
    match /{collection}/{document} {
      allow read: if request.auth != null;
    }
    
    // ... resto das regras
  }
}
```

---

### Passo 2: Deploy das Regras

```bash
# Fazer deploy das novas regras
firebase deploy --only firestore:rules
```

**Aguarde a mensagem:**
```
✔  firestore: released rules firestore.rules to cloud.firestore
✔  Deploy complete!
```

---

### Passo 3: Limpar Cache e Testar

```bash
# 1. Parar o servidor (Ctrl+C)

# 2. Limpar cache
npm run build

# 3. Reiniciar
npm run dev
```

---

### Passo 4: Testar Criação de Membro

1. **Acesse:** `/admin/editor-equipe/new`
2. **Preencha:**
   - Email: `teste-novo@gmail.com` (use email que NÃO existe)
   - Senha: `Teste123!`
   - Nome: `Teste Novo`
3. **Clique:** "Criar Membro"
4. **Resultado:** Deve funcionar ✅

---

## 🔒 Regras de Produção (Seguras)

Após testar, use estas regras mais seguras:

```javascript
// firestore.rules - PRODUÇÃO

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Funções auxiliares
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users - Leitura pública
    match /users/{userId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }
    
    // Projects - Leitura pública, escrita autenticada
    match /projects/{projectId} {
      allow read: if true; // Leitura pública
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    // Courses - Leitura pública
    match /courses/{courseId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Articles - Leitura pública
    match /articles/{articleId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Events - Leitura pública
    match /events/{eventId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Partners - Leitura pública
    match /partners/{partnerId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Supporters - Leitura pública
    match /supporters/{supporterId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Community Posts - Leitura pública
    match /communityPosts/{postId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isAdmin();
    }
    
    // Mentor Sessions - Leitura pública
    match /mentorSessions/{sessionId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    // Tracks - Leitura pública
    match /tracks/{trackId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Financial Statements - Leitura pública
    match /financialStatements/{statementId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Annual Reports - Leitura pública
    match /annualReports/{reportId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Marketing Posts - Leitura pública
    match /marketingPosts/{postId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Padrão: negar tudo não especificado
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🧪 Testar Regras Localmente

### Emulador do Firebase

```bash
# 1. Instalar emulador
npm install -g firebase-tools

# 2. Inicializar
firebase init emulators

# 3. Selecionar: Firestore

# 4. Iniciar emulador
firebase emulators:start
```

**Testar regras:**
```bash
# Abrir UI do emulador
http://localhost:4000
```

---

## 📋 Checklist de Verificação

### Antes de Criar Membro

- [ ] Firebase Auth está configurado?
- [ ] Email não existe no Firebase Auth?
- [ ] Firestore Rules permitem leitura?
- [ ] Você está logado como admin?
- [ ] `.env.local` tem as keys corretas?

### Durante a Criação

- [ ] Email é válido?
- [ ] Senha tem mínimo 6 caracteres?
- [ ] Nome está preenchido?
- [ ] Console não mostra erros 400?
- [ ] Console não mostra "Missing permissions"?

### Após a Criação

- [ ] Membro aparece no Firebase Auth?
- [ ] Membro aparece no Firestore (users)?
- [ ] Membro pode fazer login?
- [ ] Membro é forçado a trocar senha?

---

## 🆘 Ainda Não Funciona?

### Debug Avançado

**1. Verificar no Console (F12):**

```javascript
// Ver usuário atual
console.log('User:', firebase.auth().currentUser);

// Ver role
firebase.firestore()
  .collection('users')
  .doc(firebase.auth().currentUser.uid)
  .get()
  .then(doc => console.log('Role:', doc.data().role));

// Testar permissão de leitura
firebase.firestore()
  .collection('projects')
  .get()
  .then(() => console.log('✅ Pode ler projects'))
  .catch(err => console.error('❌ Erro:', err));
```

---

### 2. Verificar Logs do Firebase

**Firebase Console:**
1. Firestore → Usage
2. Ver erros de permissão
3. Identificar qual regra está bloqueando

---

### 3. Modo Desenvolvimento (Inseguro)

**APENAS PARA TESTE LOCAL:**

```javascript
// firestore.rules - DESENVOLVIMENTO APENAS
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ INSEGURO!
    }
  }
}
```

**Deploy:**
```bash
firebase deploy --only firestore:rules
```

**⚠️ IMPORTANTE:** Reverter para regras seguras antes de produção!

---

## 📞 Contato

Se ainda tiver problemas:

1. **Copie os erros** do console (F12)
2. **Tire print** da tela
3. **Verifique** Firebase Console → Authentication
4. **Verifique** Firebase Console → Firestore → Rules

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Status:** 🔧 Troubleshooting  
**Versão:** 1.0
