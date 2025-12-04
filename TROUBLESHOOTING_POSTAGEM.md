# 🔧 Troubleshooting: Postagem Não Aparece

## 🎯 Problema

A postagem não está aparecendo quando você acessa a URL.

---

## 🔍 Diagnóstico

### Passo 1: Verifique o Console do Navegador

Abra o console (F12) e procure por:

```
🔍 Procurando artigo: [slug-do-artigo]
📚 Total de artigos: X
📋 Artigos disponíveis: [...]
✅ Artigo encontrado: [título] ou Nenhum
```

---

## ✅ Soluções Possíveis

### 1. **Artigo Não Existe no Firestore**

**Sintoma:**
- Console mostra: "Total de artigos: 0"
- Ou artigo não aparece na lista

**Solução:**
1. Acesse `/dashboard` como admin
2. Vá em "Artigos" → "Novo Artigo"
3. Crie um artigo de teste
4. Salve e publique

---

### 2. **Artigo Está como Rascunho**

**Sintoma:**
- Artigo aparece no dashboard mas não no blog

**Solução:**
1. Edite o artigo
2. Mude o status para "Publicado"
3. Salve

---

### 3. **Slug Incorreto na URL**

**Sintoma:**
- Console mostra artigos disponíveis mas não encontra o específico

**Solução:**
1. Verifique o slug correto no console
2. Use a URL correta: `/artigo/[slug-correto]`

**Exemplo:**
```
❌ Errado: /artigo/hostinger-start
✅ Correto: /artigo/hostinger-start-impulsionando-seu-sonho-de-negocio-online
```

---

### 4. **Artigos Não Carregaram do Firestore**

**Sintoma:**
- Console mostra: "Total de artigos: 0"
- Mas você sabe que existem artigos

**Solução:**
1. Verifique a conexão com Firebase
2. Verifique as regras do Firestore
3. Recarregue a página (Ctrl + Shift + R)
4. Limpe o cache do navegador

---

### 5. **Erro nas Regras do Firestore**

**Sintoma:**
- Erro no console sobre permissões

**Solução:**

Verifique as regras em `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Artigos podem ser lidos por todos
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Deploy das regras:
```bash
firebase deploy --only firestore:rules
```

---

## 🧪 Teste Rápido

### Criar Artigo de Teste

1. Acesse `/dashboard`
2. Clique em "Novo Artigo"
3. Preencha:
   - **Título:** "Teste de Postagem"
   - **Slug:** "teste-de-postagem"
   - **Categoria:** "Dicas"
   - **Status:** "Publicado"
   - **Conteúdo:** "Este é um teste."
4. Salve
5. Acesse: `/artigo/teste-de-postagem`

---

## 📊 Debug Info na Tela

Quando o artigo não é encontrado, você verá:

```
Debug Info:
Article ID: [slug-procurado]
Total Articles: X
Published: Y
```

**O que significa:**
- **Article ID:** O slug que você está tentando acessar
- **Total Articles:** Quantos artigos existem no sistema
- **Published:** Quantos estão publicados

---

## 🔄 Checklist Completo

- [ ] Artigo existe no Firestore?
- [ ] Artigo está publicado (não rascunho)?
- [ ] Slug está correto na URL?
- [ ] Firebase está conectado?
- [ ] Regras do Firestore permitem leitura?
- [ ] Cache do navegador foi limpo?
- [ ] Console mostra erros?

---

## 💡 Dicas

### Verificar Artigos no Firestore

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Procure a coleção `articles`
5. Verifique se há documentos

### Verificar Slug do Artigo

No dashboard, ao editar um artigo, o slug aparece no campo "Slug (URL Amigável)".

### Testar com ID ao Invés de Slug

Se o slug não funcionar, tente usar o ID:
```
/artigo/[id-do-documento]
```

---

## 🚨 Erros Comuns

### 1. "Artigo não encontrado" mas existe

**Causa:** Slug diferente do esperado

**Solução:** Verifique o slug exato no console ou dashboard

### 2. Página em branco

**Causa:** Erro de JavaScript

**Solução:** Abra o console (F12) e veja o erro

### 3. Carregamento infinito

**Causa:** Artigos não carregam do Firestore

**Solução:** Verifique conexão e regras

---

## 📞 Ainda Não Funciona?

### Informações para Debug

Envie as seguintes informações:

1. **URL que você está tentando acessar**
2. **Console logs** (copie tudo)
3. **Screenshot** da tela de erro
4. **Quantos artigos** aparecem no dashboard
5. **Status** do artigo (publicado/rascunho)

---

## ✅ Solução Rápida

Se nada funcionar, tente:

```bash
# 1. Limpe o cache
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)

# 2. Recarregue os dados
Vá para /blog e volte para o artigo

# 3. Teste com outro navegador
Chrome, Firefox, Edge, etc.

# 4. Modo anônimo
Ctrl + Shift + N (Chrome)
Ctrl + Shift + P (Firefox)
```

---

## 🎉 Funcionou?

Ótimo! Agora você pode:
- ✅ Remover os console.logs de debug
- ✅ Remover o "Debug Info" da tela de erro
- ✅ Criar mais artigos

---

**Criado por:** Kiro AI Assistant  
**Data:** 04 de dezembro de 2024  
**Versão:** 1.0

