# ⚡ EmailJS - Quick Start (5 Minutos)

## VOCÊ ESTÁ AQUI 👇

```
❌ Instalação    (FEITA ✅)
❌ Código        (FEITO ✅)
→  AGORA: Setup no EmailJS (5 min)
❌ Adicionar Secrets (2 min)
❌ Testar (3 min)
```

---

## 🚀 Siga Isso Linha por Linha

### **PASSO 1: Criar Conta (1 min)**

1. Abra: https://www.emailjs.com/
2. Clique **"Sign Up Free"**
3. Use **Google** (mais rápido)
4. Confirme email (chegará rapidinho)

### **PASSO 2: Email Service (1 min)**

1. No dashboard, vá para **"Email Services"** (left menu)
2. Clique **"Create New Service"**
3. Escolha **"Gmail"**
4. Clique em **"Connect Gmail"**
5. Aprove a janela de autorização (Google)
6. Nome: `service_futuroon` (EXATO)
7. Salve

**Você agora tem:**
- Service ID: `service_futuroon` ✅

### **PASSO 3: Email Template (2 min)**

1. Vá para **"Email Templates"** (left menu)
2. Clique **"Create New Template"**
3. Nome: `template_mentor_alert` (EXATO)
4. **Clique em "Edit Code"** (canto superior direito)
5. Cole isto (limpando tudo antes):

```html
<h2>🔔 Nova Escalação no FuturoOn</h2>

<p>Olá {{mentor_name}},</p>

<p><strong>Você recebeu uma dúvida de aluno:</strong></p>

<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <p>👤 <strong>Aluno:</strong> {{student_name}}</p>
  <p>💬 <strong>Pergunta:</strong> {{student_message}}</p>
  <p>⏰ <strong>Quando:</strong> {{timestamp}}</p>
</div>

<p>
  <a href="{{dashboard_link}}" 
     style="background: #8a4add; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
    👉 Ir para Dashboard
  </a>
</p>

<p style="color: #999; font-size: 12px;">
  Respondido em: {{timestamp}}<br>
  Plataforma FuturoOn
</p>
```

6. **Salve** (botão azul em cima)

**Você agora tem:**
- Template ID: `template_mentor_alert` ✅

### **PASSO 4: Pegar Chaves (1 min)**

1. No menu, vá para **"Account"** → **"API Keys"**
2. Copie o **Public Key** (começa com `pk_`)
3. Guarde num bloco de notas por enquanto

**Você agora tem:**
- Public Key: `pk_...sua_chave...` ✅

---

## 🔐 PASSO 5: Adicionar ao Replit (2 min)

### **OPÇÃO A: Via Replit UI (RECOMENDADO)**

1. Abra seu Replit
2. Clique em 🔐 **"Secrets"** (lado esquerdo)
3. **Adicione 3 secrets:**

```
VITE_EMAILJS_PUBLIC_KEY = pk_...aqui sua chave...
VITE_EMAILJS_SERVICE_ID = service_futuroon
VITE_EMAILJS_TEMPLATE_ID = template_mentor_alert
```

4. Pressione Enter após cada um
5. Pronto ✅

### **OPÇÃO B: Via Terminal**

```bash
# Terminal do Replit
echo "VITE_EMAILJS_PUBLIC_KEY=pk_...sua_chave..." >> .env.local
echo "VITE_EMAILJS_SERVICE_ID=service_futuroon" >> .env.local
echo "VITE_EMAILJS_TEMPLATE_ID=template_mentor_alert" >> .env.local
```

---

## 🧪 PASSO 6: Testar (3 min)

1. Reinicie o servidor:
   - Ctrl+C para parar
   - `npm run dev` para iniciar

2. Abra seu app em: http://localhost:5000/mentor-dashboard

3. Em outra aba, abra como **ALUNO**:
   - Login: aluno@test.com / password
   - Vá para um curso
   - Clique em aula qualquer
   - Abra chat (💬 botão)

4. Faça uma pergunta que NÃO tenha resposta:
   - "Qual é a diferença entre var, let e const?"
   - Bot tentará responder
   - Não achará FAQ
   - Escalará para mentor

5. Volte pra aba do MENTOR:
   - Vá para /mentor-dashboard
   - Deve aparecer nova notificação
   - **EMAIL DEVE CHEGAR NA SUA CONTA GMAIL EM 5-10 SEG**

6. **SUCESSO!** ✅

---

## 🎉 Pronto!

```
✅ Conta criada
✅ Service configurado
✅ Template criado
✅ Chaves copiadas
✅ Secrets adicionados
✅ Testado
✅ EMAIL FUNCIONANDO!
```

---

## 🚨 Se Não Funcionar

### **Email não chega?**

```bash
# No browser console (F12), execute:
console.log(window.emailjs)  # Deve mostrar um objeto

# Procure por erros tipo:
# ❌ VITE_EMAILJS_PUBLIC_KEY not configured
# ❌ Invalid Service ID
```

**Soluções:**
1. Reinicie o servidor
2. Verifique Secrets (nenhum espaço extra)
3. Confirme nomes exatos: `service_futuroon`, `template_mentor_alert`

### **Dúvidas na Template?**

Vá para EmailJS Dashboard → Email Templates → `template_mentor_alert` → Edit → compare com acima

---

## 🎁 Você Tem Agora

```
✅ Chat Bot automático (FAQ)
✅ Escalações para mentores
✅ Notificações em tempo real
✅ EMAILS para mentores
✅ Sistema de feedback
✅ Dashboard profissional
✅ TUDO ZERO CUSTO
```

---

## ⏭️ Próximo

1. **Expandir FAQ** de 8 para 20+ respostas
2. **Testar com 5 alunos reais**
3. **Coletar feedback** de escalações
4. **Deploy na produção** quando estável

---

**Tempo total**: ~15 minutos
**Custo**: R$ 0
**Status**: Production Ready ✅

---

🚀 **Dúvidas?** Consulte:
- EMAILJS_SETUP_GUIDE.md (detalhado)
- NOTIFICATIONS_SETUP.md (sistema completo)
- EMAILJS_FINAL_SUMMARY.md (overview)
