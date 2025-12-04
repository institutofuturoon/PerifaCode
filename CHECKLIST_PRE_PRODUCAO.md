# 🚀 Checklist de Pré-Produção - FuturoOn

## 📊 Status Geral: ⚠️ ATENÇÃO NECESSÁRIA

---

## 🔴 CRÍTICO - Resolver ANTES do Deploy

### 1. Vulnerabilidade de Segurança
**Status:** ❌ CRÍTICO

```
Pacote: next 16.0.0-canary.0 - 16.0.6
Severidade: CRÍTICA
Problema: RCE (Remote Code Execution) no React flight protocol
```

**Solução:**
```bash
npm audit fix
# ou
npm install next@latest
```

**Por que é crítico:** Vulnerabilidade de execução remota de código pode comprometer toda a aplicação.

---

### 2. Variáveis de Ambiente Expostas
**Status:** ⚠️ ATENÇÃO

**Problemas identificados:**
- ✅ `.env.local` está no `.gitignore` (BOM)
- ⚠️ Chaves de API visíveis no código
- ⚠️ Token do Vercel Blob exposto

**Ações necessárias:**

#### a) Criar arquivo `.env.example`
```bash
# Copiar estrutura sem valores reais
cp .env.local .env.example
# Editar e remover valores sensíveis
```

#### b) Configurar variáveis no Vercel
1. Acesse: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione todas as variáveis do `.env.local`
3. Marque para: Production, Preview, Development

#### c) Rotacionar chaves expostas
- 🔑 **GEMINI_API_KEY** - Gerar nova chave
- 🔑 **BLOB_READ_WRITE_TOKEN** - Gerar novo token
- 🔑 **Firebase API Key** - Considerar restrições de domínio

---

### 3. Chunks Muito Grandes
**Status:** ⚠️ PERFORMANCE

```
Arquivo: index-Cj82UF9d.js
Tamanho: 798.24 kB (214.31 kB gzipped)
```

**Impacto:** Tempo de carregamento lento, especialmente em conexões 3G/4G.

