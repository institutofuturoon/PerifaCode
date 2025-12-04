# 🧪 Guia de Testes Completo - FuturoOn

**Data:** 03/12/2024  
**Versão:** 1.0.0  
**Objetivo:** Validar todos os fluxos implementados na sessão atual

---

## 📋 Checklist Geral

- [ ] Todos os testes de Pré-requisitos
- [ ] Todos os testes do Editor de Cursos
- [ ] Todos os testes de Notificações
- [ ] Testes de Integração
- [ ] Testes de Performance
- [ ] Testes de Responsividade

---

## 🔒 Testes: Sistema de Pré-requisitos

### Teste 1: Bloqueio Básico de Aulas
**Objetivo:** Verificar se aulas com pré-requisitos são bloqueadas corretamente

**Passos:**
1. Faça login como aluno
2. Acesse um curso com pré-requisitos configurados
3. Tente acessar uma aula bloqueada

**Resultado Esperado:**
- ✅ Aula aparece com ícone de cadeado 🔒
- ✅ Botão está desabilitado
- ✅ Tooltip mostra "Complete as aulas anteriores"
- ✅ Acesso direto via URL redireciona para tela de bloqueio

**Status:** [ ]

---

### Teste 2: Progresso de Pré-requisitos
**Objetivo:** Verificar indicador visual de progresso

**Passos:**
1. Acesse uma aula com 3 pré-requisitos
2. Complete 2 dos 3 pré-requisitos
3. Observe o indicador

**Resultado Esperado:**
- ✅ Badge mostra "2/3"
- ✅ Tooltip mostra "Pré-requisitos: 2/3 completos"
- ✅ Aula ainda está bloqueada
- ✅ Após completar o 3º, aula desbloqueia

**Status:** [ ]

---

### Teste 3: Desbloqueio Manual (Admin)
**Objetivo:** Verificar funcionalidade de desbloqueio por admin

**Passos:**
1. Faça login como admin
2. Acesse Painel Admin → Alunos
3. Clique em "🔓 Acesso" em um aluno
4. Selecione um curso
5. Clique em "🔒 Desbloquear" em uma aula bloqueada
6. Faça login como o aluno
7. Verifique se a aula está acessível

**Resultado Esperado:**
- ✅ Modal abre corretamente
- ✅ Lista de cursos carrega
- ✅ Lista de aulas mostra status correto
- ✅ Botão muda para "🔓 Bloquear" após desbloquear
- ✅ Ícone 🔓 aparece na aula
- ✅ Aluno consegue acessar a aula
- ✅ Persistência no Firestore

**Status:** [ ]

---

### Teste 4: Navegação Entre Aulas
**Objetivo:** Verificar se navegação respeita bloqueios

**Passos:**
1. Complete uma aula
2. Clique em "Próxima →"
3. Tente navegar para aula bloqueada

**Resultado Esperado:**
- ✅ Navegação para próxima aula disponível funciona
- ✅ Não é possível navegar para aula bloqueada
- ✅ Botões de navegação refletem estado correto

**Status:** [ ]

---

## 🎨 Testes: Editor de Cursos

### Teste 5: Preview de Aula
**Objetivo:** Verificar preview em tempo real

**Passos:**
1. Faça login como instrutor/admin
2. Acesse Editor de Curso
3. Vá para aba "Currículo & Aulas"
4. Passe o mouse sobre uma aula
5. Clique em "👁️ Preview"

**Resultado Esperado:**
- ✅ Modal abre com conteúdo renderizado
- ✅ Markdown é renderizado corretamente
- ✅ Vídeo (se houver) é incorporado
- ✅ Todas as seções aparecem (objetivo, conteúdo, material, resumo)
- ✅ Botão "Fechar" funciona

**Status:** [ ]

---

### Teste 6: Reordenar Módulos e Aulas
**Objetivo:** Verificar funcionalidade de reordenação

**Passos:**
1. No editor de curso, clique em ▲ em um módulo
2. Clique em ▼ em outro módulo
3. Clique em ▲ em uma aula
4. Clique em ▼ em outra aula
5. Salve o curso
6. Recarregue a página

**Resultado Esperado:**
- ✅ Módulos mudam de posição
- ✅ Aulas mudam de posição dentro do módulo
- ✅ Primeira/última não ultrapassam limites
- ✅ Ordem persiste após salvar

