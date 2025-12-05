/**
 * Serviço de Email
 * Facilita o envio de notificações por email
 */

import { emailTemplates } from '../utils/emailTemplates';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  type: 'welcome' | 'password-reset' | 'admin-alert';
}

export const emailService = {
  /**
   * Envia email de boas-vindas com credenciais
   */
  async sendWelcomeEmail(data: {
    name: string;
    email: string;
    tempPassword: string;
    role: string;
  }): Promise<boolean> {
    try {
      const html = emailTemplates.welcome(data);
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.email,
          subject: '🎉 Bem-vindo ao FuturoOn - Suas Credenciais de Acesso',
          html,
          type: 'welcome',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao enviar email de boas-vindas:', error);
        return false;
      }

      console.log('✅ Email de boas-vindas enviado para:', data.email);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
      return false;
    }
  },

  /**
   * Envia email de redefinição de senha
   */
  async sendPasswordResetEmail(data: {
    name: string;
    email: string;
    resetLink: string;
  }): Promise<boolean> {
    try {
      const html = emailTemplates.passwordReset({
        name: data.name,
        resetLink: data.resetLink,
      });
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.email,
          subject: '🔑 Redefinição de Senha - FuturoOn',
          html,
          type: 'password-reset',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao enviar email de redefinição:', error);
        return false;
      }

      console.log('✅ Email de redefinição enviado para:', data.email);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      return false;
    }
  },

  /**
   * Envia alerta para administradores
   */
  async sendAdminAlert(data: {
    adminEmail: string;
    memberName: string;
    memberEmail: string;
    memberRole: string;
    action: 'created' | 'updated' | 'deleted';
  }): Promise<boolean> {
    try {
      const html = emailTemplates.adminAlert({
        memberName: data.memberName,
        memberEmail: data.memberEmail,
        memberRole: data.memberRole,
        action: data.action,
      });
      
      const actionLabel = data.action === 'created' ? 'Criado' : 
                          data.action === 'updated' ? 'Atualizado' : 'Removido';
      
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.adminEmail,
          subject: `🔔 Membro ${actionLabel}: ${data.memberName}`,
          html,
          type: 'admin-alert',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Erro ao enviar alerta para admin:', error);
        return false;
      }

      console.log('✅ Alerta enviado para admin:', data.adminEmail);
      return true;
    } catch (error) {
      console.error('Erro ao enviar alerta para admin:', error);
      return false;
    }
  },
};
