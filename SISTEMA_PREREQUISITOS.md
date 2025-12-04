# 🔒 Sistema de Pré-requisitos - Guia Completo

**Status:** ✅ Implementado  
**Data:** 03/12/2024

---

## 📋 Visão Geral

O sistema de pré-requisitos permite controlar a progressão dos alunos através do curso, garantindo que eles completem aulas fundamentais antes de avançar para conteúdos mais complexos.

---

## 🎯 Funcionalidades Implementadas

### 1. **Bloqueio de Aulas**
- Aulas podem ter pré-requisitos (IDs de outras aulas)
- Alunos só podem acessar aulas após completar os pré-requisitos
- Tentativa de acesso direto via URL é bloqueada

### 2. **Indicadores Visuais**
- **Ícone de cadeado** 🔒 para aulas bloqueadas
- **Opacidade reduzida** para indicar indisponibilidade
- **Tooltip explicativo** ao passar o mouse
- **Cursor "not-allowed"** para feedback visual

### 3. **Proteção de Navegação**
- Botões de aulas bloqueadas são desabilitados
- Acesso direto via URL redireciona para tela de bloqueio
- Mensagem clara explicando o motivo do bloqueio

---

## 💻 Como Usar (Para Administradores)

### Configurando Pré-requisitos no Editor de Cursos

Ao criar ou editar uma aula, adicione o campo `prerequisites`:

```typescript
{
  id: "aula-03",
  title: "Funções Avançadas em JavaScript",
  duration: "45 min",
  type: "video",
  xp: 150,
  prerequisites: ["aula-01", "aula-02"], // IDs das aulas anteriores
  // ... outros campos
}
```

### Exemplo Prático: Curso de JavaScript

```typescript
const moduloBasico = {
  id: "mod-01",
  title: "Fundamentos",
  lessons: [
    {
      id: "js-01",
      title: "Introdução ao JavaScript",
      prerequisites: [], // Primeira aula, sem pré-requisitos
      // ...
    },
    {
      id: "js-02",
      title: "Variáveis e Tipos de Dados",
      prerequisites: ["js-01"], // Requer aula anterior
      // ...
    },
    {
      id: "js-03",
      title: "Operadores e Expressões",
      prerequisites: ["js-01", "js-02"], // Requer duas aulas
      // ...
    }
  ]
};
```

---

## 🔍 Lógica de Bloqueio

### Função Principal

```typescript
const isLessonLocked = (lesson: Lesson, completedLessonIds: string[]): boolean => {
  // Se não tem pré-requisitos, está desbloqueada
  if (!lesson.prerequisites || lesson.prerequisites.length === 0) return false;
  
  // Verifica se TODOS os pré-requisitos foram completados
  return !lesson.prerequisites.every(prereqId => completedLessonIds.includes(prereqId));
};
```

### Regras de Negócio

1. **Sem pré-requisitos** → Aula sempre disponível
2. **Com pré-requisitos** → Todos devem estar completos
3. **Múltiplos pré-requisitos** → Lógica AND (todos obrigatórios)

---

## 🎨 Estados Visuais

### Sidebar (Menu Lateral)

| Estado | Ícone | Cor | Interação |
|--------|-------|-----|-----------|
| **Bloqueada** | 🔒 | Cinza escuro | Desabilitada + Tooltip |
| **Ativa** | ⚪ (pulsante) | Roxo | Navegável |
| **Completa** | ✓ | Verde | Navegável |
| **Disponível** | ⚪ | Branco/10 | Navegável |

### Lista de Aulas (CourseDetail)

| Estado | Ícone | Opacidade | Cursor |
|--------|-------|-----------|--------|
| **Bloqueada** | 🔒 | 50% | not-allowed |
| **Completa** | ✓ | 100% | pointer |
| **Disponível** | 📹/📄 | 100% | pointer |

---

## 🚨 Tela de Bloqueio

Quando um aluno tenta acessar uma aula bloqueada diretamente pela URL:

```
┌─────────────────────────────────────┐
│           🔒                        │
│                                     │
│      Aula Bloqueada                 │
│                                     │
│  Você precisa completar as aulas    │
│  anteriores antes de acessar        │
│  esta aula.                         │
│                                     │
│    [Voltar ao Curso]                │
└─────────────────────────────────────┘
```

---

## 📊 Casos de Uso

### Caso 1: Progressão Linear
```typescript
// Cada aula requer a anterior
lessons: [
  { id: "1", prerequisites: [] },
  { id: "2", prerequisites: ["1"] },
  { id: "3", prerequisites: ["2"] },
  { id: "4", prerequisites: ["3"] }
]
```

### Caso 2: Múltiplos Pré-requisitos
```typescript
// Aula final requer várias anteriores
lessons: [
  { id: "intro", prerequisites: [] },
  { id: "html", prerequisites: ["intro"] },
  { id: "css", prerequisites: ["intro"] },
  { id: "projeto", prerequisites: ["html", "css"] } // Requer ambas
]
```

### Caso 3: Módulos Independentes
```typescript
// Módulos sem dependência entre si
modulo1: {
  lessons: [
    { id: "m1-1", prerequisites: [] },
    { id: "m1-2", prerequisites: ["m1-1"] }
  ]
},
modulo2: {
  lessons: [
    { id: "m2-1", prerequisites: [] }, // Independente do módulo 1
    { id: "m2-2", prerequisites: ["m2-1"] }
  ]
}
```