**Status:** [ ]

---

### Teste 7: Duplicar Módulo
**Objetivo:** Verificar duplicação de módulos

**Passos:**
1. Clique no ícone 📋 no cabeçalho de um módulo
2. Observe o novo módulo criado

**Resultado Esperado:**
- ✅ Novo módulo aparece logo abaixo do original
- ✅ Título tem sufixo "(Cópia)"
- ✅ Todas as aulas são duplicadas
- ✅ Novos IDs são gerados
- ✅ Toast de confirmação aparece

**Status:** [ ]

---

### Teste 8: Duplicar Aula
**Objetivo:** Verificar duplicação de aulas

**Passos:**
1. Passe o mouse sobre uma aula
2. Clique no botão 📋
3. Observe a nova aula criada

**Resultado Esperado:**
- ✅ Nova aula aparece logo abaixo da original
- ✅ Título tem sufixo "(Cópia)"
- ✅ Conteúdo é copiado
- ✅ Novo ID é gerado
- ✅ Toast de confirmação aparece

**Status:** [ ]

---

### Teste 9: Templates de Aulas
**Objetivo:** Verificar criação de aulas com templates

**Passos:**
1. Clique em "✨ Usar Template"
2. Selecione "📹 Aula em Vídeo"
3. Clique em "Usar Template"
4. Edite a aula criada

**Resultado Esperado:**
- ✅ Modal de templates abre
- ✅ 8 templates são exibidos
- ✅ Seleção visual funciona
- ✅ Aula é criada com conteúdo pré-preenchido
- ✅ Estrutura Markdown está correta

**Status:** [ ]

---

### Teste 10: Exportar Curso
**Objetivo:** Verificar exportação para JSON

**Passos:**
1. Clique em "📥 Exportar JSON"
2. Verifique o arquivo baixado
3. Abra o JSON em um editor

**Resultado Esperado:**
- ✅ Arquivo é baixado automaticamente
- ✅ Nome do arquivo: `{slug}_export.json`
- ✅ JSON é válido
- ✅ Estrutura completa está presente
- ✅ Todos os módulos e aulas incluídos

**Status:** [ ]

---

### Teste 11: Importar Curso
**Objetivo:** Verificar importação de JSON

**Passos:**
1. Clique em "📤 Importar JSON"
2. Selecione o arquivo exportado no teste anterior
3. Observe o curso carregado

**Resultado Esperado:**
- ✅ Arquivo é lido corretamente
- ✅ Curso é carregado no editor
- ✅ Novos IDs são gerados
- ✅ Slug recebe sufixo "-imported"
- ✅ Toast de sucesso aparece
- ✅ Estrutura está intacta

**Status:** [ ]

---

## 🔔 Testes: Sistema de Notificações

### Teste 12: Badge de Notificações
**Objetivo:** Verificar badge no header

**Passos:**
1. Faça login como aluno
2. Observe o ícone de sino no header
3. Verifique o contador

**Resultado Esperado:**
- ✅ Ícone de sino 🔔 aparece
- ✅ Badge com número aparece se houver não lidas
- ✅ Badge tem animação de pulso
- ✅ Número correto de não lidas

**Status:** [ ]

---

### Teste 13: Dropdown de Notificações
**Objetivo:** Verificar lista de notificações

**Passos:**
1. Clique no ícone de sino
2. Observe o dropdown
3. Scroll pela lista

**Resultado Esperado:**
- ✅ Dropdown abre corretamente
- ✅ Notificações são listadas (mais recentes primeiro)
- ✅ Indicador roxo em não lidas
- ✅ Ícones coloridos por tipo
- ✅ Tempo relativo formatado ("2h atrás")
- ✅ Scroll funciona

**Status:** [ ]

---

### Teste 14: Marcar Como Lida
**Objetivo:** Verificar marcação individual

**Passos:**
1. Clique em uma notificação não lida
2. Observe as mudanças

**Resultado Esperado:**
- ✅ Indicador roxo desaparece
- ✅ Contador decrementa
- ✅ Navegação para URL correta
- ✅ Dropdown fecha
- ✅ Firestore atualizado

**Status:** [ ]

---

### Teste 15: Marcar Todas Como Lidas
**Objetivo:** Verificar marcação em massa

