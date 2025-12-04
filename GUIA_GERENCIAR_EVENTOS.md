# 📅 Guia: Gerenciar Eventos

**Versão:** 1.0  
**Data:** 03/12/2024  
**Status:** ✅ Funcional

---

## 🎯 Visão Geral

O sistema de gerenciamento de eventos permite criar, editar e excluir eventos (Lives, Workshops e Palestras) de forma visual e intuitiva.

---

## 🚀 Como Acessar

### Passo 1: Login como Admin
1. Acesse a plataforma
2. Faça login com uma conta de **Admin**
3. Clique em **"Dashboard"** no menu

### Passo 2: Acessar Painel de Eventos
1. No Dashboard, clique em **"Eventos"** na barra lateral
2. Você verá o painel de gerenciamento de eventos

**Rota direta:** `/admin` → Sidebar → "Eventos"

---

## ✨ Funcionalidades Disponíveis

### 1. 📊 Visualizar Eventos

**O que você vê:**
- Grid visual com cards de eventos
- Imagem de capa
- Tipo de evento (Live, Workshop, Palestra)
- Data e horário
- Descrição
- Informações do host (instrutor)

**Estatísticas:**
- Total de eventos
- Total de Lives
- Total de Workshops
- Total de Palestras

---

### 2. 🔍 Buscar e Filtrar

**Busca:**
- Digite no campo de busca para filtrar por título ou descrição
- Busca em tempo real

**Filtros por Tipo:**
- **Todos** - Mostra todos os eventos
- **Lives** - Apenas lives (badge vermelho)
- **Workshops** - Apenas workshops (badge azul)
- **Palestras** - Apenas palestras (badge roxo)

---

### 3. ➕ Criar Novo Evento

**Passo a Passo:**

1. **Clique em "Criar Evento"** (botão no topo direito)

2. **Preencha as Informações Básicas:**
   - **Título*** (obrigatório)
     - Ex: "Hackathon das Favelas 2024"
   - **Descrição*** (obrigatória)
     - Descreva o evento, o que será abordado, pré-requisitos
   
3. **Configure Data e Horário:**
   - **Data*** (obrigatória)
     - Ex: "DEZ 15" ou "15/12/2024"
   - **Horário*** (obrigatório)
     - Ex: "19:00"
   - **Localização** (opcional)
     - Ex: "Online - Zoom" ou "Complexo do Alemão"

4. **Selecione o Tipo:**
   - **Live** - Transmissão ao vivo
   - **Workshop** - Oficina prática
   - **Palestra** - Apresentação teórica

5. **Escolha o Anfitrião:**
   - Selecione um instrutor da lista
   - O anfitrião aparecerá no card do evento

6. **Adicione Links:**
   - **URL de Inscrição** (opcional)
     - Link para formulário de inscrição
   - **Link do Evento** (opcional)
     - Link da transmissão/reunião

7. **Faça Upload da Imagem:**
   - Clique em "Upload de Imagem"
   - Selecione uma imagem (máx: 4MB)
   - Tipos aceitos: JPEG, PNG, GIF, WebP
   - Aguarde o upload completar

8. **Salve o Evento:**
   - Clique em **"Salvar Evento"**
   - Aguarde a confirmação
   - Você será redirecionado para o painel

**Campos Obrigatórios (*):**
- Título
- Descrição
- Data
- Horário
- Anfitrião
- Imagem

---

### 4. ✏️ Editar Evento Existente

**Passo a Passo:**

1. **Localize o Evento:**
   - Use a busca ou filtros
   - Encontre o card do evento

2. **Clique em "Editar":**
   - Botão roxo no card do evento

3. **Modifique os Campos:**
   - Altere qualquer informação
   - Faça upload de nova imagem (se necessário)

4. **Salve as Alterações:**
   - Clique em **"Salvar Evento"**
   - Aguarde a confirmação

**Dica:** Use o botão **"Duplicar"** para criar um evento similar!

---

### 5. 🗑️ Excluir Evento

**Passo a Passo:**

1. **Localize o Evento:**
   - Use a busca ou filtros
   - Encontre o card do evento

2. **Clique em "Excluir":**
   - Botão vermelho no card do evento

