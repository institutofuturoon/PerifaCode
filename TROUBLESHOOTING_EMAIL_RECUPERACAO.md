# 🔍 Troubleshooting: Email de Recuperação Não Chega

## 🎯 Diagnóstico Rápido

### 1. Verificar Console do Navegador

Abra o console (F12) e procure por:
- ✅ Mensagem de sucesso: "Email enviado com sucesso"
- ❌ Erros do Firebase
- ⚠️ Warnings

---

## 🔴 Causas Comuns

### 1. Email Não Está Cadastrado no Firebase Auth

**Sintoma:** Mensagem de erro "Usuário não encontrado"

**Como verificar:**
1. Acesse: https://console.firebase.google.com/
2. Vá em: **Authentication → Users**
3. Procure pelo email

**Solução:**
- Se não estiver lá, o usuário precisa se cadastrar primeiro
- Ou você precisa criar o usuário manualmente

---

### 2. Email Está na Pasta de Spam

**Sintoma:** Nenhum erro, mas email não aparece

**Solução:**
1. Verifique a pasta de **Spam/Lixo Eletrônico**
2. Marque como "Não é spam"
3. Adicione `noreply@perifacode-fc132.firebaseapp.com` aos contatos

---

### 3. Servidor de Email Está Lento

**Sintoma:** Email demora mais de 5 minutos

**Solução:**
- Aguarde até 10-15 minutos
- Firebase pode estar com alta demanda
- Tente novamente mais tarde

---

### 4. Configuração do Firebase Incorreta

**Sintoma:** Erro no console

**Como verificar:**
1. Acesse: https://console.firebase.google.com/
2. Vá em: **Authentication → Settings → Templates**
3. Verifique se o template "Password reset" está ativo

**Solução:**
- Ative o template se estiver desativado
- Verifique se o domínio está autorizado

---

### 5. Domínio Não Autorizado

**Sintoma:** Erro "unauthorized-domain"

**Como verificar:**
1. Acesse: https://console.firebase.google.com/
2. Vá em: **Authentication → Settings → Authorized domains**
3. Verifique se `localhost` está na lista

**Solução:**
```
Adicionar domínios autorizados:
- localhost
- 127.0.0.1
- seu-dominio.vercel.app
- seu-dominio-custom.com
```

---

### 6. Limite de Envio Atingido

**Sintoma:** Erro "too-many-requests"

**Causa:** Muitas tentativas em pouco tempo

**Solução:**
- Aguarde 15-30 minutos
- Firebase tem rate limiting para prevenir spam

---

## 🧪 Testes de Diagnóstico

### Teste 1: Verificar se Firebase Está Funcionando

```javascript
// Abra o console do navegador (F12) e execute:
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log('Auth configurado:', auth.app.name);
```

**Resultado esperado:** Nome do app Firebase

---

### Teste 2: Testar Envio Manualmente

1. Abra o console (F12)
2. Vá para a aba "Network"
3. Tente enviar o email de recuperação
4. Procure por requisições para `identitytoolkit.googleapis.com`
5. Verifique a resposta

**Resposta de sucesso:**
```json
{
  "email": "usuario@email.com"
}
```

**Resposta de erro:**
```json
{
  "error": {
    "code": 400,
    "message": "EMAIL_NOT_FOUND"
  }
}
```

---

### Teste 3: Verificar Email no Firebase Console

1. **Acesse:** https://console.firebase.google.com/
2. **Vá em:** Authentication → Users
3. **Procure** pelo email
4. **Clique** nos 3 pontos → "Reset password"
5. **Envie** manualmente

Se funcionar pelo console mas não pelo app, o problema é no código.

---

## 🔧 Soluções por Cenário

### Cenário 1: "Usuário não encontrado"

**Problema:** Email não está no Firebase Auth

**Solução:**
```bash
# Opção 1: Usuário se cadastra
/cadastro

# Opção 2: Admin cria usuário
Dashboard → Usuários → Novo Usuário
```

---

### Cenário 2: Email não chega (sem erro)

**Checklist:**
- [ ] Verificou pasta de spam?
- [ ] Aguardou 10-15 minutos?
- [ ] Email está correto (sem espaços)?
- [ ] Provedor de email não está bloqueando?