**Solução:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-components': ['dompurify', 'marked', 'html2canvas']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
```

---

## 🟡 IMPORTANTE - Resolver Logo Após Deploy

### 4. Regras do Firestore Muito Permissivas
**Status:** ⚠️ SEGURANÇA

**Problema atual:**
```javascript
match /articles/{articleId} {
  allow read: if true;  // TODOS podem ler TUDO
}
```

**Recomendação:**
```javascript
match /articles/{articleId} {
  // Apenas artigos publicados são públicos
  allow read: if resource.data.status == 'published' || isAdmin();
  allow write: if isAdmin();
}
```

**Ação:**
1. Garantir que todos os artigos tenham `status: "published"`
2. Reverter regra para versão mais segura
3. Deploy: `firebase deploy --only firestore:rules`

---

### 5. Dados Mock no Código
**Status:** ⚠️ DADOS

**Arquivos com dados hardcoded:**
- `src/data/ongData.json` - Dados da ONG
- Imagens de parceiros em base64

**Recomendação:**
- Migrar dados para Firestore
- Usar CDN para imagens (Vercel Blob ou Cloudinary)
- Criar painel admin para gerenciar dados

---

### 6. Analytics e Monitoramento
**Status:** ⚠️ OBSERVABILIDADE

**Configurado:**
- ✅ Google Analytics 4 (GA4)

**Faltando:**
- ❌ Error tracking (Sentry)
- ❌ Performance monitoring
- ❌ User behavior analytics

**Recomendação:**
```bash
npm install @sentry/react @sentry/vite-plugin
```

---

## 🟢 OPCIONAL - Melhorias Futuras

### 7. SEO e Meta Tags
**Status:** ✅ PARCIAL

**Implementado:**
- ✅ Componente SEO
- ✅ Meta tags básicas
- ✅ JSON-LD para organização

**Melhorias:**
- Sitemap.xml
- robots.txt
- Open Graph images
- Twitter Cards

---

### 8. Performance
**Status:** ✅ BOM

**Build:**
- ✅ Build passa sem erros
- ✅ Tamanho total: ~1.5MB (gzipped: ~300KB)
- ⚠️ Alguns chunks grandes

**Melhorias:**
- Lazy loading de rotas
- Image optimization
- Service Worker para cache

---

### 9. Acessibilidade
**Status:** ⚠️ REVISAR

**Recomendações:**
- Adicionar testes de acessibilidade
- Verificar contraste de cores
- Adicionar ARIA labels
- Testar com leitores de tela

---

### 10. Testes
**Status:** ❌ AUSENTE

**Faltando:**
- Unit tests
- Integration tests
- E2E tests

**Recomendação:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

---

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] **Corrigir vulnerabilidade crítica do Next.js**
  ```bash
  npm audit fix
  ```

- [ ] **Criar `.env.example`**
  ```bash
  cp .env.local .env.example
  # Remover valores sensíveis
  ```

- [ ] **Configurar variáveis no Vercel**
  - Firebase config
  - Gemini API Key
  - Vercel Blob Token
  - Google Analytics ID

- [ ] **Otimizar chunks grandes**
  - Configurar `manualChunks` no vite.config.ts

- [ ] **Revisar regras do Firestore**
  - Garantir que artigos têm status
  - Ajustar regra de leitura

- [ ] **Testar build localmente**
  ```bash
  npm run build
  npm run preview
  ```

- [ ] **Verificar todos os links**
  - Links internos
  - Links externos
  - Imagens

- [ ] **Testar em diferentes navegadores**
  - Chrome
  - Firefox
  - Safari
  - Edge

- [ ] **Testar responsividade**
  - Mobile (320px - 768px)
  - Tablet (768px - 1024px)
  - Desktop (1024px+)

---

### Durante o Deploy

- [ ] **Fazer backup do Firestore**
  ```bash
  firebase firestore:export backup-$(date +%Y%m%d)
  ```

- [ ] **Deploy no Vercel**
  ```bash
  vercel --prod
  ```

- [ ] **Deploy das regras do Firestore**
  ```bash
  firebase deploy --only firestore:rules
  ```

- [ ] **Verificar domínio customizado**
  - DNS configurado
  - SSL ativo

---

### Após o Deploy

- [ ] **Smoke tests**
  - Homepage carrega
  - Login funciona
  - Cadastro funciona
  - Blog aparece

- [ ] **Verificar Analytics**
  - GA4 recebendo dados
  - Eventos sendo rastreados

- [ ] **Monitorar erros**
  - Console do navegador
  - Logs do Vercel
  - Logs do Firebase

- [ ] **Testar performance**
  - Google PageSpeed Insights
  - GTmetrix
  - WebPageTest

- [ ] **Verificar SEO**
  - Google Search Console
  - Meta tags corretas
  - Sitemap acessível

---

## 🎯 Prioridades

### 🔴 URGENTE (Fazer AGORA)
1. Corrigir vulnerabilidade do Next.js
2. Configurar variáveis de ambiente no Vercel
3. Criar `.env.example`

### 🟡 IMPORTANTE (Fazer HOJE)
4. Otimizar chunks grandes
5. Revisar regras do Firestore
6. Testar build completo

### 🟢 DESEJÁVEL (Fazer ESTA SEMANA)
7. Configurar Sentry
8. Adicionar sitemap.xml
9. Melhorar acessibilidade

---

## 📊 Métricas de Sucesso

### Performance
- ✅ First Contentful Paint < 1.8s
- ✅ Time to Interactive < 3.8s
- ⚠️ Total Bundle Size < 500KB (atual: ~800KB)

### SEO
- ✅ Meta tags presentes
- ✅ JSON-LD implementado
- ⚠️ Sitemap pendente

### Segurança
- ❌ Vulnerabilidade crítica presente
- ✅ HTTPS configurado
- ✅ Variáveis de ambiente protegidas

---

## 🚀 Comandos Rápidos

```bash
# Corrigir vulnerabilidades
npm audit fix

# Build de produção
npm run build

# Preview local
npm run preview

# Deploy Vercel
vercel --prod

# Deploy Firebase Rules
firebase deploy --only firestore:rules

# Verificar tamanho do bundle
npm run build -- --report
```

---

## 📞 Suporte

Se encontrar problemas durante o deploy:

1. **Verificar logs do Vercel**
   - https://vercel.com/seu-projeto/deployments

2. **Verificar logs do Firebase**
   - https://console.firebase.google.com/

3. **Rollback se necessário**
   ```bash
   vercel rollback
   ```

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Versão:** 1.0  
**Status:** Pronto para revisão