3. **Confirme a Exclusão:**
   - Uma janela de confirmação aparecerá
   - Clique em **"OK"** para confirmar
   - Ou **"Cancelar"** para desistir

4. **Evento Removido:**
   - O evento será excluído permanentemente
   - Você verá uma mensagem de confirmação

**⚠️ ATENÇÃO:** A exclusão é permanente e não pode ser desfeita!

---

### 6. 📋 Duplicar Evento

**Quando usar:**
- Criar eventos similares rapidamente
- Reutilizar configurações de eventos anteriores
- Criar série de eventos

**Como fazer:**
1. Abra o evento para edição
2. Clique em **"Duplicar"**
3. O evento será copiado com "(Cópia)" no título
4. Edite as informações necessárias
5. Salve como novo evento

---

## 🎨 Tipos de Eventos

### 🔴 Live
- **Cor:** Vermelho
- **Uso:** Transmissões ao vivo
- **Exemplos:**
  - Lives de programação
  - Q&A ao vivo
  - Webinars

### 🔵 Workshop
- **Cor:** Azul
- **Uso:** Oficinas práticas
- **Exemplos:**
  - Workshop de React
  - Oficina de Design
  - Hands-on de Python

### 🟣 Palestra
- **Cor:** Roxo
- **Uso:** Apresentações teóricas
- **Exemplos:**
  - Palestra sobre carreira
  - Apresentação de cases
  - Talks motivacionais

---

## 💡 Dicas e Boas Práticas

### Títulos
✅ **Bom:** "Workshop: Introdução ao React - Nível Iniciante"  
❌ **Ruim:** "evento"

### Descrições
✅ **Bom:** Descrição detalhada com:
- O que será abordado
- Pré-requisitos
- O que o participante vai aprender
- Duração estimada

❌ **Ruim:** "Um evento legal"

### Imagens
✅ **Bom:**
- Alta qualidade (mínimo 800x600)
- Relacionada ao tema
- Boa iluminação e contraste
- Texto legível (se houver)

❌ **Ruim:**
- Imagens pixeladas
- Muito escuras
- Sem relação com o tema

### Datas
✅ **Bom:**
- "DEZ 15" (formato curto)
- "15/12/2024" (formato completo)
- "15 de Dezembro" (formato extenso)

❌ **Ruim:**
- "amanhã"
- "próxima semana"

### Horários
✅ **Bom:**
- "19:00"
- "19:00 - 21:00"
- "19h às 21h"

❌ **Ruim:**
- "à noite"
- "depois do almoço"

---

## 🔧 Troubleshooting

### Problema: Botão "Criar Evento" não aparece

**Causa:** Você não está logado como Admin

**Solução:**
1. Faça logout
2. Faça login com conta de Admin
3. Acesse o Dashboard novamente

---

### Problema: Erro ao salvar evento

**Possíveis causas:**
- Campos obrigatórios não preenchidos
- Imagem não foi carregada
- Problema de conexão

**Solução:**
1. Verifique se todos os campos obrigatórios (*) estão preenchidos
2. Aguarde o upload da imagem completar
3. Verifique sua conexão com a internet
4. Tente novamente

---

### Problema: Imagem não carrega

**Possíveis causas:**
- Arquivo muito grande (> 4MB)
- Formato não suportado
- Problema de conexão

