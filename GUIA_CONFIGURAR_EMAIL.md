# 📧 Guia de Configuração do Sistema de Emails

Este guia explica como configurar o sistema de notificações por email usando Resend.

## 🎯 O que o Sistema Faz

O sistema envia emails automaticamente em 3 situações:

1. **Email de Boas-Vindas** 🎉
   - Enviado quando um novo membro é criado
   - Contém as credenciais de acesso (email e senha temporária)
   - Instruções para primeiro acesso

2. **Email de Redefinição de Senha** 🔑
   - Enviado quando admin solicita reset de senha
   - Contém link para criar nova senha
   - Link expira em 1 hora

3. **Alertas para Administradores** 🔔
   - Notifica quando membros são criados/atualizados/removidos
   - Mantém admins informados sobre mudanças na equipe

## 📋 Pré-requisitos

- Conta no Resend (gratuita)
- Domínio verificado (ou usar domínio de teste do Resend)

## 🚀 Passo a Passo

### 1. Criar Conta no Resend

1. Acesse: https://resend.com/signup
2. Crie sua conta (gratuita)
3. Confirme seu email

### 2. Obter API Key

1. Faça login no Resend
2. Vá em **API Keys** no menu lateral
3. Clique em **Create API Key**
4. Dê um nome (ex: "FuturoOn Production")
5. Copie a chave gerada (começa com `re_`)

### 3. Configurar no Projeto

#### Desenvolvimento Local:

Adicione no arquivo `.env.local`:

```bash
RESEND_API_KEY=re_sua_chave_aqui
```

#### Produção (Vercel):

1. Acesse seu projeto no Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   - **Name**: `RESEND_API_KEY`
   - **Value**: `re_sua_chave_aqui`
   - **Environment**: Production, Preview, Development
4. Clique em **Save**
5. Faça redeploy do projeto

### 4. Verificar Domínio (Opcional mas Recomendado)

Para enviar emails do seu próprio domínio:

1. No Resend, vá em **Domains**
2. Clique em **Add Domain**
3. Digite seu domínio (ex: `futuroon.org`)
4. Adicione os registros DNS fornecidos:
   - SPF
   - DKIM
   - DMARC
5. Aguarde verificação (pode levar até 72h)

**Enquanto não verificar:** Use o domínio de teste do Resend (`onboarding@resend.dev`)

### 5. Atualizar Email Remetente

Se você verificou seu domínio, atualize o email remetente em:

`pages/api/send-email.ts` (linha 48):

```typescript
from: 'FuturoOn <noreply@futuroon.org>', // Seu domínio verificado
```

## 🧪 Testar o Sistema

### Teste 1: Email de Boas-Vindas

1. Acesse o painel admin
2. Vá em **Equipe & Voluntários**
3. Clique em **Novo Membro**
4. Preencha os dados:
   - Nome: Teste Email
   - Email: seu-email@gmail.com (use seu email real)
   - Senha: teste123
5. Clique em **Criar Membro**
6. Verifique sua caixa de entrada

### Teste 2: Redefinição de Senha

1. Edite um membro existente
2. Clique em **Redefinir Senha**
3. Verifique o email

### Teste 3: Verificar Logs

Abra o console do navegador (F12) e procure por:
- `✅ Email de boas-vindas enviado para: ...`
- `❌ Erro ao enviar email: ...`

## 📊 Limites do Plano Gratuito

O Resend oferece gratuitamente:
- ✅ 100 emails/dia
- ✅ 3.000 emails/mês
- ✅ Domínio de teste incluído
- ✅ API completa

Para mais, veja os planos pagos: https://resend.com/pricing

## 🎨 Personalizar Templates

Os templates de email estão em:
`src/utils/emailTemplates.ts`

Você pode personalizar:
- Cores
- Textos
- Layout
- Adicionar logo
- Adicionar links

## 🔧 Troubleshooting

### Email não está sendo enviado

1. **Verifique a API Key**
   ```bash
   # No terminal
   echo $RESEND_API_KEY
   ```

2. **Verifique os logs**
   - Console do navegador (F12)
   - Logs do Vercel (se em produção)

3. **Teste a API diretamente**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer re_sua_chave" \
     -H "Content-Type: application/json" \
     -d '{"from":"onboarding@resend.dev","to":"seu@email.com","subject":"Teste","html":"<p>Teste</p>"}'
   ```

### Email vai para spam

1. Verifique seu domínio no Resend
2. Configure SPF, DKIM e DMARC
3. Evite palavras como "grátis", "promoção" no assunto
4. Peça aos usuários para adicionar seu email aos contatos

### Erro "Domain not verified"

- Use `onboarding@resend.dev` enquanto não verificar
- Ou aguarde até 72h para verificação do domínio

## 📝 Próximos Passos

Após configurar:

1. ✅ Teste todos os tipos de email
2. ✅ Personalize os templates
3. ✅ Configure alertas para admins
4. ✅ Monitore o uso no dashboard do Resend
5. ✅ Considere upgrade se precisar de mais emails

## 🆘 Suporte

- Documentação Resend: https://resend.com/docs
- Suporte Resend: support@resend.com
- Issues do projeto: GitHub Issues

---

**Importante:** Nunca commite a `RESEND_API_KEY` no Git! Ela deve estar apenas no `.env.local` (que está no `.gitignore`).
