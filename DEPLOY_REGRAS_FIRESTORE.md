# 🚀 Deploy das Regras do Firestore

## ✅ O Que Foi Alterado

Mudei as regras do Firestore para permitir que **TODOS** possam ler artigos, independente do status.

**Antes:**
```javascript
allow read: if resource.data.status == 'published' || isAdmin();
```

**Depois:**
```javascript
allow read: if true;  // Todos podem ler todos os artigos
```

---

## 📋 Como Fazer o Deploy

### Opção 1: Firebase CLI (Recomendado)

#### Passo 1: Fazer Login
```powershell
firebase login --reauth
```

Isso vai abrir o navegador para você fazer login.

#### Passo 2: Deploy das Regras
```powershell
firebase deploy --only firestore:rules
```

Aguarde a mensagem de sucesso!

---

### Opção 2: Firebase Console (Mais Fácil)

#### Passo 1: Acessar o Console
1. Acesse: https://console.firebase.google.com/
2. Selecione: **perifacode-fc132**

#### Passo 2: Ir para Regras
1. No menu lateral, clique em **"Firestore Database"**
2. Clique na aba **"Regras"** (Rules)

#### Passo 3: Editar as Regras
Procure esta seção:

```javascript
// COLEÇÃO: articles (Blog)
match /articles/{articleId} {
  // Todos podem ler artigos publicados
  // Admins podem ler rascunhos
  allow read: if resource.data.status == 'published' || isAdmin();
  
  // Apenas admins podem criar/editar/deletar artigos
  allow write: if isAdmin();
}
```

Mude para:

```javascript
// COLEÇÃO: articles (Blog)
match /articles/{articleId} {
  // Todos podem ler todos os artigos (sem restrição de status)
  allow read: if true;
  
  // Apenas admins podem criar/editar/deletar artigos
  allow write: if isAdmin();
}
```

#### Passo 4: Publicar
1. Clique em **"Publicar"** (Publish)
2. Aguarde a confirmação

---

## 🧪 Testar

Após o deploy:

1. **Abra aba anônima** (Ctrl + Shift + N)
2. **Acesse:** `http://localhost:5173/blog`
3. **Resultado:** Todos os artigos aparecem! ✅

---

## 💡 O Que Isso Significa

Com esta mudança:

- ✅ **Todos os artigos** aparecem para usuários não logados
- ✅ **Não precisa** ter `status: "published"`
- ✅ **Rascunhos** também aparecem (se quiser esconder, use o status)
- ✅ **Apenas admins** podem criar/editar/deletar

---

## ⚠️ Importante

Se você quiser que **apenas artigos publicados** apareçam:

1. Mantenha a regra como estava
2. Certifique-se que todos os artigos têm `status: "published"`

**Ou**

Use a nova regra (todos veem tudo) e controle a visibilidade no código da aplicação.

---

## 📊 Comparação

| Aspecto | Regra Antiga | Regra Nova |
|---------|--------------|------------|
| Artigos publicados | ✅ Visíveis | ✅ Visíveis |
| Artigos em rascunho | ❌ Ocultos | ✅ Visíveis |
| Precisa de status | ✅ Sim | ❌ Não |
| Controle de visibilidade | Firestore | Aplicação |

---

## 🔄 Reverter (se necessário)

Se quiser voltar para a regra antiga:

```javascript
allow read: if resource.data.status == 'published' || isAdmin();
```

E faça o deploy novamente.

---

**Tempo estimado:** 2 minutos  
**Dificuldade:** Fácil  
**Resultado:** Todos os artigos visíveis! ✅
