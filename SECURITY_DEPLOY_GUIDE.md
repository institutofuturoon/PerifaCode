# 🔐 Guia de Deploy de Segurança - PerifaCode

Este documento contém instruções para fazer deploy das melhorias de segurança implementadas na Fase 1.

---

## 📋 Pré-requisitos

1. **Node.js** instalado (v18 ou superior)
2. **Conta Firebase** com projeto configurado
3. **Acesso ao console Vercel** (para variáveis de ambiente)

---

## 🚀 Passo 1: Configurar Variáveis de Ambiente

### 1.1. Localmente (.env.local)

O arquivo `.env.local` já foi criado com as credenciais atuais. **NUNCA** commite este arquivo!

```bash
# Verificar se .env.local está no .gitignore
cat .gitignore | grep ".env.local"
```

### 1.2. No Vercel (Produção)

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto **PerifaCode**
3. Vá em **Settings** → **Environment Variables**
4. Adicione as seguintes variáveis:

```
VITE_FIREBASE_API_KEY=AIzaSyCfmYEpGNC1gTDtm-7X0OIWP3W3eQGXXYQ
VITE_FIREBASE_AUTH_DOMAIN=perifacode-fc132.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=perifacode-fc132
VITE_FIREBASE_STORAGE_BUCKET=perifacode-fc132.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=864131556184
VITE_FIREBASE_APP_ID=1:864131556184:web:3fad411905a7d6d9307b2d
VITE_FIREBASE_MEASUREMENT_ID=G-TV2MTZTZ8C

GEMINI_API_KEY=<sua_chave_gemini>

BLOB_READ_WRITE_TOKEN=vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc
```

> ⚠️ **IMPORTANTE**: Marque `BLOB_READ_WRITE_TOKEN` como **Server-side only**

---

## 🔥 Passo 2: Deploy das Firestore Security Rules

### 2.1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2.2. Fazer Login no Firebase

```bash
firebase login
```

### 2.3. Inicializar o Projeto (se ainda não foi feito)

```bash
firebase init firestore
```

Selecione:
- ✅ Use an existing project
- Escolha: `perifacode-fc132`
- Firestore rules file: `firestore.rules` (já existe)
- Firestore indexes file: `firestore.indexes.json` (já existe)

### 2.4. Deploy das Regras

```bash
firebase deploy --only firestore:rules
```

Você verá:
```
✔  Deploy complete!
```

### 2.5. Verificar Regras no Console

1. Acesse: https://console.firebase.google.com/project/perifacode-fc132/firestore/rules
2. Confirme que as regras foram atualizadas

---

## 🧪 Passo 3: Testar Segurança

### 3.1. Testar Acesso Não Autorizado

Abra o console do navegador e tente:

```javascript
// Tentar ler usuários sem autenticação
const db = firebase.firestore();
db.collection('users').get()
  .then(() => console.log('❌ FALHA: Conseguiu ler sem auth'))
  .catch(() => console.log('✅ OK: Bloqueado sem auth'));
```

**Resultado esperado**: Erro `permission-denied`

### 3.2. Testar Upload Seguro

1. Faça login na aplicação
2. Vá para o perfil
3. Tente fazer upload de uma imagem de avatar
4. Verifique no Network tab se a requisição vai para `/api/upload`
5. Confirme que não há token exposto no frontend

### 3.3. Testar Regras de Admin

1. Faça login como aluno
2. Tente acessar `/dashboard` → Painel de Admin
3. Tente criar um curso

**Resultado esperado**: Bloqueado (apenas admins podem criar cursos)

---

## ✅ Passo 4: Auditoria de Segurança

### 4.1. Verificar Código-fonte

Execute esta busca para garantir que não há credenciais hardcoded:

```bash
# Buscar por possíveis tokens expostos
grep -r "AIzaSy" --exclude-dir=node_modules --exclude=".env*" .
grep -r "vercel_blob_rw" --exclude-dir=node_modules --exclude=".env*" .
```

**Resultado esperado**: Nenhum resultado (exceto em `.env.local` que está no .gitignore)

### 4.2. Checklist de Segurança

- [ ] `.env.local` está no `.gitignore`
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `firebaseConfig.ts` usa `import.meta.env`
- [ ] `Uploader.tsx` chama `/api/upload` (não tem token hardcoded)
- [ ] Firestore Rules foram deployed
- [ ] Testes de acesso não autorizado passaram

---

## 🔄 Passo 5: Reiniciar Aplicação

### 5.1. Parar servidor atual

No terminal onde `npm run dev` está rodando:
- Pressione `Ctrl + C`

### 5.2. Reiniciar com novas variáveis

```bash
npm run dev
```

### 5.3. Verificar no console

Você NÃO deve ver o erro:
```
❌ Firebase configuration is missing!
```

Se vir este erro, verifique se o `.env.local` está no diretório raiz do projeto.

---

## 📝 Passo 6: Commit e Deploy

### 6.1. Verificar mudanças

```bash
git status
```

**Arquivos que DEVEM ser commitados**:
- ✅ `.gitignore` (atualizado)
- ✅ `.env.example` (template)
- ✅ `firebaseConfig.ts` (usando env vars)
- ✅ `components/Uploader.tsx` (usando API)
- ✅ `api/upload.ts` (novo)
- ✅ `firestore.rules` (novo)
- ✅ `firebase.json` (novo)
- ✅ `firestore.indexes.json` (novo)

**Arquivos que NÃO devem ser commitados**:
- ❌ `.env.local` (deve estar no .gitignore)

### 6.2. Commit

```bash
git add .
git commit -m "feat: Implementar Fase 1 de Segurança

- Migrar credenciais Firebase para variáveis de ambiente
- Criar API de upload segura (/api/upload)
- Implementar Firestore Security Rules
- Atualizar .gitignore para proteger arquivos sensíveis
- Remover tokens hardcoded do código-fonte"
```

### 6.3. Push e Deploy Automático

```bash
git push origin main
```

O Vercel fará deploy automático. Aguarde ~2 minutos.

---

## 🎯 Próximos Passos

Após completar esta Fase 1, você pode prosseguir para:

- **Fase 2**: Melhorias de Performance
- **Fase 3**: Refatoração de Arquitetura
- **Fase 4**: UX/Acessibilidade

---

## 🆘 Troubleshooting

### Problema: "Firebase configuration is missing"

**Solução**:
1. Verifique se `.env.local` existe no diretório raiz
2. Reinicie o servidor de desenvolvimento
3. Verifique se as variáveis começam com `VITE_`

### Problema: "Permission denied" ao acessar Firestore

**Solução**:
1. Verifique se as regras foram deployed: `firebase deploy --only firestore:rules`
2. Confirme no console Firebase que as regras estão ativas
3. Faça logout e login novamente na aplicação

### Problema: Upload de imagem falha

**Solução**:
1. Verifique se `/api/upload.ts` existe
2. Confirme que `BLOB_READ_WRITE_TOKEN` está configurado no Vercel
3. Verifique os logs do Vercel para erros da API

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console do navegador
2. Verifique os logs do Vercel: https://vercel.com/dashboard
3. Verifique os logs do Firebase: https://console.firebase.google.com

---

**Última atualização**: 26/11/2025
**Versão**: 1.0.0
