# ✅ Checklist Rápido de Validação

**Tempo estimado:** 15-20 minutos  
**Objetivo:** Validação rápida das funcionalidades principais

---

## 🚀 Início Rápido

### 1. Verificar Compilação
```bash
npm run build
```
**Esperado:** Build sem erros ✅

---

### 2. Iniciar Servidor
```bash
npm run dev
```
**Esperado:** Servidor inicia em http://localhost:5173 ✅

---

## 🔒 Pré-requisitos (2 min)

### ✅ Teste Visual Rápido
1. Abra um curso
2. Veja se aulas mostram ícone 🔒 quando bloqueadas
3. Veja se badge "2/3" aparece em aulas bloqueadas
4. Tente clicar em aula bloqueada → deve estar desabilitada

**Status:** [ ] OK [ ] Falhou

---

## 🎨 Editor de Cursos (3 min)

### ✅ Teste Visual Rápido
1. Acesse `/admin` → Editor de Curso
2. Clique em "👁️ Preview" em uma aula → modal abre
3. Clique em "📋" em um módulo → módulo duplica
4. Clique em "✨ Usar Template" → modal de templates abre
5. Clique em "📥 Exportar JSON" → arquivo baixa

**Status:** [ ] OK [ ] Falhou

---

## 🔔 Notificações (2 min)

### ✅ Teste Visual Rápido
1. Faça login
2. Veja ícone 🔔 no header
3. Clique no sino → dropdown abre
4. Veja se notificações aparecem
5. Clique em uma notificação → navega e marca como lida

**Status:** [ ] OK [ ] Falhou

---

## 🔗 Integração (5 min)

### ✅ Fluxo Aluno Básico
1. Login como aluno
2. Acesse um curso
3. Complete uma aula
4. Veja progresso atualizar
5. Tente acessar aula bloqueada
6. Verifique notificações

**Status:** [ ] OK [ ] Falhou

---

### ✅ Fluxo Admin Básico
1. Login como admin
2. Acesse Painel Admin → Alunos
3. Clique em "🔓 Acesso" em um aluno
4. Desbloqueie uma aula
5. Verifique se aluno pode acessar

**Status:** [ ] OK [ ] Falhou

---

## 📱 Responsividade (2 min)

### ✅ Teste Visual Rápido
1. Abra DevTools (F12)
2. Mude para mobile (375px)
3. Navegue pela plataforma
4. Verifique se tudo é acessível

**Status:** [ ] OK [ ] Falhou

---

## 🐛 Console (1 min)

### ✅ Verificar Erros
1. Abra Console (F12)
2. Navegue pela plataforma
3. Verifique se há erros em vermelho

**Esperado:** Sem erros críticos ✅

**Status:** [ ] OK [ ] Falhou

---

## 📊 Resultado Final

**Testes OK:** [ ] / 7  
**Testes Falhados:** [ ] / 7

**Status Geral:**
- [ ] ✅ Tudo funcionando
- [ ] ⚠️ Pequenos problemas (não críticos)
- [ ] ❌ Problemas críticos encontrados

---

## 🚨 Problemas Encontrados

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✅ Próximos Passos

Se todos os testes passaram:
- [ ] Fazer commit das mudanças
- [ ] Criar PR para review
- [ ] Deploy para staging
- [ ] Testes mais detalhados (GUIA_TESTES_COMPLETO.md)

Se houver problemas:
- [ ] Documentar bugs encontrados
- [ ] Priorizar correções
- [ ] Corrigir e testar novamente

---

**Testado em:** ___/___/______  
**Por:** _____________
