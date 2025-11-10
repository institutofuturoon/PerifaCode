import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAppContext } from '../App';
import { Logo } from '../assets/Logo';

const ChangePassword = () => {
  const { user, handleUpdateUserProfile, navigate, showToast } = useAppContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!auth.currentUser) {
      setError('Usuário não autenticado. Por favor, faça login novamente.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await updatePassword(auth.currentUser, newPassword);
      
      // Password updated in Auth, now update Firestore flag
      if (user) {
        await handleUpdateUserProfile({ ...user, mustChangePassword: false });
      }
      
      showToast('✅ Senha atualizada com sucesso!');
      navigate('dashboard');

    } catch (error: any) {
      console.error("Password change error:", error);
      if (error.code === 'auth/weak-password') {
        setError('A nova senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Ocorreu um erro ao atualizar a senha. Tente fazer login novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 aurora-background">
      <div className="max-w-md w-full space-y-8 bg-black/20 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <div className="flex justify-center">
            <Logo />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Atualize sua senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Por segurança, você precisa criar uma nova senha para continuar.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="new-password" className="sr-only">Nova Senha</label>
              <input
                id="new-password"
                name="new-password"
                type="password"
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Digite a nova senha"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirme a Nova Senha</label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Confirme a nova senha"
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-sm text-red-300 bg-red-500/10 p-3 rounded-md border border-red-500/20">
                {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-gradient-to-r from-[#6d28d9] to-[#8a4add] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-50 transition-all shadow-lg shadow-[#8a4add]/30"
            >
              {loading ? 'Atualizando...' : 'Salvar e Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;