**Passos:**
1. Clique em "Marcar todas como lidas"
2. Observe as mudanças

**Resultado Esperado:**
- ✅ Todas as notificações perdem indicador
- ✅ Badge desaparece
- ✅ Toast de confirmação
- ✅ Firestore atualizado (batch)

**Status:** [ ]

---

### Teste 16: Excluir Notificação
**Objetivo:** Verificar exclusão individual

**Passos:**
1. Passe o mouse sobre uma notificação
2. Clique no ícone de X
3. Observe as mudanças

**Resultado Esperado:**
- ✅ Notificação desaparece
- ✅ Contador atualiza
- ✅ Firestore atualizado

**Status:** [ ]

---

### Teste 17: Notificação Automática - Novo Curso
**Objetivo:** Verificar criação automática

**Passos:**
1. Faça login como admin
2. Crie um novo curso
3. Defina status como "Abertas"
4. Salve o curso
5. Faça login como aluno
6. Verifique notificações

**Resultado Esperado:**
- ✅ Notificação é criada automaticamente
- ✅ Tipo: "course"
- ✅ Título: "Novo Curso Disponível! 🎉"
- ✅ Link para o curso funciona
- ✅ Todos os alunos recebem (com preferência ativada)

**Status:** [ ]

---

### Teste 18: Notificação Automática - Novo Evento
**Objetivo:** Verificar criação automática

**Passos:**
1. Faça login como admin
2. Crie um novo evento
3. Salve o evento
4. Faça login como aluno
5. Verifique notificações

**Resultado Esperado:**
- ✅ Notificação é criada automaticamente
- ✅ Tipo: "event"
- ✅ Título: "Novo Evento! 📅"
- ✅ Mensagem com data e hora
- ✅ Link para o evento funciona

**Status:** [ ]

---

## 🔗 Testes de Integração

### Teste 19: Fluxo Completo do Aluno
**Objetivo:** Validar jornada completa

**Passos:**
1. Cadastre-se como novo aluno
2. Complete o onboarding
3. Navegue para catálogo de cursos
4. Inscreva-se em um curso
5. Acesse primeira aula
6. Complete a aula
7. Tente acessar aula bloqueada
8. Complete pré-requisitos
9. Acesse aula desbloqueada
10. Verifique notificações

**Resultado Esperado:**
- ✅ Cadastro funciona
- ✅ Onboarding completa
- ✅ Cursos são listados
- ✅ Inscrição funciona
- ✅ Aula carrega corretamente
- ✅ Progresso é salvo
- ✅ Bloqueio funciona
- ✅ Desbloqueio após completar funciona
- ✅ Notificações aparecem

**Status:** [ ]

---

### Teste 20: Fluxo Completo do Instrutor
**Objetivo:** Validar criação de curso

**Passos:**
1. Faça login como instrutor
2. Crie novo curso
3. Adicione módulos
4. Adicione aulas usando templates
5. Configure pré-requisitos
6. Use preview para revisar
7. Exporte o curso
8. Importe em outro curso
9. Publique o curso

**Resultado Esperado:**
- ✅ Curso é criado
- ✅ Módulos são adicionados
- ✅ Templates funcionam
- ✅ Pré-requisitos são salvos
- ✅ Preview mostra conteúdo correto
- ✅ Exportação funciona
- ✅ Importação funciona
- ✅ Publicação notifica alunos

**Status:** [ ]

---

### Teste 21: Fluxo Completo do Admin
**Objetivo:** Validar gestão completa

**Passos:**
1. Faça login como admin
2. Acesse painel de alunos
3. Desbloqueie aula para um aluno
4. Crie notificação manual
5. Gerencie cursos
6. Gerencie eventos
7. Visualize analytics

**Resultado Esperado:**
- ✅ Painel carrega
- ✅ Desbloqueio funciona
- ✅ Notificação é criada
- ✅ Gestão de cursos funciona
- ✅ Gestão de eventos funciona
- ✅ Analytics são exibidos

**Status:** [ ]

---

## ⚡ Testes de Performance

### Teste 22: Tempo de Carregamento
**Objetivo:** Verificar performance

**Métricas:**
- [ ] Página inicial: < 2s
- [ ] Dashboard: < 3s
- [ ] Aula: < 2s
- [ ] Editor de curso: < 3s
- [ ] Notificações: < 100ms

