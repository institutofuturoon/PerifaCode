import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Logo } from '../assets/Logo';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully, the onAuthStateChanged listener in App.tsx will handle the rest.
        navigate('/dashboard');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          setError('Email ou senha inválidos.');
        } else {
          setError('Ocorreu um erro. Tente novamente.');
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12 px-4 sm:px-6 lg:px-8 aurora-background">
      <div className="max-w-md w-full space-y-8 bg-black/20 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <div className="flex justify-center">
            <Logo />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Bem-vindo(a) de volta!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Insira seus dados para acessar a plataforma.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-t-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Seu email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-b-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Sua senha"
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
         <p className="mt-8 text-center text-sm text-gray-400">
          Ainda não tem uma conta?{' '}
          <button onClick={() => navigate('/register')} className="font-medium text-[#c4b5fd] hover:text-[#8a4add] hover:underline">
            Cadastre-se aqui
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;