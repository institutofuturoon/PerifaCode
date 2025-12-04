# 📅 Eventos na Página Institucional

**Versão:** 1.0  
**Data:** 03/12/2024  
**Status:** ✅ Implementado

---

## 🎯 Objetivo

Exibir os eventos criados no painel admin na página institucional (Home) para que visitantes possam ver e se inscrever nos próximos eventos da FuturoOn.

---

## ✨ O que foi Implementado

### 1. 📍 Seção "Próximos Eventos" na Home

**Localização:** Logo após a seção de "Estatísticas Detalhadas"

**Características:**
- ✅ Grid responsivo (1-3 colunas)
- ✅ Mostra até 3 eventos em destaque
- ✅ Cards visuais com imagem, tipo, data e horário
- ✅ Informações do host (instrutor)
- ✅ Botão "Ver Detalhes" para cada evento
- ✅ Botão "Ver Todos os Eventos" se houver mais de 3
- ✅ Empty state quando não há eventos
- ✅ Badges coloridos por tipo de evento
- ✅ Efeitos hover e animações

**Tipos de Eventos com Cores:**
- 🔴 **Live** - Vermelho
- 🔵 **Workshop** - Azul
- 🟣 **Palestra** - Roxo

---

## 🎨 Design e UX

### Cards de Evento

**Estrutura:**
```
┌─────────────────────────────┐
│  [Imagem de Capa]           │
│  [Badge Tipo]  [Data/Hora]  │
├─────────────────────────────┤
│  Título do Evento           │
│  Descrição breve...         │
│                             │
│  👤 Nome do Host            │
│     Cargo                   │
├─────────────────────────────┤
│  [Botão Ver Detalhes →]    │
└─────────────────────────────┘
```

