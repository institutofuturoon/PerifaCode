# 🚀 Próximos Passos para Deploy em Produção

## ✅ O Que Já Foi Feito

- ✅ **Vulnerabilidades corrigidas** (0 vulnerabilidades)
- ✅ **`.env.example` criado**
- ✅ **Seção Hostinger implementada**
- ✅ **Reset de senha completo**
- ✅ **Regras do Firestore atualizadas**
- ✅ **Build testado** (passa sem erros)

---

## 🔴 CRÍTICO - Fazer ANTES do Deploy (5 minutos)

### 1. Configurar Variáveis de Ambiente no Vercel

**Por que é crítico:** Sem isso, o app não funciona em produção!

**Passo a passo:**

1. **Acesse:** https://vercel.com/seu-projeto/settings/environment-variables

2. **Adicione estas variáveis:**

```
VITE_FIREBASE_API_KEY=AIzaSyCfmYEpGNC1gTDtm-7X0OIWP3W3eQGXXYQ
VITE_FIREBASE_AUTH_DOMAIN=perifacode-fc132.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=perifacode-fc132
VITE_FIREBASE_STORAGE_BUCKET=perifacode-fc132.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=864131556184
VITE_FIREBASE_APP_ID=1:864131556184:web:3fad411905a7d6d9307b2d
VITE_FIREBASE_MEASUREMENT_ID=G-TV2MTZTZ8C

GEMINI_API_KEY=AIzaSyBG-jIvRO0wOWjj1EMCpuOzZ2_DdN5u1eY

BLOB_READ_WRITE_TOKEN=vercel_blob_rw_uI73bVafvL0LLaMC_v9NEwyi9BSF1pBmOXbFEamnbWvh3Rc

VITE_GA_MEASUREMENT_ID=G-TV2MTZTZ8C
```

3. **Marque para:** Production, Preview, Development

4. **Salve**

---

## 🟡 IMPORTANTE - Fazer Logo Após (15 minutos)

### 2. Otimizar Bundle Size

**Problema atual:** Bundle principal tem 798KB (214KB gzipped)

**Solução:**

Editar `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-libs': ['dompurify', 'marked', 'html2canvas']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
```

**Resultado esperado:** Chunks menores, carregamento mais rápido

---

### 3. Revisar Regras do Firestore (Opcional)

**Situação atual:** Todos podem ler todos os artigos (`allow read: if true`)

**Se quiser mais controle:**

```javascript
// firestore.rules
match /articles/{articleId} {
  // Apenas artigos publicados são públicos
  allow read: if resource.data.status == 'published' || isAdmin();
  allow write: if isAdmin();
}
```

**Ação necessária:** Garantir que todos os artigos tenham `status: "published"`

---

## 🚀 Deploy em Produção

### Passo 1: Build Local

```bash
npm run build
```

**Verificar:**
- ✅ Build passa sem erros
- ✅ Sem warnings críticos
- ✅ Tamanho dos chunks aceitável

---

### Passo 2: Preview Local

```bash
npm run preview
```

**Testar:**
- ✅ Homepage carrega
- ✅ Login funciona
- ✅ Blog aparece
- ✅ Navegação funciona

---

### Passo 3: Deploy no Vercel

**Opção 1: Via CLI**
```bash
vercel --prod
```

**Opção 2: Via GitHub**
- Push para `main`
- Vercel faz deploy automático

---

### Passo 4: Smoke Tests

Após o deploy, testar:

1. **Homepage**
   - [ ] Carrega corretamente
   - [ ] Banner Hostinger aparece
   - [ ] Seção de parceiros funciona

2. **Autenticação**
   - [ ] Login funciona
   - [ ] Cadastro funciona
   - [ ] Esqueci senha funciona

3. **Blog**
   - [ ] Artigos aparecem
   - [ ] Artigo da Hostinger abre
   - [ ] Navegação funciona

4. **Dashboard**
   - [ ] Admin consegue acessar
   - [ ] Reset de senha funciona
   - [ ] Edição de usuários funciona

5. **Performance**
   - [ ] Lighthouse Score > 80
   - [ ] First Contentful Paint < 2s
   - [ ] Time to Interactive < 4s

---

## 📊 Checklist Completo

### Antes do Deploy
- [x] Vulnerabilidades corrigidas
- [x] `.env.example` criado
- [ ] Variáveis configuradas no Vercel ⚠️ **CRÍTICO**
- [ ] Bundle otimizado (opcional)
- [x] Build testado localmente

### Durante o Deploy
- [ ] Backup do Firestore
- [ ] Deploy realizado
- [ ] Domínio configurado
- [ ] SSL ativo

### Após o Deploy
- [ ] Smoke tests realizados
- [ ] Analytics funcionando
- [ ] Erros monitorados
- [ ] Performance verificada

---

## 🎯 Ordem Recomendada

### Agora (5 minutos)
1. ✅ Configurar variáveis no Vercel

### Depois (15 minutos)
2. ⚡ Otimizar bundle (opcional)
3. 🔒 Revisar regras Firestore (opcional)

### Deploy (10 minutos)
4. 🏗️ Build local
5. 👀 Preview local
6. 🚀 Deploy produção
7. ✅ Smoke tests

**Tempo total:** 30 minutos

---

## 🆘 Se Algo Der Errado

### Build falha
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### Deploy falha
```bash
# Verificar logs
vercel logs

# Rollback
vercel rollback
```

### App não funciona
1. Verificar variáveis de ambiente
2. Verificar console do navegador (F12)
3. Verificar logs do Vercel
4. Verificar regras do Firestore

---

## 📞 Recursos

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com/
- **Documentação Vercel:** https://vercel.com/docs
- **Documentação Firebase:** https://firebase.google.com/docs

---

## 💡 Dicas Finais

### Performance
- Use CDN para imagens grandes
- Ative compressão no Vercel
- Configure cache headers

### Segurança
- Rotacione chaves de API periodicamente
- Configure CORS no Firebase
- Ative 2FA no Vercel e Firebase

### Monitoramento
- Configure alertas no Vercel
- Monitore uso do Firebase
- Acompanhe Analytics

---

**Pronto para o deploy?** 🚀  
Comece configurando as variáveis no Vercel!