---

## 🔧 Manutenção e Debugging

### Verificar Pré-requisitos de uma Aula

```typescript
// No console do navegador
const lesson = currentCourse.modules
  .flatMap(m => m.lessons)
  .find(l => l.id === 'aula-id');
  
console.log('Pré-requisitos:', lesson.prerequisites);
console.log('Aulas completadas:', user.completedLessonIds);
console.log('Está bloqueada?', isLessonLocked(lesson, user.completedLessonIds));
```

### Problemas Comuns

**Problema:** Aula não desbloqueia após completar pré-requisito
- **Solução:** Verificar se o ID do pré-requisito está correto
- **Solução:** Confirmar que `completeLesson()` está salvando no Firestore

**Problema:** Aula bloqueada sem motivo aparente
- **Solução:** Verificar se há IDs de pré-requisitos inexistentes
- **Solução:** Limpar cache do navegador

---

## 🚀 Melhorias Futuras

### Curto Prazo
- [x] ~~Mostrar progresso visual (ex: "2/3 pré-requisitos completos")~~ CONCLUÍDO
- [x] ~~Permitir admin desbloquear manualmente para alunos específicos~~ CONCLUÍDO
- [ ] Mostrar lista de pré-requisitos pendentes na tela de bloqueio
- [ ] Adicionar histórico de desbloqueios manuais

### Médio Prazo
- [ ] Pré-requisitos opcionais (OR logic)
- [ ] Pré-requisitos baseados em pontuação mínima
- [ ] Pré-requisitos baseados em tempo (ex: aguardar 24h)

### Longo Prazo
- [ ] Árvore de dependências visual
- [ ] Sugestão automática de próxima aula
- [ ] Gamificação: "Desbloqueie 5 aulas esta semana"

---

## 📝 Checklist de Implementação

- [x] Adicionar campo `prerequisites` ao tipo `Lesson`
- [x] Criar função `isLessonLocked()`
- [x] Atualizar sidebar com indicadores visuais
- [x] Atualizar CourseDetail com bloqueio
- [x] Adicionar proteção de navegação via URL
- [x] Criar tela de bloqueio amigável
- [x] Adicionar tooltips explicativos
- [x] Testar com múltiplos cenários
- [ ] Documentar no guia do instrutor
- [ ] Criar vídeo tutorial para admins

---

## 🎓 Benefícios Pedagógicos

1. **Progressão Estruturada:** Garante base sólida antes de avançar
2. **Reduz Frustração:** Alunos não ficam perdidos em conteúdo avançado
3. **Aumenta Conclusão:** Caminho claro e organizado
4. **Feedback Claro:** Aluno sabe exatamente o que precisa fazer
5. **Flexibilidade:** Instrutores controlam a sequência ideal

---

## 📞 Suporte

Dúvidas sobre implementação? Entre em contato com a equipe de desenvolvimento.

**Última atualização:** 03/12/2024


---

## 🔓 Desbloqueio Manual (Admin)

### Como Funciona

Administradores podem desbloquear aulas manualmente para alunos específicos, ignorando os pré-requisitos. Isso é útil para:
- Alunos com conhecimento prévio
- Casos especiais ou exceções
- Testes e demonstrações
- Recuperação de progresso perdido

### Como Usar

1. Acesse o **Painel Admin** → **Alunos**
2. Localize o aluno desejado
3. Clique no botão **🔓 Acesso**
4. Selecione o curso
5. Clique em **🔒 Desbloquear** nas aulas desejadas
6. Aulas desbloqueadas mostram ícone 🔓

### Regras

- Aulas **completadas** não podem ser bloqueadas novamente
- Aulas desbloqueadas manualmente **ignoram pré-requisitos**
- Desbloqueio é **persistente** (salvo no Firestore)
- Apenas **admins** podem desbloquear aulas

### Indicadores Visuais

| Estado | Ícone | Descrição |
|--------|-------|-----------|
| Bloqueada | 🔒 | Pré-requisitos não completados |
| Desbloqueada Manualmente | 🔓 | Admin liberou acesso |
| Completada | ✓ | Aluno finalizou a aula |

### Estrutura de Dados

```typescript
interface User {
  // ... outros campos
  completedLessonIds: string[]; // Aulas completadas
  unlockedLessonIds?: string[]; // Aulas desbloqueadas manualmente
}
```

### Exemplo de Uso

```typescript
// Desbloquear aula
await handleUnlockLesson('student-123', 'lesson-05');

// Bloquear novamente
await handleLockLesson('student-123', 'lesson-05');
```

---

## 📊 Progresso de Pré-requisitos

### Indicador Visual

Aulas bloqueadas agora mostram o progresso dos pré-requisitos:

```
🔒 Aula Avançada de JavaScript
   ⏱️ 45 min  2/3
```

Onde **2/3** significa:
- **2** pré-requisitos completados
- **3** pré-requisitos totais

### Tooltip Informativo

Ao passar o mouse sobre uma aula bloqueada:
```
Pré-requisitos: 2/3 completos
```

### Badge Visual

No CourseDetail, aulas bloqueadas mostram um badge:
```
┌─────────────────────────────┐
│ 🔒 Aula 5: Async/Await      │
│    [2/3] 45 min             │
└─────────────────────────────┘
```

---

**Última atualização:** 03/12/2024 - v1.1.0
