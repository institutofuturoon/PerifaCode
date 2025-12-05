# 🔑 Passo a Passo: Renovar API Key do Google Gemini

## ⚠️ Situação Atual
A chave `AIzaSyBG-jIvRO0wOWjj1EMCpuOzZ2_DdN5u1eY` está **EXPIRADA**.

## ✅ Solução Rápida (5 minutos)

### 1️⃣ Gerar Nova Chave
1. Abra: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em **"Create API Key"** ou **"Get API Key"**
4. Selecione um projeto do Google Cloud (ou crie um novo)
5. Copie a nova chave gerada (começa com `AIza...`)

### 2️⃣ Atualizar Localmente
Abra o arquivo `.env.local` e substitua a chave antiga pela nova:

```bash
VITE_GEMINI_API_KEY=SUA_NOVA_CHAVE_AQUI
```

**Exemplo:**
```bash
# ANTES (expirada)
VITE_GEMINI_API_KEY=AIzaSyBG-jIvRO0wOWjj1EMCpuOzZ2_DdN5u1eY

# DEPOIS (nova chave)
VITE_GEMINI_API_KEY=AIzaSyC_NOVA_CHAVE_AQUI_123456789
```

### 3️⃣ Reiniciar Servidor
**IMPORTANTE:** Pare o servidor e inicie novamente:

```bash
# Pressione Ctrl+C para parar o servidor
# Depois execute:
npm run dev
```

### 4️⃣ Limpar Cache do Navegador
- **Chrome/Edge:** Ctrl + Shift + R (Windows) ou Cmd + Shift + R (Mac)
- **Firefox:** Ctrl + F5 (Windows) ou Cmd + Shift + R (Mac)

### 5️⃣ Testar
1. Vá no editor de artigos
2. Escreva algum conteúdo
3. Clique em "✨ Sugerir Títulos"
4. Deve funcionar! 🎉

## 🚀 Para Produção (Vercel)

Depois de testar localmente:

1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Procure por `VITE_GEMINI_API_KEY`
5. Se existir: clique em **Edit** e cole a nova chave
6. Se não existir: clique em **Add New** e adicione:
   - Name: `VITE_GEMINI_API_KEY`
   - Value: Sua nova chave
   - Environments: Production, Preview, Development (marque todos)
7. Clique em **Save**
8. Faça um novo deploy (commit + push ou clique em **Redeploy**)

## 🔍 Como Saber se Funcionou?

### ✅ Sucesso
- Não aparece mais erro no console
- Os títulos são gerados com sucesso
- O AI Studio funciona normalmente

### ❌ Ainda com erro
- Verifique se reiniciou o servidor
- Confirme que a chave está correta no `.env.local`
- Limpe o cache do navegador completamente
- Verifique se não há espaços extras na chave

## 💡 Dicas

1. **Guarde a chave em local seguro** (gerenciador de senhas)
2. **Não compartilhe a chave** publicamente
3. **Configure limites de uso** no Google Cloud Console para evitar custos inesperados
4. **Monitore o uso** em: https://aistudio.google.com/app/apikey

## 🆘 Problemas Comuns

### "API key expired" ainda aparece
- Certifique-se de que reiniciou o servidor
- Verifique se salvou o arquivo `.env.local`
- Confirme que a chave não tem espaços no início/fim

### "API key not found"
- Verifique se o nome da variável está correto: `VITE_GEMINI_API_KEY`
- Confirme que o arquivo é `.env.local` (não `.env`)

### "Quota exceeded"
- Você atingiu o limite gratuito da API
- Aguarde 24h ou configure billing no Google Cloud

## 📞 Links Úteis

- **Gerar chave:** https://aistudio.google.com/app/apikey
- **Google Cloud Console:** https://console.cloud.google.com/
- **Documentação Gemini:** https://ai.google.dev/docs
- **Vercel Dashboard:** https://vercel.com/dashboard
