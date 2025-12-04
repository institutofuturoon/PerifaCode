# 📚 Exemplo Prático: Configurando Pré-requisitos

Este documento mostra exemplos práticos de como configurar pré-requisitos em cursos reais.

---

## 🎯 Exemplo 1: Curso de JavaScript (Progressão Linear)

```json
{
  "id": "javascript-fundamentals",
  "title": "JavaScript do Zero ao Avançado",
  "modules": [
    {
      "id": "mod-01",
      "title": "Fundamentos",
      "lessons": [
        {
          "id": "js-intro",
          "title": "Introdução ao JavaScript",
          "duration": "30 min",
          "type": "video",
          "xp": 100,
          "prerequisites": []
        },
        {
          "id": "js-variaveis",
          "title": "Variáveis e Tipos de Dados",
          "duration": "45 min",
          "type": "video",
          "xp": 150,
          "prerequisites": ["js-intro"]
        },
        {
          "id": "js-operadores",
          "title": "Operadores e Expressões",
          "duration": "40 min",
          "type": "video",
          "xp": 150,
          "prerequisites": ["js-variaveis"]
        }
      ]
    },
    {
      "id": "mod-02",
      "title": "Estruturas de Controle",
      "lessons": [
        {
          "id": "js-if-else",
          "title": "Condicionais (if/else)",
          "duration": "50 min",
          "type": "video",
          "xp": 200,
          "prerequisites": ["js-operadores"]
        },
        {
          "id": "js-loops",
          "title": "Loops (for, while)",
          "duration": "55 min",
          "type": "video",
          "xp": 200,
          "prerequisites": ["js-if-else"]
        }
      ]
    }
  ]
}
```

**Resultado:** Aluno deve completar aulas na ordem sequencial.

---

## 🎯 Exemplo 2: Curso de Web Design (Múltiplos Pré-requisitos)

```json
{
  "id": "web-design-completo",
  "title": "Web Design Completo",
  "modules": [
    {
      "id": "mod-01",
      "title": "Fundamentos",
      "lessons": [
        {
          "id": "wd-intro",
          "title": "Introdução ao Web Design",
          "prerequisites": []
        },
        {
          "id": "wd-html",
          "title": "HTML Básico",
          "prerequisites": ["wd-intro"]
        },
        {
          "id": "wd-css",
          "title": "CSS Básico",
          "prerequisites": ["wd-intro"]
        },
        {
          "id": "wd-layout",
          "title": "Layouts com Flexbox",
          "prerequisites": ["wd-html", "wd-css"]
        }
      ]
    },
    {
      "id": "mod-02",
      "title": "Projeto Final",
      "lessons": [
        {
          "id": "wd-projeto",
          "title": "Criando um Site Completo",
          "prerequisites": ["wd-html", "wd-css", "wd-layout"]
        }
      ]
    }
  ]
}
```

**Resultado:** 
- `wd-layout` requer tanto HTML quanto CSS
- `wd-projeto` requer todas as aulas anteriores

---

## 🎯 Exemplo 3: Curso com Módulos Independentes

```json
{
  "id": "desenvolvimento-web",
  "title": "Desenvolvimento Web Full Stack",
  "modules": [
    {
      "id": "frontend",
      "title": "Frontend",
      "lessons": [
        {
          "id": "fe-intro",
          "title": "Introdução ao Frontend",
          "prerequisites": []
        },
        {
          "id": "fe-react",
          "title": "React Básico",
          "prerequisites": ["fe-intro"]
        }
      ]
    },
    {
      "id": "backend",
      "title": "Backend",
      "lessons": [
        {
          "id": "be-intro",
          "title": "Introdução ao Backend",
          "prerequisites": []
        },
        {
          "id": "be-nodejs",
          "title": "Node.js Básico",
          "prerequisites": ["be-intro"]
        }
      ]
    },
    {
      "id": "integracao",
      "title": "Integração",
      "lessons": [
        {
          "id": "int-api",
          "title": "Conectando Frontend e Backend",
          "prerequisites": ["fe-react", "be-nodejs"]
        }
      ]
    }
  ]
}
```

**Resultado:**
- Módulos Frontend e Backend são independentes
- Módulo de Integração requer ambos

---

## 🎯 Exemplo 4: Curso Sem Pré-requisitos (Livre)