**Teste com outro email:**
- Gmail
- Outlook
- Yahoo

---

### Cenário 3: Erro "unauthorized-domain"

**Solução:**

1. **Firebase Console:**
   - Authentication → Settings → Authorized domains
   - Adicione: `localhost`, `127.0.0.1`

2. **Para produção:**
   - Adicione seu domínio Vercel
   - Adicione domínio customizado (se tiver)

---

### Cenário 4: "too-many-requests"

**Solução:**
- Aguarde 30 minutos
- Use outro email para testar
- Verifique se não há loop no código

---

## 🔍 Debug Avançado

### Ativar Logs Detalhados

Adicione no código:

```typescript
// src/views/ForgotPassword.tsx ou AdminPasswordReset.tsx

try {
  console.log('🔄 Enviando email para:', email);
  await sendPasswordResetEmail(auth, email);
  console.log('✅ Email enviado com sucesso!');
} catch (error: any) {
  console.error('❌ Erro completo:', error);
  console.error('Código:', error.code);
  console.error('Mensagem:', error.message);
}
```

---

### Verificar Configuração do Firebase

```typescript
// Adicione no console (F12):
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log('Config:', {
  apiKey: auth.config.apiKey,
  authDomain: auth.config.authDomain,
  projectId: auth.app.options.projectId
});
```

**Valores esperados:**
```
apiKey: "AIzaSyCfmYEpGNC1gTDtm-7X0OIWP3W3eQGXXYQ"
authDomain: "perifacode-fc132.firebaseapp.com"
projectId: "perifacode-fc132"
```

---

## 📧 Configurar Email Customizado (Opcional)

Para melhorar a entrega de emails:

### 1. Configurar SMTP Customizado

1. **Firebase Console:**
   - Authentication → Templates
   - Clique em "Customize email templates"
   - Configure SMTP customizado

### 2. Usar SendGrid ou Mailgun

- Melhor taxa de entrega
- Menos chance de ir para spam
- Estatísticas de envio

---

## ✅ Checklist de Verificação

### Antes de Enviar
- [ ] Email está cadastrado no Firebase Auth
- [ ] Domínio está autorizado no Firebase
- [ ] Não atingiu limite de tentativas

### Após Enviar
- [ ] Mensagem de sucesso apareceu
- [ ] Sem erros no console
- [ ] Aguardou 5-10 minutos
- [ ] Verificou pasta de spam

### Se Não Funcionar
- [ ] Testou com outro email
- [ ] Testou pelo Firebase Console
- [ ] Verificou logs do Firebase
- [ ] Verificou configuração do projeto

---

## 🆘 Ainda Não Funciona?

### Opção 1: Reset Manual pelo Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Authentication → Users
3. Encontre o usuário
4. Clique nos 3 pontos → "Reset password"

### Opção 2: Criar Novo Usuário

Se o email não está no Firebase:
1. Usuário faz novo cadastro
2. Ou admin cria usuário manualmente

### Opção 3: Verificar Status do Firebase

- https://status.firebase.google.com/
- Pode estar com problemas temporários

---

## 📊 Logs Úteis

### Firebase Console

1. **Authentication → Users**
   - Ver todos os usuários
   - Status de cada conta

2. **Authentication → Settings → Templates**
   - Ver templates de email
   - Testar envio

3. **Authentication → Settings → Authorized domains**
   - Ver domínios autorizados
   - Adicionar novos

---

## 💡 Dicas de Prevenção

### Para Usuários
- Use email válido e ativo
- Adicione remetente aos contatos
- Verifique spam regularmente

### Para Admins
- Configure domínios autorizados
- Personalize templates de email
- Monitore taxa de entrega
- Configure SMTP customizado (produção)

---

## 📞 Suporte

Se nada funcionar:

1. **Verifique Firebase Status:**
   - https://status.firebase.google.com/

2. **Suporte Firebase:**
   - https://firebase.google.com/support

3. **Documentação:**
   - https://firebase.google.com/docs/auth/web/manage-users

---

**Criado por Kiro AI Assistant**  
**Data:** 04/12/2024  
**Objetivo:** Resolver problemas de email de recuperação
