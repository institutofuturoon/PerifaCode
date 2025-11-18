
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
    <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] relative overflow-hidden bg-[#09090B]">
       {/* Background Elements */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[#8a4add]/10 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-[#f27983]/5 rounded-full blur-3xl mix-blend-screen"></div>
        </div>

      <div className="w-full max-w-[380px] z-10 p-4">
        <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 pt-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="transform scale-90 origin-center mb-4 opacity-90">
                         <Logo />
                    </div>
                    <h2 className="text-lg font-bold text-white">Bem-vindo de volta!</h2>
                    <p className="text-[11px] text-gray-400 mt-1">Acesse sua conta para continuar aprendendo.</p>
                </div>

                <form className="space-y-4" onSubmit={handleEmailLogin}>
                    <div className="space-y-3">
                         <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#8a4add]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-[#8a4add] focus:border-[#8a4add] focus:bg-white/10 text-xs transition duration-200 ease-in-out"
                                    placeholder="Seu email"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Senha</label>
                             <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-[#8a4add]">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-lg bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-1 focus:ring-[#8a4add] focus:border-[#8a4add] focus:bg-white/10 text-xs transition duration-200 ease-in-out"
                                    placeholder="Sua senha"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-[10px] text-red-300 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 animate-fade-in">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2.5 px-4 border border-transparent text-xs font-bold rounded-lg text-white bg-gradient-to-r from-[#6d28d9] to-[#8a4add] hover:from-[#5b21b6] hover:to-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-50 transition-all shadow-lg shadow-[#8a4add]/20 mt-2"
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>Entrando...</span>
                            </div>
                        ) : 'Entrar'}
                    </button>
                </form>
            </div>
            <div className="px-8 py-3.5 bg-white/5 border-t border-white/5 text-center">
                 <p className="text-[10px] text-gray-400">
                    Não tem conta?{' '}
                    <button onClick={() => navigate('/register')} className="font-semibold text-[#c4b5fd] hover:text-white transition-colors">
                        Cadastre-se
                    </button>
                </p>
            </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-6 text-center flex justify-center gap-6 text-[9px] text-gray-600">
            <button onClick={() => navigate('/')} className="hover:text-gray-400 transition-colors">Voltar para Home</button>
            <button className="hover:text-gray-400 transition-colors">Esqueceu a senha?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
