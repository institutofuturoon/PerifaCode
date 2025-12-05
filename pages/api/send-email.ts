/**
 * API Route para envio de emails
 * Usa Resend para enviar notificações
 */

export const runtime = 'edge';

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type: 'welcome' | 'password-reset' | 'admin-alert';
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as EmailRequest;
    const { to, subject, html, type } = body;

    // Validações
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: to, subject, html' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se o token do Resend está configurado
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('RESEND_API_KEY não configurado');
      return new Response(
        JSON.stringify({ error: 'Serviço de email não configurado' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'FuturoOn <noreply@futuroon.org>',
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar email:', errorData);
      return new Response(
        JSON.stringify({ error: 'Falha ao enviar email', details: errorData }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`✅ Email ${type} enviado para ${to}`);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Erro na API de email:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