**Solução:**
1. Comprima a imagem (use https://tinypng.com)
2. Converta para JPEG ou PNG
3. Verifique sua conexão
4. Tente fazer upload novamente

---

### Problema: Evento não aparece na lista

**Possíveis causas:**
- Filtro ativo
- Busca ativa
- Evento não foi salvo

**Solução:**
1. Limpe a busca
2. Selecione "Todos" nos filtros
3. Recarregue a página
4. Verifique se o evento foi realmente salvo

---

## 📊 Estatísticas

O painel mostra automaticamente:

- **Total de Eventos:** Soma de todos os eventos
- **Total de Lives:** Eventos do tipo "Live"
- **Total de Workshops:** Eventos do tipo "Workshop"
- **Total de Palestras:** Eventos do tipo "Palestra"

As estatísticas são atualizadas em tempo real ao criar/editar/excluir eventos.

---

## 🎯 Fluxo Completo

### Criar Evento do Zero

```
1. Login como Admin
   ↓
2. Dashboard → Eventos
   ↓
3. Clique "Criar Evento"
   ↓
4. Preencha informações básicas
   ↓
5. Configure data e horário
   ↓
6. Selecione tipo e anfitrião
   ↓
7. Adicione links (opcional)
   ↓
8. Faça upload da imagem
   ↓
9. Clique "Salvar Evento"
   ↓
10. ✅ Evento criado!
```

### Editar Evento Existente

```
1. Dashboard → Eventos
   ↓
2. Busque/filtre o evento
   ↓
3. Clique "Editar"
   ↓
4. Modifique os campos
   ↓
5. Clique "Salvar Evento"
   ↓
6. ✅ Evento atualizado!
```

### Excluir Evento

```
1. Dashboard → Eventos
   ↓
2. Busque/filtre o evento
   ↓
3. Clique "Excluir"
   ↓
4. Confirme a exclusão
   ↓
5. ✅ Evento removido!
```

---

## 🔐 Permissões

### Quem pode gerenciar eventos?

**✅ Admin:**
- Criar eventos
- Editar qualquer evento
- Excluir qualquer evento
- Ver todos os eventos

**❌ Instrutor:**
- Não tem acesso ao painel de gerenciamento
- Pode ser selecionado como anfitrião

**❌ Aluno:**
- Não tem acesso ao painel de gerenciamento
- Pode visualizar eventos na página pública

---

## 📱 Responsividade

O painel funciona em todos os dispositivos:

**Desktop (> 1024px):**
- Grid de 3 colunas
- Todos os filtros visíveis
- Sidebar expandida

**Tablet (768px - 1024px):**
- Grid de 2 colunas
- Filtros em linha
- Sidebar colapsável

**Mobile (< 768px):**
- Grid de 1 coluna
- Filtros empilhados
- Sidebar em menu hambúrguer

---

## 🎨 Personalização

### Cores por Tipo de Evento

**Live (Vermelho):**
- Background: `bg-red-500/10`
- Border: `border-red-500/20`
- Text: `text-red-400`

**Workshop (Azul):**
- Background: `bg-blue-500/10`
- Border: `border-blue-500/20`
- Text: `text-blue-400`

**Palestra (Roxo):**
- Background: `bg-purple-500/10`
- Border: `border-purple-500/20`
- Text: `text-purple-400`

---

## 📝 Checklist de Criação

Antes de salvar um evento, verifique:

- [ ] Título claro e descritivo
- [ ] Descrição completa e informativa
- [ ] Data no formato correto
- [ ] Horário definido
- [ ] Tipo de evento selecionado
- [ ] Anfitrião escolhido
- [ ] Imagem de qualidade carregada
- [ ] Links adicionados (se aplicável)
- [ ] Localização definida (se aplicável)
- [ ] Revisão de ortografia

---

## 🚀 Próximas Melhorias

### Planejado para v2.0:

- [ ] Calendário visual
- [ ] Notificações automáticas
- [ ] Inscrições integradas
- [ ] Limite de vagas
- [ ] Lista de participantes
- [ ] Certificados automáticos
- [ ] Gravação de eventos
- [ ] Chat ao vivo
- [ ] Enquetes durante evento
- [ ] Relatórios de participação

---

## 📞 Suporte

**Problemas?**
1. Consulte a seção de Troubleshooting
2. Verifique os logs do console (F12)
3. Recarregue a página
4. Limpe o cache do navegador

**Dúvidas?**
- Consulte `SISTEMA_EVENTOS.md` para detalhes técnicos
- Veja `DOCUMENTACAO_API.md` para informações de API

---

## ✅ Resumo Rápido

**Para criar um evento:**
1. Dashboard → Eventos → Criar Evento
2. Preencha os campos obrigatórios (*)
3. Faça upload da imagem
4. Salvar Evento

**Para editar:**
1. Encontre o evento
2. Clique em "Editar"
3. Modifique e salve

**Para excluir:**
1. Encontre o evento
2. Clique em "Excluir"
3. Confirme

---

**Última atualização:** 03/12/2024  
**Versão:** 1.0  
**Status:** ✅ Funcional e testado
