# ⚡ Teste Rápido: Email de Recuperação

## 🎯 Teste em 2 Minutos

### Opção 1: Arquivo HTML de Teste

1. **Abra o arquivo:** `teste-email-recuperacao.html` no navegador
2. **Digite** um email cadastrado
3. **Clique** em "Testar Envio de Email"
4. **Veja** o resultado na tela

**Vantagens:**
- ✅ Testa diretamente o Firebase
- ✅ Mostra erros detalhados
- ✅ Não precisa rodar o projeto

---

### Opção 2: Verificar no Firebase Console

1. **Acesse:** https://console.firebase.google.com/
2. **Selecione:** perifacode-fc132
3. **Vá em:** Authentication → Users
4. **Procure** pelo email que você tentou
5. **Se não estiver lá:** O email não está cadastrado!

---

### Opção 3: Testar Manualmente pelo Console

1. **Acesse:** https://console.firebase.google.com/
2. **Vá em:** Authentication → Users
3. **Encontre** o usuário
4. **Clique** nos 3 pontos (⋮)
5. **Selecione:** "Reset password"
6. **Confirme**

Se funcionar pelo console mas não pelo app, o problema é no código.

---

## 🔍 Diagnóstico Rápido

### Pergunta 1: O email está cadastrado no Firebase?

**Como verificar:**
- Firebase Console → Authentication → Users
- Procure pelo email

**Se NÃO estiver:**
- ❌ Email não receberá recuperação
- ✅ Usuário precisa se cadastrar primeiro

---

### Pergunta 2: Apareceu mensagem de sucesso?

**Se SIM:**
- ✅ Email foi enviado
- Verifique spam
- Aguarde 10-15 minutos

**Se NÃO:**
- ❌ Houve erro
- Verifique console (F12)
- Veja mensagem de erro

---

### Pergunta 3: Qual erro apareceu?

**"Usuário não encontrado":**
- Email não está no Firebase
- Cadastre-se primeiro

**"Email inválido":**
- Formato incorreto
- Verifique digitação

**"Muitas tentativas":**
- Aguarde 30 minutos
- Firebase bloqueou temporariamente

**"Domínio não autorizado":**
- Configure no Firebase Console
- Authentication → Settings → Authorized domains

---

## ✅ Checklist Rápido

- [ ] Email está cadastrado no Firebase Auth?
- [ ] Apareceu mensagem de sucesso?
- [ ] Aguardou 10 minutos?
- [ ] Verificou pasta de spam?
- [ ] Testou com outro email?
- [ ] Verificou console do navegador (F12)?

---

## 🆘 Solução Rápida

### Se o email NÃO está cadastrado:

**Opção 1:** Cadastre-se
```
http://localhost:5173/cadastro
```

**Opção 2:** Admin cria usuário
```
Dashboard → Usuários → Novo Usuário
```

---

### Se o email ESTÁ cadastrado mas não chega:

1. **Verifique spam** (90% dos casos)
2. **Aguarde 15 minutos** (servidor pode estar lento)
3. **Tente outro email** (Gmail, Outlook)
4. **Use o Firebase Console** (reset manual)

---

## 📧 Remetente do Email

Procure por email de:
```
noreply@perifacode-fc132.firebaseapp.com
```

Adicione aos contatos para não ir para spam.

---

## 🔧 Teste Técnico

Abra o console (F12) e execute:

```javascript
// Verificar se Firebase está configurado
console.log('Firebase:', window.firebase);

// Verificar auth
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log('Auth:', auth.app.options.projectId);
```

**Resultado esperado:**
```
Auth: perifacode-fc132
```

---

**Documentação completa:** `TROUBLESHOOTING_EMAIL_RECUPERACAO.md`