**Status:** [ ]

---

### Teste 23: Queries Firestore
**Objetivo:** Otimização de banco

**Verificar:**
- [ ] Lazy loading funciona
- [ ] Dados são cacheados
- [ ] Batch operations são usadas
- [ ] Queries são indexadas

**Status:** [ ]

---

## 📱 Testes de Responsividade

### Teste 24: Mobile (375px)
**Objetivo:** Validar em mobile

**Verificar:**
- [ ] Header responsivo
- [ ] Sidebar colapsável
- [ ] Notificações funcionam
- [ ] Editor é usável
- [ ] Aulas são legíveis

**Status:** [ ]

---

### Teste 25: Tablet (768px)
**Objetivo:** Validar em tablet

**Verificar:**
- [ ] Layout se adapta
- [ ] Todos os recursos acessíveis
- [ ] Touch funciona

**Status:** [ ]

---

### Teste 26: Desktop (1920px)
**Objetivo:** Validar em desktop

**Verificar:**
- [ ] Layout otimizado
- [ ] Espaço bem utilizado
- [ ] Hover states funcionam

**Status:** [ ]

---

## 🌐 Testes de Navegadores

### Teste 27: Chrome
- [ ] Todas as funcionalidades
- [ ] Performance adequada
- [ ] Sem erros no console

**Status:** [ ]

---

### Teste 28: Firefox
- [ ] Todas as funcionalidades
- [ ] Performance adequada
- [ ] Sem erros no console

**Status:** [ ]

---

### Teste 29: Safari
- [ ] Todas as funcionalidades
- [ ] Performance adequada
- [ ] Sem erros no console

**Status:** [ ]

---

### Teste 30: Edge
- [ ] Todas as funcionalidades
- [ ] Performance adequada
- [ ] Sem erros no console

**Status:** [ ]

---

## 🐛 Testes de Casos Extremos

### Teste 31: Dados Vazios
**Cenários:**
- [ ] Curso sem módulos
- [ ] Módulo sem aulas
- [ ] Aula sem conteúdo
- [ ] Sem notificações
- [ ] Sem cursos

**Status:** [ ]

---

### Teste 32: Dados Grandes
**Cenários:**
- [ ] Curso com 50+ aulas
- [ ] Aula com 10.000+ palavras
- [ ] 100+ notificações
- [ ] Título muito longo

**Status:** [ ]

---

### Teste 33: Conexão Lenta
**Cenários:**
- [ ] Throttle 3G
- [ ] Loading states aparecem
- [ ] Timeout handling
- [ ] Retry funciona

**Status:** [ ]

---

### Teste 34: Offline
**Cenários:**
- [ ] Mensagem de erro clara
- [ ] Dados em cache acessíveis
- [ ] Reconexão automática

**Status:** [ ]

---

## ✅ Critérios de Aceitação

### Funcionalidade
- [ ] 100% dos testes funcionais passam
- [ ] Sem erros críticos no console
- [ ] Todas as rotas funcionam

### Performance
- [ ] Lighthouse Score > 80
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s

### UX
- [ ] Feedback visual em todas as ações
- [ ] Loading states em operações assíncronas
- [ ] Mensagens de erro claras

### Acessibilidade
- [ ] Navegação por teclado funciona
- [ ] Contraste adequado (WCAG AA)
- [ ] Alt text em imagens

---

## 📊 Resumo de Testes

**Total de Testes:** 34  
**Testes Passados:** [ ] / 34  
**Testes Falhados:** [ ] / 34  
**Taxa de Sucesso:** [ ]%

---

## 🚨 Bugs Encontrados

### Bug #1
**Descrição:**  
**Severidade:** [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo  
**Passos para Reproduzir:**  
**Resultado Esperado:**  
**Resultado Atual:**  
**Status:** [ ] Aberto [ ] Em Progresso [ ] Resolvido

---

## 📝 Notas Adicionais

**Observações:**
- 
- 
- 

**Melhorias Sugeridas:**
- 
- 
- 

---

**Testado por:** _____________  
**Data:** ___/___/______  
**Ambiente:** [ ] Desenvolvimento [ ] Staging [ ] Produção

---

**Status Final:** [ ] ✅ Aprovado [ ] ⚠️ Aprovado com Ressalvas [ ] ❌ Reprovado
