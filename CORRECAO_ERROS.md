# 🔧 Correção de Erros - Marketing Studio

## Problemas Identificados

### 1. ❌ API Key do Gemini Vazada
**Erro:** `Your API key was reported as leaked. Please use another API key.`

**Causa:** A chave `AIzaSyCR4WoizPjKwTO-voo460cP6LodgC2qh5M` foi exposta publicamente e foi reportada como vazada.

**Solução:**
1. Acesse: https://aistudio.google.com/app/apikey
2. **REVOGUE** a chave antiga (AIzaSyCR4WoizPjKwTO-voo460cP6LodgC2qh5M)
3. Crie uma **nova chave API**
4. Atualize o arquivo `.env.local`:
   ```env
   GEMINI_API_KEY=SUA_NOVA_CHAVE_AQUI
   ```
5. **NUNCA** commite o arquivo `.env.local` no Git
6. Reinicie o servidor de desenvolvimento: `npm run dev`

### 2. ✅ Permissões do Firestore - CORRIGIDO

**Erro:** `Missing or insufficient permissions` nas coleções:
- `marketingPosts`
- `mentorSessions`
- `communityPosts`
- `users`
- `projects`
- `articles`

**Solução Aplicada:**
As regras do Firestore foram atualizadas para permitir leitura pública das coleções necessárias.

**Próximo Passo - Deploy das Regras:**

```bash
# 1. Instale o Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# 2. Faça login no Firebase
firebase login

# 3. Faça o deploy das novas regras
firebase deploy --only firestore:rules
```

## ⚠️ Segurança - Boas Práticas

### Proteja suas Chaves de API:

1. **Nunca commite** arquivos `.env.local` ou `.env`
2. Verifique se `.env.local` está no `.gitignore`
3. Use variáveis de ambiente no Vercel/servidor de produção
4. Restrinja suas API keys por domínio/IP quando possível

### Configuração no Vercel (Produção):

1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione as variáveis:
   - `GEMINI_API_KEY` = sua_nova_chave
   - `VITE_FIREBASE_API_KEY` = (já configurado)
   - etc.
3. Faça redeploy do projeto

## 🎯 Checklist de Correção

- [ ] Revogar chave antiga do Gemini
- [ ] Criar nova chave do Gemini
- [ ] Atualizar `.env.local` com nova chave
- [ ] Deploy das regras do Firestore: `firebase deploy --only firestore:rules`
- [ ] Reiniciar servidor: `npm run dev`
- [ ] Testar Marketing Studio
- [ ] Configurar variáveis no Vercel (produção)
- [ ] Verificar `.gitignore` contém `.env.local`

## 📝 Verificação Final

Após aplicar as correções, teste:

1. ✅ Acesso ao Marketing Studio sem erros de permissão
2. ✅ Geração de conteúdo com Gemini funcionando
3. ✅ Fórum de dúvidas carregando posts
4. ✅ Perfis de usuários visíveis
5. ✅ Projetos e artigos carregando

---

**Status:** 
- ✅ Regras do Firestore atualizadas (aguardando deploy)
- ⏳ API Key do Gemini precisa ser substituída manualmente
