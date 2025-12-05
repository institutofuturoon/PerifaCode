
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // UX: Toggle visibility
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [greeting, setGreeting] = useState('Olá');

  // UX: Smart Greeting based on time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Bom dia');
    else if (hour >= 12 && hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Por favor, insira um email válido.');
        return;
    }

    setLoading(true);
    setError(null);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate('/painel');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
          setError('Email ou senha incorretos. Verifique e tente novamente.');
        } else if (errorCode === 'auth/too-many-requests') {
          setError('Muitas tentativas. Por segurança, aguarde alguns instantes.');
        } else {
          setError('Ocorreu um erro inesperado. Tente novamente.');
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Digite um email válido para receber o link de recuperação.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setSuccessMessage('✨ Email enviado! Verifique sua caixa de entrada e spam.');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/user-not-found') {
          setError('Não encontramos uma conta com este email.');
        } else if (errorCode === 'auth/invalid-email') {
          setError('O formato do email parece inválido.');
        } else {
          setError('Erro ao enviar. Tente novamente em instantes.');
        }
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggleMode = () => {
    setIsResetMode(!isResetMode);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-[#09090B] px-4 pt-20 pb-12">
       {/* Background Elements (Aurora Effect) */}
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#8a4add]/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#f27983]/10 rounded-full blur-[100px] mix-blend-screen"></div>
        </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/5 transition-all duration-300">
            <div className="p-8 sm:p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="transform scale-100 origin-center mb-6 opacity-100 hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigate('/')}>
                         <Logo />
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                      {isResetMode ? 'Recuperar Acesso' : `${greeting}, Dev!`}
                    </h2>
                    <p className="text-sm text-gray-400 text-center max-w-xs leading-relaxed">
                      {isResetMode 
                        ? 'Vamos te enviar um link mágico para redefinir sua senha.' 
                        : 'O futuro da tecnologia espera por você. Entre para continuar.'}
                    </p>
                </div>

                {!isResetMode ? (
                  /* LOGIN FORM */
                  <form className="space-y-5" onSubmit={handleEmailLogin}>
                      <div className="space-y-4">
                          <div>
                              <label htmlFor="email" className="sr-only">Email</label>
                              <div className="relative group">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#8a4add] transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                  </div>
                                  <input
                                      id="email"
                                      name="email"
                                      type="email"
                                      autoComplete="email"
                                      required
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}
                                      className="block w-full pl-11 pr-4 py-4 border border-white/10 rounded-xl bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add]/50 focus:border-[#8a4add] focus:bg-black/40 text-sm transition-all duration-200"
                                      placeholder="seu@email.com"
                                  />
                              </div>
                          </div>
                          <div>
                              <label htmlFor="password" className="sr-only">Senha</label>
                              <div className="relative group">
                                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#8a4add] transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                  </div>
                                  <input
                                      id="password"
                                      name="password"
                                      type={showPassword ? "text" : "password"}
                                      autoComplete="current-password"
                                      required
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}
                                      className="block w-full pl-11 pr-12 py-4 border border-white/10 rounded-xl bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add]/50 focus:border-[#8a4add] focus:bg-black/40 text-sm transition-all duration-200"
                                      placeholder="Sua senha"
                                  />
                                  {/* Password Visibility Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                  >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                  </button>
                              </div>
                          </div>
                      </div>

                      {error && (
                          <div className="flex items-center gap-3 text-sm text-red-300 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-shake">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              {error}
                          </div>
                      )}

                      <div className="flex items-center justify-end">
                          <button 
                            type="button"
                            onClick={() => navigate('/esqueci-senha')} 
                            className="text-xs font-semibold text-gray-400 hover:text-[#c4b5fd] transition-colors"
                          >
                            Esqueceu a senha?
                          </button>
                      </div>

                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#8a4add] to-[#f27983] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-[0_0_30px_-10px_rgba(138,74,221,0.5)] hover:shadow-[0_0_40px_-10px_rgba(138,74,221,0.7)] transform hover:-translate-y-0.5"
                      >
                          {loading ? (
                              <div className="flex items-center gap-2">
                                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                  <span>Acessando...</span>
                              </div>
                          ) : 'Entrar na Plataforma'}
                      </button>
                  </form>
                ) : (
                  /* RESET PASSWORD FORM */
                  <form className="space-y-6" onSubmit={handleResetPassword}>
                      <div>
                          <label htmlFor="reset-email" className="sr-only">Email</label>
                          <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#8a4add] transition-colors">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                              </div>
                              <input
                                  id="reset-email"
                                  name="email"
                                  type="email"
                                  autoComplete="email"
                                  required
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="block w-full pl-11 pr-4 py-4 border border-white/10 rounded-xl bg-white/5 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] focus:bg-black/40 text-sm transition duration-200 ease-in-out"
                                  placeholder="Digite seu email cadastrado"
                              />
                          </div>
                      </div>

                      {error && (
                          <div className="flex items-center gap-3 text-sm text-red-300 bg-red-500/10 p-4 rounded-xl border border-red-500/20 animate-fade-in">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                              {error}
                          </div>
                      )}

                      {successMessage && (
                          <div className="flex items-center gap-3 text-sm text-green-300 bg-green-500/10 p-4 rounded-xl border border-green-500/20 animate-fade-in">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                              {successMessage}
                          </div>
                      )}

                      <button
                          type="submit"
                          disabled={loading || !!successMessage}
                          className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 border-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                      >
                          {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                      </button>
                  </form>
                )}
            </div>
            <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 text-center">
                {!isResetMode ? (
                    <p className="text-sm text-gray-400">
                        Ainda não faz parte?{' '}
                        <button onClick={() => navigate('/cadastro')} className="font-bold text-[#c4b5fd] hover:text-white transition-colors ml-1">
                            Inscreva-se gratuitamente
                        </button>
                    </p>
                ) : (
                    <button onClick={toggleMode} className="text-sm font-bold text-[#c4b5fd] hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                        &larr; Voltar para o Login
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