**Efeitos Visuais:**
- Hover: Elevação do card (-translate-y-2)
- Hover: Borda colorida (border-[#8a4add]/40)
- Hover: Sombra colorida (shadow-[#8a4add]/20)
- Hover: Zoom na imagem (scale-110)
- Hover: Cor do título muda para roxo

**Responsividade:**
- Mobile (< 768px): 1 coluna
- Tablet (768px - 1024px): 2 colunas
- Desktop (> 1024px): 3 colunas

---

## 🔗 Integração

### Dados do Firebase

A seção consome dados diretamente do Firebase através do contexto:

```typescript
const { events, team } = useAppContext();
```

**Campos utilizados:**
- `event.id` - ID único do evento
- `event.title` - Título
- `event.description` - Descrição
- `event.date` - Data
- `event.time` - Horário
- `event.eventType` - Tipo (Live/Workshop/Palestra)
- `event.imageUrl` - Imagem de capa
- `event.hostId` - ID do instrutor/host

### Navegação

**Rotas:**
- `/eventos` - Lista completa de eventos
- `/eventos/:eventId` - Detalhes do evento específico

**Botões:**
- "Ver Detalhes" → Navega para `/eventos/:eventId`
- "Ver Todos os Eventos" → Navega para `/eventos`

---

## 📱 Páginas Relacionadas

### 1. Home (`src/views/Home.tsx`)
- ✅ Seção de eventos adicionada
- ✅ Mostra 3 eventos em destaque
- ✅ Link para página completa

### 2. EventsView (`src/views/EventsView.tsx`)
- ✅ Lista completa de eventos
- ✅ Filtros por tipo e data
- ✅ Seção de mentorias
- ✅ Usa dados reais do Firebase

### 3. EventDetailView (`src/views/EventDetailView.tsx`)
- ✅ Detalhes completos do evento
- ✅ Informações do host
- ✅ Botão de compartilhamento
- ✅ Botão de inscrição
- ✅ SEO otimizado

---

## 🎨 Código da Seção

### Localização
**Arquivo:** `src/views/Home.tsx`  
**Linha:** Após a seção "Expanded Statistics Section"

### Estrutura

```tsx
{/* Próximos Eventos Section */}
<section className="py-16 md:py-24 relative z-10 overflow-hidden border-t border-white/5">
  {/* Background effects */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8a4add]/5 to-transparent"></div>
  
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    {/* Header */}
    <div className="text-center mb-12 md:mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30 mb-6">
        <span className="text-sm font-bold text-red-300">🔴 Ao Vivo</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
        Próximos Eventos
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
        Lives, workshops e palestras com especialistas da comunidade tech
      </p>
    </div>

    {/* Events Grid ou Empty State */}
    {events.length === 0 ? (
      <EmptyState />
    ) : (
      <EventsGrid events={events.slice(0, 3)} />
    )}
  </div>
</section>
```

---

## 🔄 Fluxo do Usuário

### Visitante na Home

```
1. Visitante acessa a Home
   ↓
2. Rola até a seção "Próximos Eventos"
   ↓
3. Vê 3 eventos em destaque
   ↓
4. Clica em "Ver Detalhes" de um evento
   ↓
5. É redirecionado para /eventos/:eventId
   ↓
6. Vê detalhes completos
   ↓
7. Clica em "Inscrever-se"
   ↓
8. É redirecionado para o link de inscrição
```

### Visitante Interessado em Mais Eventos

```
1. Visitante vê os 3 eventos na Home
   ↓
2. Clica em "Ver Todos os Eventos"
   ↓
3. É redirecionado para /eventos
   ↓
4. Vê lista completa com filtros
   ↓
5. Filtra por tipo (Live/Workshop/Palestra)
   ↓
6. Filtra por data (Próximos/Passados)
   ↓
7. Clica em um evento
   ↓
8. Vê detalhes e se inscreve
```

---

## 📊 Estatísticas na Home

A seção de estatísticas já mostra:
- ✅ **Eventos Realizados** - Contador de eventos passados
- ✅ Atualizado automaticamente

---

## 🎯 Empty State

Quando não há eventos cadastrados:

```
┌─────────────────────────────────┐
│                                 │
│            📅                   │
│                                 │
│  Nenhum evento agendado         │
│  no momento                     │
│                                 │
│  Fique ligado! Novos eventos    │
│  em breve.                      │
│                                 │
└─────────────────────────────────┘
```

---

## 🔧 Configuração

### Dependências Adicionadas

**No Home.tsx:**
```typescript
const { partners, team, events, loadData } = useAppContext();

useEffect(() => {
  loadData(['partners', 'users', 'events']);
}, [loadData]);
```

### Nenhuma Configuração Adicional Necessária

A seção funciona automaticamente assim que eventos são criados no painel admin!

---

## ✅ Checklist de Funcionalidades

### Visualização
- [x] Seção aparece na Home
- [x] Cards de eventos renderizam corretamente
- [x] Imagens carregam
- [x] Badges de tipo aparecem com cores corretas
- [x] Data e horário formatados
- [x] Informações do host aparecem
- [x] Empty state quando não há eventos

### Interação
- [x] Hover effects funcionam
- [x] Botão "Ver Detalhes" navega corretamente
- [x] Botão "Ver Todos" navega para /eventos
- [x] Responsivo em mobile/tablet/desktop

### Integração
- [x] Dados vêm do Firebase
- [x] Atualiza em tempo real
- [x] Mostra apenas 3 eventos
- [x] Link para página completa funciona

---

## 🎨 Customização

### Alterar Número de Eventos Exibidos

**Arquivo:** `src/views/Home.tsx`

```typescript
// Altere de 3 para o número desejado
{events.slice(0, 3).map((event) => {
  // ...
})}
```

### Alterar Cores dos Badges

```typescript
const eventTypeColors = {
  'Live': 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300',
  'Workshop': 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
  'Palestra': 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300'
};
```

### Alterar Ordem de Exibição

```typescript
// Ordenar por data (mais recentes primeiro)
const sortedEvents = [...events].sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);

// Usar eventos ordenados
{sortedEvents.slice(0, 3).map((event) => {
  // ...
})}
```

---

## 🐛 Troubleshooting

### Problema: Eventos não aparecem

**Causa:** Nenhum evento cadastrado no Firebase

**Solução:**
1. Faça login como Admin
2. Acesse Dashboard → Eventos
3. Crie pelo menos um evento
4. Recarregue a Home

---

### Problema: Imagens não carregam

**Causa:** URL da imagem inválida ou não acessível

**Solução:**
1. Verifique se a URL da imagem está correta
2. Teste a URL diretamente no navegador
3. Faça upload de nova imagem no editor de eventos

---

### Problema: Host não aparece

**Causa:** ID do host não corresponde a nenhum usuário

**Solução:**
1. Edite o evento
2. Selecione um host válido da lista
3. Salve o evento

---

## 📈 Métricas de Sucesso

### KPIs para Acompanhar

- **Taxa de Clique:** % de visitantes que clicam em "Ver Detalhes"
- **Taxa de Conversão:** % que se inscrevem após ver detalhes
- **Tempo na Página:** Tempo médio na seção de eventos
- **Eventos Mais Populares:** Quais eventos têm mais cliques

### Como Medir

Use Google Analytics ou ferramentas similares para rastrear:
- Cliques em botões de eventos
- Navegação para `/eventos/:eventId`
- Taxa de rejeição na página de eventos

---

## 🚀 Próximas Melhorias

### v2.0 (Planejado)

- [ ] Filtro de eventos na Home
- [ ] Carrossel de eventos (slider)
- [ ] Contador regressivo para próximo evento
- [ ] Badge "Vagas Limitadas"
- [ ] Badge "Inscrições Abertas"
- [ ] Integração com calendário (Google Calendar)
- [ ] Notificação de novos eventos
- [ ] Compartilhamento social direto
- [ ] Preview de vídeo do evento
- [ ] Lista de participantes confirmados

---

## 📚 Documentação Relacionada

- **`SISTEMA_EVENTOS.md`** - Documentação técnica completa
- **`GUIA_GERENCIAR_EVENTOS.md`** - Guia de uso do painel admin
- **`DOCUMENTACAO_API.md`** - API de upload de imagens

---

## 🎓 Como Testar

### Teste Completo

1. **Criar Evento:**
   - Login como Admin
   - Dashboard → Eventos → Criar Evento
   - Preencha todos os campos
   - Faça upload de imagem
   - Salve

2. **Verificar na Home:**
   - Acesse a página inicial
   - Role até "Próximos Eventos"
   - Verifique se o evento aparece
   - Teste o hover effect

3. **Testar Navegação:**
   - Clique em "Ver Detalhes"
   - Verifique se abre a página correta
   - Volte e clique em "Ver Todos"
   - Verifique se lista todos os eventos

4. **Testar Responsividade:**
   - Abra DevTools (F12)
   - Teste em mobile (375px)
   - Teste em tablet (768px)
   - Teste em desktop (1920px)

5. **Testar Empty State:**
   - Exclua todos os eventos
   - Recarregue a Home
   - Verifique se o empty state aparece

---

## ✅ Resumo

### O que funciona agora:

✅ **Seção de eventos na Home**
- Mostra 3 eventos em destaque
- Cards visuais com todas as informações
- Navegação para detalhes
- Link para página completa
- Empty state quando não há eventos

✅ **Integração completa**
- Dados do Firebase em tempo real
- Sincronizado com painel admin
- Atualização automática

✅ **Design responsivo**
- Funciona em todos os dispositivos
- Efeitos hover suaves
- Animações fluidas

✅ **Páginas relacionadas**
- EventsView com lista completa
- EventDetailView com detalhes
- Navegação entre páginas

---

**Última atualização:** 03/12/2024  
**Versão:** 1.0  
**Status:** ✅ Implementado e Testado
