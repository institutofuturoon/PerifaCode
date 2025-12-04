import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { Logo } from '../assets/Logo';
import SEO from '../components/SEO';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Digite um email válido para receber o link de recuperação.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('✨ Email enviado com sucesso! Verifique sua caixa de entrada e spam.');
      setEmail('');
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === 'auth/user-not-found') {
        setError('Não encontramos uma conta com este email.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('O formato do email parece inválido.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else {
        setError('Erro ao enviar email. Tente novamente em instantes.');
      }
      console.error('Erro ao resetar senha:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Esqueci Minha Senha | FuturoOn"
        description="Recupere o acesso à sua conta FuturoOn. Enviaremos um link de redefinição de senha para seu email."
      />
      
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-4 py-12">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8a4add]/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <Logo className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Esqueci Minha Senha</h1>
            <p className="text-gray-400">Digite seu email para receber o link de recuperação</p>
          </div>

          {/* Card */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
            
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-400 font-semibold text-sm">{successMessage}</p>
                    <p className="text-green-400/70 text-xs mt-1">
                      Não recebeu? Verifique a pasta de spam ou tente novamente em alguns minutos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#8a4add] focus:ring-2 focus:ring-[#8a4add]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Link de Recuperação
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#09090B] text-gray-400">ou</span>
              </div>
            </div>

            {/* Back to Login */}
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-white/5 border border-white/10 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar para o Login
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Lembrou sua senha?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[#8a4add] hover:text-[#c4b5fd] font-semibold transition-colors"
              >
                Fazer login
              </button>
            </p>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-blue-400 font-semibold text-sm mb-1">Como funciona?</p>
                <ul className="text-blue-400/70 text-xs space-y-1">
                  <li>• Você receberá um email com um link seguro</li>
                  <li>• O link expira em 1 hora por segurança</li>
                  <li>• Clique no link e defina uma nova senha</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