```json
{
  "id": "dicas-carreira",
  "title": "Dicas de Carreira em Tech",
  "modules": [
    {
      "id": "mod-01",
      "title": "Carreira",
      "lessons": [
        {
          "id": "cv-linkedin",
          "title": "Como Criar um LinkedIn Profissional",
          "prerequisites": []
        },
        {
          "id": "cv-portfolio",
          "title": "Montando seu Portfólio",
          "prerequisites": []
        },
        {
          "id": "cv-entrevista",
          "title": "Preparação para Entrevistas",
          "prerequisites": []
        }
      ]
    }
  ]
}
```

**Resultado:** Aluno pode fazer aulas em qualquer ordem.

---

## 🔧 Como Adicionar no Firestore

### Via Console do Firebase

1. Acesse o Firestore Console
2. Navegue até: `courses/{courseId}/modules/{moduleId}/lessons/{lessonId}`
3. Adicione o campo `prerequisites` como array:
   ```
   prerequisites: ["aula-01", "aula-02"]
   ```

### Via Editor de Cursos (Futuro)

No editor de cursos, adicionar um campo:

```
┌─────────────────────────────────────┐
│ Pré-requisitos desta aula:          │
│                                     │
│ ☑ Introdução ao JavaScript          │
│ ☑ Variáveis e Tipos de Dados        │
│ ☐ Operadores e Expressões           │
│                                     │
│ [Salvar]                            │
└─────────────────────────────────────┘
```

---

## 📊 Estratégias de Uso

### Estratégia 1: Progressão Linear Estrita
**Quando usar:** Cursos técnicos onde cada conceito depende do anterior
**Exemplo:** Programação, Matemática

```typescript
// Cada aula requer a anterior
lesson2.prerequisites = [lesson1.id]
lesson3.prerequisites = [lesson2.id]
lesson4.prerequisites = [lesson3.id]
```

### Estratégia 2: Árvore de Dependências
**Quando usar:** Cursos com tópicos paralelos que convergem
**Exemplo:** Web Development (HTML + CSS → Layout)

```typescript
// Múltiplos caminhos que convergem
layoutLesson.prerequisites = [htmlLesson.id, cssLesson.id]
```

### Estratégia 3: Módulos Independentes
**Quando usar:** Cursos de tópicos variados
**Exemplo:** Soft Skills, Dicas de Carreira

```typescript
// Sem pré-requisitos entre módulos
module1.lessons.forEach(l => l.prerequisites = [])
module2.lessons.forEach(l => l.prerequisites = [])
```

### Estratégia 4: Híbrida
**Quando usar:** Cursos longos com seções independentes
**Exemplo:** Full Stack (Frontend independente de Backend, mas Integração requer ambos)

```typescript
// Independência dentro de módulos
frontendLessons.forEach(l => l.prerequisites = [/* apenas frontend */])
backendLessons.forEach(l => l.prerequisites = [/* apenas backend */])

// Convergência no final
integrationLesson.prerequisites = [lastFrontend.id, lastBackend.id]
```

---

## ✅ Checklist de Configuração

Ao configurar pré-requisitos em um curso:

- [ ] Identificar dependências lógicas entre aulas
- [ ] Decidir estratégia (linear, árvore, independente, híbrida)
- [ ] Adicionar campo `prerequisites` em cada aula
- [ ] Testar progressão como aluno
- [ ] Verificar se IDs dos pré-requisitos estão corretos
- [ ] Documentar lógica de progressão para instrutores
- [ ] Comunicar aos alunos sobre a estrutura do curso

---

## 🚨 Erros Comuns

### ❌ Erro 1: ID Incorreto
```json
{
  "id": "aula-02",
  "prerequisites": ["aula-01-typo"] // ID não existe!
}
```
**Resultado:** Aula ficará bloqueada permanentemente

### ❌ Erro 2: Dependência Circular
```json
{
  "id": "aula-01",
  "prerequisites": ["aula-02"]
},
{
  "id": "aula-02",
  "prerequisites": ["aula-01"]
}
```
**Resultado:** Ambas ficam bloqueadas

### ❌ Erro 3: Pré-requisito de Módulo Futuro
```json
// Módulo 1
{
  "id": "mod1-aula1",
  "prerequisites": ["mod2-aula1"] // Módulo 2 ainda não foi visto!
}
```
**Resultado:** Confusão na progressão

---

## 💡 Dicas de Boas Práticas

1. **Mantenha Simples:** Evite muitos pré-requisitos por aula
2. **Seja Lógico:** Pré-requisitos devem fazer sentido pedagógico
3. **Teste Sempre:** Simule a jornada do aluno
4. **Documente:** Explique a lógica de progressão
5. **Flexibilidade:** Nem todo curso precisa de pré-requisitos

---

**Última atualização:** 03/12/2024
