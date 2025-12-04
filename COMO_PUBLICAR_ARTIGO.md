# 📝 Como Publicar um Artigo

## 🎯 Problema

Você criou um artigo como admin, mas ele só aparece para você e não para todos os visitantes do site.

---

## ✅ Solução Rápida

### Passo a Passo:

1. **Faça login como Admin**
   - Acesse `/entrar`
   - Use suas credenciais de administrador

2. **Acesse o Dashboard**
   - Vá para `/dashboard`
   - Ou clique no seu avatar → "Dashboard"

3. **Vá para Gerenciar Blog**
   - No menu lateral, clique em "📝 Blog"
   - Ou na aba "Gerenciar Blog"

4. **Encontre seu Artigo**
   - Você verá uma lista de todos os artigos
   - Procure pelo artigo que deseja publicar
   - Status atual: 🟡 **Rascunho**

5. **Clique em "Publicar"**
   - Na coluna "Ações", clique no botão verde **"Publicar"**
   - O status mudará para 🟢 **Publicado**
   - Você verá uma mensagem: "✅ Artigo publicado!"

6. **Verifique no Site**
   - Acesse `/blog`
   - Seu artigo agora aparece para todos!
   - Ou acesse diretamente: `/artigo/[slug-do-artigo]`

---

## 🔄 Status dos Artigos

### 📝 Rascunho (Draft)
- ❌ **NÃO aparece** no blog público
- ✅ **Aparece** apenas no dashboard para admin/autor
- 🎯 **Uso:** Artigos em desenvolvimento

### 🟢 Publicado (Published)
- ✅ **Aparece** no blog público para todos
- ✅ **Aparece** no dashboard
- ✅ **Indexado** por mecanismos de busca
- 🎯 **Uso:** Artigos prontos para o público

---

## 🎨 Interface do Dashboard

### Tabela de Artigos

```
┌─────────────────────────────────────────────────────────────┐
│ Título          │ Autor  │ Categoria │ Status    │ Ações   │
├─────────────────────────────────────────────────────────────┤
│ Meu Artigo      │ Admin  │ Notícias  │ 🟡 Rascunho │ Publicar │
│ [imagem] [data] │        │           │           │ Editar   │
│                 │        │           │           │ Excluir  │
└─────────────────────────────────────────────────────────────┘
```

### Botões de Ação

- **🟢 Publicar** - Torna o artigo visível para todos
- **✏️ Editar** - Abre o editor de artigos
- **🗑️ Excluir** - Remove o artigo permanentemente
- **🟡 Despublicar** - Move artigo publicado de volta para rascunho

---

## 💡 Dicas

### 1. Antes de Publicar

Verifique se o artigo tem:
- ✅ Título atrativo
- ✅ Subtítulo descritivo
- ✅ Imagem de capa
- ✅ Conteúdo completo
- ✅ Categoria correta
- ✅ Tags relevantes
- ✅ Slug amigável

### 2. Depois de Publicar

- 📱 Compartilhe nas redes sociais
- 🔗 Envie o link para a equipe
- 📊 Acompanhe as visualizações
- 💬 Responda aos comentários

### 3. Para Despublicar

Se precisar remover temporariamente:
1. Clique em **"Despublicar"**
2. O artigo volta para rascunho
3. Faça as edições necessárias
4. Publique novamente quando pronto

---

## 🔍 Verificação

### Como saber se está publicado?

1. **No Dashboard:**
   - Status: 🟢 **Publicado**
   - Botão: "Despublicar" (amarelo)

2. **No Blog Público:**
   - Acesse `/blog` (sem estar logado)
   - O artigo aparece na lista
   - Ou acesse a URL direta

3. **No Console (Debug):**
   ```
   📚 Total de artigos: X
   Published: Y (deve incluir seu artigo)
   ```

---

## ❓ FAQ

### P: Publiquei mas não aparece no blog
**R:** Aguarde alguns segundos e recarregue a página (Ctrl + Shift + R)

### P: Posso editar um artigo publicado?
**R:** Sim! Clique em "Editar", faça as mudanças e salve. As alterações são imediatas.

### P: Como despublicar temporariamente?
**R:** Clique em "Despublicar". O artigo volta para rascunho.

### P: Posso agendar publicação?
**R:** Atualmente não, mas você pode criar como rascunho e publicar quando quiser.

### P: Quem pode publicar artigos?
**R:** Admins podem publicar qualquer artigo. Instrutores podem publicar apenas seus próprios artigos.

---

## 🎯 Atalhos Rápidos

### Publicar Artigo Existente
```
Dashboard → Blog → Encontrar Artigo → Publicar
```

### Criar e Publicar Novo Artigo
```
Dashboard → Blog → Novo Artigo → Preencher → Salvar → Publicar
```

### Verificar Artigo Publicado
```
/blog → Procurar na lista → Clicar para ler
```

---

## 🚀 Exemplo Prático

### Cenário: Publicar artigo sobre Hostinger

1. **Login:** Entre como admin
2. **Dashboard:** Acesse `/dashboard`
3. **Blog:** Clique em "📝 Blog"
4. **Encontre:** Procure "Hostinger" na busca
5. **Status:** Veja que está como "Rascunho"
6. **Publique:** Clique no botão verde "Publicar"
7. **Confirme:** Veja a mensagem "✅ Artigo publicado!"
8. **Verifique:** Acesse `/blog` e veja o artigo na lista
9. **Compartilhe:** Copie o link e compartilhe!

---

## ✅ Checklist de Publicação

Antes de publicar, verifique:

- [ ] Artigo está completo
- [ ] Título está correto
- [ ] Imagem de capa está bonita
- [ ] Conteúdo está formatado
- [ ] Links funcionam
- [ ] Ortografia está correta
- [ ] Categoria está certa
- [ ] Tags estão relevantes
- [ ] Slug está amigável
- [ ] Preview está bom

Depois de publicar:

- [ ] Artigo aparece em `/blog`
- [ ] URL direta funciona
- [ ] Imagem carrega
- [ ] Formatação está correta
- [ ] Links funcionam
- [ ] Responsivo em mobile
- [ ] Compartilhado nas redes

---

## 🎉 Pronto!

Agora você sabe como publicar artigos e torná-los visíveis para todos os visitantes do site!

**Lembre-se:** Rascunho = Privado | Publicado = Público

---

**Criado por:** Kiro AI Assistant  
**Data:** 04 de dezembro de 2024  
**Versão:** 1.0

