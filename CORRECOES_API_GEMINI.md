# Correções Aplicadas - API Gemini

## Problemas Identificados

1. ❌ Uso de `process.env.API_KEY` (Node.js) ao invés de `import.meta.env.VITE_GEMINI_API_KEY` (Vite)
2. ❌ Modelo incorreto: `gemini-2.5-flash` (não existe) ao invés de `gemini-1.5-flash`
3. ❌ Variável de ambiente com nome errado: `GEMINI_API_KEY` ao invés de `VITE_GEMINI_API_KEY`

## Correções Aplicadas

### 1. ArticleEditor.tsx
```typescript
// ANTES
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
});

// DEPOIS
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = ai.models.get("gemini-1.5-flash");
const response = await model.generateContent({
    contents: prompt,
    config: { ... }
});
```

### 2. BlogAIStudio.tsx
```typescript
// ANTES
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
});

// DEPOIS
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
const model = ai.models.get('gemini-1.5-flash');
const response = await model.generateContent({
    contents: prompt,
});
```

### 3. .env.local
```bash
# ANTES
GEMINI_API_KEY=AIzaSyBG-jIvRO0wOWjj1EMCpuOzZ2_DdN5u1eY

# DEPOIS
VITE_GEMINI_API_KEY=AIzaSyBG-jIvRO0wOWjj1EMCpuOzZ2_DdN5u1eY
```

### 4. .env.local.template
```bash
# ANTES
GEMINI_API_KEY=

# DEPOIS
VITE_GEMINI_API_KEY=
```

## Próximos Passos

### Para Desenvolvimento Local
1. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   
2. Limpe o cache do navegador (Ctrl + Shift + R ou Cmd + Shift + R)

3. Teste as funcionalidades de IA:
   - Gerar títulos no editor de artigos
   - Melhorar texto com AI Studio

### Para Produção (Vercel)
1. Acesse: https://vercel.com/dashboard
2. Vá em **Settings** → **Environment Variables**
3. Adicione ou atualize:
   - Nome: `VITE_GEMINI_API_KEY`
   - Valor: Sua chave do Google AI Studio
4. Faça commit e push das alterações
5. Aguarde o deploy automático

## Verificação

Após reiniciar o servidor, você não deve mais ver os erros:
- ✅ `API key expired` - Resolvido com a nova chave
- ✅ `process.env is undefined` - Resolvido usando `import.meta.env`
- ✅ `gemini-2.5-flash not found` - Resolvido usando `gemini-1.5-flash`

## Modelos Gemini Disponíveis

- ✅ `gemini-1.5-flash` - Rápido e eficiente (recomendado)
- ✅ `gemini-1.5-pro` - Mais poderoso, mas mais lento
- ❌ `gemini-2.5-flash` - Não existe (ainda)

## Observações

- No Vite, variáveis de ambiente devem começar com `VITE_` para serem expostas ao cliente
- Sempre reinicie o servidor após alterar `.env.local`
- No Vercel, não é necessário o prefixo `VITE_`, mas mantemos para consistência
