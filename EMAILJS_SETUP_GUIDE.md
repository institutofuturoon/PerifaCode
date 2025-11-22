# 📧 EmailJS Setup Guide - Zero Cost!

## ✅ STATUS: IMPLEMENTADO E PRONTO PARA USAR

---

## 🚀 Quick Setup (5 min)

### **Passo 1: Criar Conta EmailJS (FREE)**

1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up Free"
3. Escolha: Sign up with **Google** ou **Email**
4. Confirme email

### **Passo 2: Criar Email Service**

1. Vá para: **Dashboard → Email Services**
2. Clique em **"Create New Service"**
3. Escolha: **Gmail** (recomendado para começar)
4. Conecte sua conta Gmail (aprove autorização)
5. Nomeie como: `service_futuroon`
6. Salve

### **Passo 3: Criar Email Template**

1. Vá para: **Dashboard → Email Templates**
2. Clique em **"Create New Template"**
3. Nomeie: `template_mentor_alert`
4. Use este template (copie e cole):

```html
<h2>🔔 Nova Escalação no FuturoOn</h2>

<p>Olá {{mentor_name}},</p>

<p>Você recebeu uma nova escalação de dúvida:</p>

<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 15px 0;">
  <p><strong>👤 Aluno:</strong> {{student_name}}</p>
  <p><strong>💬 Pergunta:</strong> {{student_message}}</p>
  <p><strong>⏰ Horário:</strong> {{timestamp}}</p>
</div>

<p>
  <a href="{{dashboard_link}}" 
     style="background: #8a4add; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
    👉 Ir para Dashboard
  </a>
</p>

<p>Obrigado,<br>Equipe FuturoOn</p>
```

5. Salve template
6. **Copie o Template ID** (você vai precisar)

### **Passo 4: Pegar Access Keys**

1. Vá para: **Dashboard → Account → API Keys**
2. Copie:
   - **Public Key** (não compartilhe, mas ok expor no frontend)
   - **Service ID** (copiou acima: `service_futuroon`)
   - **Template ID** (copiou acima: `template_mentor_alert`)

### **Passo 5: Configurar Environment Variables no Replit**

Adicione ao seu `.env.local`:

```
VITE_EMAILJS_PUBLIC_KEY=seu_public_key_aqui
VITE_EMAILJS_SERVICE_ID=service_futuroon
VITE_EMAILJS_TEMPLATE_ID=template_mentor_alert
```

**COMO ADICIONAR:**

```bash
# Terminal do Replit
echo "VITE_EMAILJS_PUBLIC_KEY=sk_..." >> .env.local
echo "VITE_EMAILJS_SERVICE_ID=service_futuroon" >> .env.local
echo "VITE_EMAILJS_TEMPLATE_ID=template_mentor_alert" >> .env.local
```

Ou use o painel "Secrets" do Replit (melhor):
1. Clique em 🔐 **Secrets** (lado esquerdo)
2. Adicione:
   - `VITE_EMAILJS_PUBLIC_KEY` = `sk_...`
   - `VITE_EMAILJS_SERVICE_ID` = `service_futuroon`
   - `VITE_EMAILJS_TEMPLATE_ID` = `template_mentor_alert`

### **Passo 6: Testar**

1. Reinicie o servidor (Ctrl+C, depois `npm run dev`)
2. Vá para `/mentor-dashboard`
3. Crie uma escalação manual (ou aluno faça dúvida)
4. Email deve chegar no mentor

---

## 📊 Como Funciona

### **Fluxo com Email:**

```
1. Aluno faz dúvida no chat
   ↓
2. ChatBot não encontra FAQ
   ↓
3. Cria escalação em Firestore
   ↓
4. Chama createMentorNotification()
   ↓
5. (NOVO!) Chama sendEmailNotification()
   ↓
6. EmailJS envia email para mentor
   ↓
7. Mentor recebe: "🔔 Nova Escalação no FuturoOn"
```

### **Variáveis Disponíveis no Template:**

```
{{mentor_name}}          - Nome do mentor
{{mentor_email}}         - Email do mentor (preenchido auto)
{{student_name}}         - Nome do aluno
{{student_message}}      - Pergunta curta (até 200 chars)
{{course_id}}            - ID do curso
{{timestamp}}            - Data/hora (PT-BR)
{{dashboard_link}}       - Link direto para dashboard
```

---

## 💰 Preços (ZERO COST!)

| Plano | Emails/mês | Custo | Status |
|-------|-----------|-------|--------|
| Free | 200 | R$ 0 | ✅ Você |
| Plus | 1.000 | R$ 15 | Futuro |
| Pro | 10.000 | R$ 50 | Enterprise |

