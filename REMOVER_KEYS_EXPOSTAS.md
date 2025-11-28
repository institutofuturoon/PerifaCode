# 🚨 URGENTE: Remover Chaves Expostas do GitHub

## ⚠️ PRIMEIRO: Revogue as Chaves IMEDIATAMENTE

**Antes de qualquer coisa, revogue as chaves expostas:**

### 1. Gemini API Key
- Acesse: https://aistudio.google.com/app/apikey
- Encontre a chave: `AIzaSyCR4WoizPjKwTO-voo460cP6LodgC2qh5M`
- Clique em **"Delete"** ou **"Revoke"**
- Crie uma **nova chave**

### 2. Firebase API Key (se necessário)
- Acesse: https://console.firebase.google.com
- Vá em: Project Settings > General
- Se necessário, regenere as credenciais

### 3. Vercel Blob Token
- Acesse: https://vercel.com/dashboard
- Revogue o token: `vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc`
- Crie um novo

---

## 🔧 Método 1: Revert (RECOMENDADO - Mais Simples)

Este método é o mais seguro e simples. Cria um novo commit que remove o arquivo.

```bash
# 1. Reverte o commit problemático
git revert 19af51e --no-edit

# 2. Remove .env.local do repositório (se ainda estiver lá)
git rm --cached .env.local

# 3. Commit da remoção
git commit -m "security: Remove .env.local from repository"

# 4. Push para o GitHub
git push origin main
```

**Nota:** As chaves ainda estarão no histórico, mas não mais no código atual. Por isso é CRÍTICO revogar as chaves antigas!

---

## 🔧 Método 2: Reescrever Histórico (AVANÇADO)

⚠️ **ATENÇÃO:** Isso reescreve TODO o histórico do Git! Use apenas se:
- Você é o único desenvolvedor
- Ou todos os colaboradores podem fazer `git clone` novamente

### Opção A: Usando BFG Repo-Cleaner (Mais Rápido)

```bash
# 1. Baixe BFG: https://rtyley.github.io/bfg-repo-cleaner/
# 2. Faça backup
git branch backup-antes-de-limpar

# 3. Execute BFG
java -jar bfg.jar --delete-files .env.local

# 4. Limpe o repositório
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push
git push origin main --force
```

### Opção B: Usando git filter-repo

```bash
# 1. Instale git-filter-repo
pip install git-filter-repo

# 2. Faça backup
git branch backup-antes-de-limpar

# 3. Remova o arquivo do histórico
git filter-repo --path .env.local --invert-paths --force

# 4. Force push
git push origin main --force
```

### Opção C: Usando git filter-branch (Legado)

```bash
# 1. Faça backup
git branch backup-antes-de-limpar

# 2. Remova do histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Limpe referências
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 4. Force push
git push origin main --force
```

---

## 📋 Checklist Pós-Remoção

- [ ] ✅ Chaves antigas revogadas (Gemini, Firebase, Vercel)
- [ ] ✅ Novas chaves criadas
- [ ] ✅ `.env.local` atualizado localmente com novas chaves
- [ ] ✅ Commit removido/revertido do GitHub
- [ ] ✅ Verificar que `.env.local` está no `.gitignore`
- [ ] ✅ Colaboradores avisados (se houver)
- [ ] ✅ Variáveis de ambiente configuradas no Vercel
- [ ] ✅ Testar aplicação com novas chaves

---

## 🔍 Verificar se Funcionou

```bash
# Verificar se .env.local ainda aparece no histórico
git log --all --full-history -- .env.local

# Se não retornar nada, está limpo!
```

---

## 🛡️ Prevenção Futura

1. **Sempre** verifique o `.gitignore` antes de commitar
2. Use hooks do Git para prevenir commits de arquivos sensíveis
3. Configure alertas no GitHub para secrets expostos
4. Use ferramentas como `git-secrets` ou `gitleaks`

---

## 📞 Suporte

Se tiver dúvidas ou problemas:
1. Faça backup antes de qualquer operação: `git branch backup-$(date +%Y%m%d)`
2. Se algo der errado: `git checkout backup-YYYYMMDD`
3. Consulte: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

---

**Status Atual:**
- ⚠️ Commit com keys: `19af51e`
- 📁 Arquivo exposto: `.env.local`
- 🔑 Keys expostas: Gemini, Firebase, Vercel Blob
