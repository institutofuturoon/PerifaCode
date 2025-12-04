# 🚀 Como Publicar o Artigo da Hostinger no Firestore

## ❌ Problema Identificado

O artigo da Hostinger **não aparece quando você não está logado** porque:

1. O artigo não existe no Firestore (banco de dados)
2. Ou está com status diferente de `published`

As regras do Firestore só permitem que usuários não autenticados vejam artigos com `status: 'published'`.

---

## ✅ Solução: Publicar o Artigo

### Opção 1: Usar o Editor de Artigos (Recomendado)

1. **Faça login como admin** na plataforma
2. Acesse `/editor-artigos`
3. Clique em **"Novo Artigo"**
4. Preencha os dados do artigo:

```json
{
  "title": "Hostinger Start: Impulsionando Seu Sonho de Negócio Online",
  "slug": "hostinger-start-impulsionando-seu-sonho-de-negocio-online",
  "author": "Equipe FuturoOn",
  "date": "04/12/2024",
  "category": "Conquistas",
  "tags": ["Hostinger", "Prêmio", "Parceria", "Impacto Social", "Empreendedorismo"],
  "summary": "Celebramos nossa vitória no Prêmio Hostinger Start 2025! Descubra como essa parceria está transformando sonhos em realidade e impulsionando jovens empreendedores da periferia.",
  "imageUrl": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070",
  "status": "published"
}
```

5. **Cole o conteúdo completo** do arquivo `POSTAGEM_VITORIA_EDITAL_HOSTINGER.md`
6. Clique em **"Publicar"**

---

### Opção 2: Usar o Console do Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Clique em **"Iniciar coleção"** (se não existir) ou abra a coleção `articles`
5. Clique em **"Adicionar documento"**
6. Use o ID: `hostinger-start-2024`
7. Adicione os campos:

```
title: "Hostinger Start: Impulsionando Seu Sonho de Negócio Online"
slug: "hostinger-start-impulsionando-seu-sonho-de-negocio-online"
author: "Equipe FuturoOn"
authorAvatarUrl: "https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg"
date: "04/12/2024"
category: "Conquistas"
tags: ["Hostinger", "Prêmio", "Parceria", "Impacto Social", "Empreendedorismo"]
summary: "Celebramos nossa vitória no Prêmio Hostinger Start 2025! Descubra como essa parceria está transformando sonhos em realidade e impulsionando jovens empreendedores da periferia."
imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
content: [COLE O CONTEÚDO DO MARKDOWN AQUI]
status: "published"
claps: 0
```

8. Clique em **"Salvar"**

---

### Opção 3: Script de Importação (Avançado)

Se você tem muitos artigos para importar, posso criar um script Node.js que lê os arquivos markdown e publica automaticamente no Firestore.

---

## 🧪 Como Testar

Após publicar o artigo:

1. **Faça logout** da plataforma (ou abra em aba anônima)
2. Acesse a Home: `http://localhost:5173`
3. Clique no banner da Hostinger
4. Ou acesse diretamente: `http://localhost:5173/artigo/hostinger-start-impulsionando-seu-sonho-de-negocio-online`

**Resultado esperado:** O artigo deve aparecer normalmente! ✅

---

## 📋 Checklist de Publicação

- [ ] Artigo criado no Firestore
- [ ] Campo `status` definido como `"published"`
- [ ] Campo `slug` correto: `hostinger-start-impulsionando-seu-sonho-de-negocio-online`
- [ ] Conteúdo completo adicionado
- [ ] Testado sem estar logado
- [ ] Banner da Home funciona
- [ ] Link da página de parceiro funciona

---

## 🔍 Troubleshooting

### Artigo ainda não aparece?

1. **Verifique o console do navegador (F12)**
   - Procure por erros de carregamento
   - Verifique se o artigo está sendo buscado

2. **Verifique o Firestore**
   - Confirme que o documento existe
   - Confirme que `status: "published"`
   - Confirme que o `slug` está correto

3. **Limpe o cache**
   - Pressione `Ctrl + Shift + R` (Windows/Linux)
   - Ou `Cmd + Shift + R` (Mac)

4. **Verifique as regras do Firestore**
   - As regras devem permitir leitura pública de artigos publicados
   - Linha 139 do `firestore.rules`: `allow read: if resource.data.status == 'published' || isAdmin();`

---

## 💡 Dica Pro

Para facilitar a publicação de artigos no futuro, você pode:

1. Criar um **template de artigo** no editor
2. Usar o **BlogAIStudio** para gerar conteúdo
3. Manter os artigos em markdown e usar um script de importação

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Problema:** Artigo não aparece quando não está logado  
**Solução:** Publicar no Firestore com status "published"