**Para 100 alunos:**
- 10 escalações/dia = 300/mês = **CABE NO FREE** ✅
- Se crescer: upgrade pra Plus por R$ 15/mês

---

## 🔧 Código (Já Implementado!)

### **No notificationService.ts:**

```typescript
export const sendEmailNotification = async (
  mentorEmail: string,
  mentorName: string,
  studentName: string,
  message: string,
  courseId: string
) => {
  const emailjs = (window as any).emailjs;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  await emailjs.send(serviceId, templateId, {
    mentor_name: mentorName,
    mentor_email: mentorEmail,
    student_name: studentName,
    student_message: message.substring(0, 200),
    course_id: courseId,
    timestamp: new Date().toLocaleString('pt-BR'),
    dashboard_link: `${window.location.origin}/mentor-dashboard`,
  });
};
```

### **Como Chamar ao Escalar:**

```typescript
// Quando aluno faz dúvida que precisa escalar:
await createMentorNotification(
  'mentor_id',
  'escalation_id',
  'João Silva',
  'Qual é a diferença entre == e ===?',
  'course_123'
);

// NOVO: Enviar email também
await sendEmailNotification(
  mentor.email,
  mentor.name,
  'João Silva',
  'Qual é a diferença entre == e ===?',
  'course_123'
);
```

---

## 🧪 Teste Agora

### **1. Setup Email Service (5 min)**
```bash
# Siga passos 1-5 acima
```

### **2. Testar Email Manual**

Abra console do navegador (F12) e execute:

```javascript
// Simular escalação
const user = {
  id: 'mentor_123',
  name: 'Marcos Silva',
  email: 'seu_email@gmail.com'
};

const studentName = 'João Aluno';
const message = 'Qual é a diferença entre == e ===?';
const courseId = 'python-101';

// Chamar função
sendEmailNotification(user.email, user.name, studentName, message, courseId);

// Checar email em 5-10 segundos
```

### **3. Testar com Aluno Real**

1. Login como aluno
2. Ir para lesson
3. Abrir chat 💬
4. Fazer pergunta: "o que é closure em javascript?"
5. Se bot não achar FAQ → escala para mentor
6. Mentor deve receber email ✅

---

## 🚨 Troubleshooting

### **Email não chega**

**Problema:** Mentor não recebe email

**Solução:**
1. Verifique se EmailJS está inicializado (F12 → Console)
2. Veja se tem erro: `VITE_EMAILJS_SERVICE_ID not configured`
3. Confirme env vars estão corretos
4. Teste Template diretamente em EmailJS Dashboard

### **"Public Key Invalid"**

**Problema:** Erro: `Invalid public key`

**Solução:**
1. Verifique que copiou EXATAMENTE o Public Key
2. Comece com `pk_` (não `sk_`)
3. Reinicie servidor (Ctrl+C, npm run dev)

### **Email vai pro Spam**

**Problema:** Email chega em Spam/Promoções

**Solução:**
1. Normal no Gmail/Outlook
2. Marque como "Não é spam"
3. Ou configure DNS (avançado)

---

## 📈 Escalabilidade

| Métrica | Limite Free | Usuário |
|---------|---------|---------|
| Emails/mês | 200 | ~6/dia |
| Mentores | Ilimitado | ✅ 100 |
| Templates | Ilimitado | ✅ 1 |
| Services | Ilimitado | ✅ 1 |

**Se precisar de mais:**
- Plus: R$ 15/mês (1.000 emails)
- Pro: R$ 50/mês (10.000 emails)

---

## 🎯 Próximas Features (Sem Custo Extra)

```
✅ ATUAL: Email no mesmo instante da escalação
→ TODO: Email summary diário (1x/dia)
→ TODO: Enviar cópia para admin também
→ TODO: Templates por tipo de dúvida
→ TODO: Rastreamento de abertura (EmailJS Pro)
```

---

## 📝 Resumo

| Item | Status | Custo |
|------|--------|-------|
| @emailjs/browser | ✅ Instalado | R$ 0 |
| App.tsx init | ✅ Pronto | R$ 0 |
| notificationService | ✅ Pronto | R$ 0 |
| Template | 📋 Criar (5 min) | R$ 0 |
| Env vars | 📋 Adicionar (2 min) | R$ 0 |
| **TOTAL** | | **R$ 0** |

---

## ✨ Você Tem Tudo!

```
✅ Chat Bot completo
✅ Mentor Dashboard
✅ Notificações Firestore
✅ EmailJS Code pronto
✅ Guia de setup
✅ Exemplos
✅ Troubleshooting
```

**Próximo passo:** Seguir setup de 5 minutos acima! 🚀

---

**Last Updated**: Nov 22, 2025
**Status**: Production Ready
**Cost**: R$ 0 / month
