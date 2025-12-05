# Guia: Renovar API Key do Google Gemini AI

## Erro Atual
```
API key expired. Please renew the API key.
```

## Solução Rápida

### Passo 1: Obter Nova API Key
1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em **"Create API Key"** ou **"Get API Key"**
4. Copie a nova chave gerada

### Passo 2: Atualizar Localmente
Edite o arquivo `.env.local`:

```bash
VITE_GEMINI_API_KEY=sua_nova_chave_aqui
```

**Importante:** Após alterar o `.env.local`, você precisa **reiniciar o servidor de desenvolvimento** para que as mudanças tenham efeito.

### Passo 3: Atualizar no Vercel
1. Acesse: https://vercel.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **Environment Variables**
4. Encontre `VITE_GEMINI_API_KEY` (ou crie se não existir)
5. Clique em **Edit** e cole a nova chave
6. Salve e faça **Redeploy** do projeto

### Passo 4: Testar
Após o deploy, teste as funcionalidades de IA:
- Gerar títulos para artigos
- Melhorar texto com IA
- Outras features que usam o Gemini

## Observação sobre Firestore
Você também está com erro de permissões no Firestore:
```
Missing or insufficient permissions
```

Isso pode ser porque:
1. As regras do Firestore estão muito restritivas
2. O usuário não está autenticado
3. Falta configurar índices no Firestore

Se precisar ajuda com isso também, me avise!

## Checklist
- [ ] Acessar Google AI Studio
- [ ] Gerar nova API Key
- [ ] Atualizar `.env.local`
- [ ] Atualizar variável no Vercel
- [ ] Fazer redeploy
- [ ] Testar funcionalidades de IA
