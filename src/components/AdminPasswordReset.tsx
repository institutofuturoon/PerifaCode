import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

interface AdminPasswordResetProps {
  userEmail: string;
  userName: string;
  onSuccess?: () => void;
}

const AdminPasswordReset: React.FC<AdminPasswordResetProps> = ({ userEmail, userName, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!userEmail) {
      setError('Email do usuário não encontrado.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendPasswordResetEmail(auth, userEmail);
      setSuccess(true);
      
      // Fechar modal após 3 segundos
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        if (onSuccess) onSuccess();
      }, 3000);
    } catch (error: any) {
      const errorCode = error.code;
      if (errorCode === 'auth/user-not-found') {
        setError('Usuário não encontrado no sistema de autenticação.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Email inválido.');
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Muitas tentativas. Aguarde alguns minutos.');
      } else {
        setError('Erro ao enviar email. Tente novamente.');
      }
      console.error('Erro ao resetar senha:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botão para abrir modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-all text-sm font-semibold"
        title="Enviar email de redefinição de senha"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Resetar Senha
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#18181B] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Resetar Senha</h3>
                <p className="text-sm text-gray-400">
                  Enviar email de recuperação para <strong className="text-white">{userName}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-green-400 font-semibold text-sm">Email enviado com sucesso!</p>
                    <p className="text-green-400/70 text-xs mt-1">
                      O usuário receberá um link para redefinir a senha.
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

            {/* Info */}
            {!success && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-400 font-semibold text-sm mb-2">O que vai acontecer:</p>
                    <ul className="text-blue-400/70 text-xs space-y-1">
                      <li>• Email será enviado para: <strong className="text-blue-300">{userEmail}</strong></li>
                      <li>• O usuário receberá um link seguro</li>
                      <li>• O link expira em 1 hora</li>
                      <li>• O usuário poderá definir uma nova senha</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {!success && (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Enviar Email
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPasswordReset;
