/**
 * Templates de Email para Notificações
 */

interface WelcomeEmailData {
  name: string;
  email: string;
  tempPassword: string;
  role: string;
}

interface PasswordResetData {
  name: string;
  resetLink: string;
}

interface AdminAlertData {
  memberName: string;
  memberEmail: string;
  memberRole: string;
  action: 'created' | 'updated' | 'deleted';
}

export const emailTemplates = {
  /**
   * Email de boas-vindas com credenciais
   */
  welcome: (data: WelcomeEmailData): string => {
    const roleLabel = data.role === 'instructor' ? 'Instrutor/Voluntário' : 
                      data.role === 'admin' ? 'Administrador' : 'Aluno';
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao FuturoOn</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #09090B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1f 0%, #0a0a0f 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(138, 74, 221, 0.3);">
          
          <!-- Header com Gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, #8a4add 0%, #f27983 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                🎉 Bem-vindo ao FuturoOn!
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">
                Sua conta foi criada com sucesso
              </p>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #e5e5e5; font-size: 16px; line-height: 1.6;">
                Olá <strong style="color: #8a4add;">${data.name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #a0a0a0; font-size: 15px; line-height: 1.6;">
                Sua conta como <strong style="color: #f27983;">${roleLabel}</strong> foi criada na plataforma FuturoOn. 
                Use as credenciais abaixo para fazer seu primeiro acesso:
              </p>

              <!-- Box de Credenciais -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(138, 74, 221, 0.1); border: 2px solid rgba(138, 74, 221, 0.3); border-radius: 12px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="margin: 0 0 15px 0; color: #8a4add; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                      🔐 Suas Credenciais
                    </p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #a0a0a0; font-size: 14px;">
                          <strong>Email:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #ffffff; font-size: 14px; text-align: right; font-family: 'Courier New', monospace;">
                          ${data.email}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #a0a0a0; font-size: 14px;">
                          <strong>Senha Temporária:</strong>
                        </td>
                        <td style="padding: 8px 0; color: #f27983; font-size: 16px; text-align: right; font-family: 'Courier New', monospace; font-weight: bold;">
                          ${data.tempPassword}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Alerta de Segurança -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(242, 121, 131, 0.1); border-left: 4px solid #f27983; border-radius: 8px; margin: 0 0 30px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #f27983; font-size: 14px; line-height: 1.6;">
                      ⚠️ <strong>Importante:</strong> Por segurança, você será solicitado a criar uma nova senha no primeiro acesso. 
                      Não compartilhe suas credenciais com ninguém.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Botão de Acesso -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="https://futuroon.org/login" style="display: inline-block; background: linear-gradient(135deg, #8a4add 0%, #f27983 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 30px rgba(138, 74, 221, 0.4);">
                      Acessar Plataforma →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #707070; font-size: 13px; line-height: 1.6; text-align: center;">
                Se você tiver dúvidas, entre em contato conosco em 
                <a href="mailto:contato@futuroon.org" style="color: #8a4add; text-decoration: none;">contato@futuroon.org</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a0a0f; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 10px 0; color: #707070; font-size: 12px;">
                © ${new Date().getFullYear()} FuturoOn - Instituto de Tecnologia e Educação
              </p>
              <p style="margin: 0; color: #505050; font-size: 11px;">
                Este é um email automático, por favor não responda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  },

  /**
   * Email de redefinição de senha
   */
  passwordReset: (data: PasswordResetData): string => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #09090B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a1f 0%, #0a0a0f 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(138, 74, 221, 0.3);">
          
          <tr>
            <td style="background: linear-gradient(135deg, #8a4add 0%, #f27983 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">
                🔑 Redefinir Senha
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; color: #e5e5e5; font-size: 16px; line-height: 1.6;">
                Olá <strong style="color: #8a4add;">${data.name}</strong>,
              </p>
              
              <p style="margin: 0 0 30px 0; color: #a0a0a0; font-size: 15px; line-height: 1.6;">
                Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 30px 0;">
                    <a href="${data.resetLink}" style="display: inline-block; background: linear-gradient(135deg, #8a4add 0%, #f27983 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 10px 30px rgba(138, 74, 221, 0.4);">
                      Redefinir Senha →
                    </a>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(242, 121, 131, 0.1); border-left: 4px solid #f27983; border-radius: 8px; margin: 0 0 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0; color: #f27983; font-size: 14px; line-height: 1.6;">
                      ⚠️ Se você não solicitou esta redefinição, ignore este email. Sua senha permanecerá inalterada.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #707070; font-size: 13px; line-height: 1.6;">
                Este link expira em 1 hora por segurança.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0f; padding: 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.1);">
              <p style="margin: 0 0 10px 0; color: #707070; font-size: 12px;">
                © ${new Date().getFullYear()} FuturoOn
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  },

  /**
   * Alerta para administradores
   */
  adminAlert: (data: AdminAlertData): string => {
    const actionLabel = data.action === 'created' ? 'criado' : 
                        data.action === 'updated' ? 'atualizado' : 'removido';
    const emoji = data.action === 'created' ? '✨' : 
                  data.action === 'updated' ? '📝' : '🗑️';

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Alerta de Administração</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #09090B;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #09090B; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #1a1a1f; border-radius: 12px; overflow: hidden;">
          
          <tr>
            <td style="background: linear-gradient(135deg, #8a4add 0%, #f27983 100%); padding: 30px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 24px;">
                ${emoji} Membro ${actionLabel}
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="margin: 0 0 20px 0; color: #e5e5e5; font-size: 15px;">
                Um membro da equipe foi ${actionLabel}:
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(138, 74, 221, 0.1); border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="color: #a0a0a0; font-size: 14px; padding: 5px 0;"><strong>Nome:</strong></td>
                  <td style="color: #ffffff; font-size: 14px; padding: 5px 0; text-align: right;">${data.memberName}</td>
                </tr>
                <tr>
                  <td style="color: #a0a0a0; font-size: 14px; padding: 5px 0;"><strong>Email:</strong></td>
                  <td style="color: #ffffff; font-size: 14px; padding: 5px 0; text-align: right;">${data.memberEmail}</td>
                </tr>
                <tr>
                  <td style="color: #a0a0a0; font-size: 14px; padding: 5px 0;"><strong>Tipo:</strong></td>
                  <td style="color: #8a4add; font-size: 14px; padding: 5px 0; text-align: right;">${data.memberRole}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0a0a0f; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #707070; font-size: 12px;">
                © ${new Date().getFullYear()} FuturoOn - Notificação Automática
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }
};
