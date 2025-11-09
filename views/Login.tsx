import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';

const Login: React.FC = () => {
  const { navigate } = useAppContext();
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
        navigate('dashboard');
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
  
  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // Google sign-in successful.
        navigate('dashboard');
      }).catch((error) => {
        setError('Falha ao entrar com o Google. Tente novamente.');
        console.error(error);
      }).finally(() => {
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
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            E continue sua jornada para o futuro.
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-50 transition-all shadow-lg shadow-[#8a4add]/30"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Ou continue com</span>
            <div className="flex-grow border-t border-white/20"></div>
        </div>
        <div>
             <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="group relative w-full flex justify-center items-center gap-2 py-3 px-4 border border-white/20 text-sm font-medium rounded-md text-white bg-white/5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] transition-all"
            >
              <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 400.2 0 261.8 0 123.3 111.8 11.8 244 11.8c70.3 0 129.8 27.8 174.2 71.9l-65.7 64.3C330.5 155.6 291.6 136 244 136c-80.6 0-146.4 65.8-146.4 146.4s65.8 146.4 146.4 146.4c94.9 0 121.7-65.8 125.1-100.2H244v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
              Entrar com Google
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
