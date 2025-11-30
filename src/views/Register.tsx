
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';
import { Logo } from '../assets/Logo';
import { User } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Check password match in real-time
  useEffect(() => {
      setPasswordsMatch(password === confirmPassword || confirmPassword === '');
  }, [password, confirmPassword]);

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return Math.min(score, 4);
  };

  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-yellow-500';
    if (passwordStrength >= 3) return 'bg-green-500';
    return 'bg-gray-700';
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
        setError('Você precisa aceitar os Termos de Uso para continuar.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Por favor, insira um email válido.');
        return;
    }

    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError(null);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const firebaseUser = userCredential.user;
        
        await updateProfile(firebaseUser, {
          displayName: name,
          photoURL: `https://picsum.photos/seed/${firebaseUser.uid}/200`,
        });

        const newUser: User = {
          id: firebaseUser.uid,
          name: name,
          email: firebaseUser.email || "",
          avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
          bio: 'Entusiasta de tecnologia pronto para aprender!',
          role: 'student',
          profileStatus: 'incomplete', 
          completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
          hasCompletedOnboardingTour: false,
          accountStatus: 'active'
        };

        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        
        navigate('/painel');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          setError('Este email já está em uso. Tente fazer login.');
        } else if (errorCode === 'auth/weak-password') {
          setError('A senha é muito fraca.');
        } else {
          console.error("Registration Error:", error);
          setError('Ocorreu um erro ao criar a conta. Tente novamente.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 aurora-background md:pt-32">
      <div className="max-w-md w-full space-y-8 bg-black/20 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <div className="flex justify-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Comece sua jornada
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Crie sua conta para ter acesso aos cursos e à comunidade.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Nome Completo</label>
              <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Seu nome completo" />
            </div>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Seu melhor email" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Crie uma senha forte" />
               
               {/* Password Strength Indicator */}
               {password.length > 0 && (
                   <div className="mt-2 flex gap-1 h-1">
                       {[1, 2, 3, 4].map((step) => (
                           <div 
                               key={step} 
                               className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength >= step ? getStrengthColor() : 'bg-white/10'}`}
                           ></div>
                       ))}
                   </div>
               )}
               {password.length > 0 && password.length < 6 && (
                   <p className="text-xs text-red-400 mt-1">Mínimo de 6 caracteres.</p>
               )}
            </div>
             <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-400 mb-1">Confirme a Senha</label>
              <input 
                id="confirm-password" 
                name="confirm-password" 
                type="password" 
                autoComplete="new-password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`appearance-none block w-full px-4 py-3 border bg-white/5 rounded-md placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all ${!passwordsMatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10'}`}
                placeholder="Confirme sua senha" 
              />
              {!passwordsMatch && <p className="text-xs text-red-400 mt-1">As senhas não coincidem.</p>}
            </div>
            
            <div className="flex items-start bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-[#8a4add] focus:ring-[#8a4add] focus:ring-offset-gray-900 cursor-pointer"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-300 cursor-pointer">
                        Li e concordo com os <button type="button" onClick={() => navigate('/termos')} className="text-[#8a4add] hover:underline font-bold">Termos de Uso</button> e <button type="button" onClick={() => navigate('/privacidade')} className="text-[#8a4add] hover:underline font-bold">Política de Privacidade</button>.
                    </label>
                </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-300 bg-red-500/10 p-3 rounded-md border border-red-500/20 animate-shake">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-gradient-to-r from-[#6d28d9] to-[#8a4add] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#8a4add]/30 transform hover:-translate-y-0.5">
              {loading ? (
                  <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Criando conta...
                  </span>
              ) : 'Cadastrar'}
            </button>
          </div>
        </form>
         <p className="mt-4 text-center text-sm text-gray-400">
            Já tem uma conta?{' '}
            <button onClick={() => navigate('/entrar')} className="font-medium text-[#c4b5fd] hover:text-[#8a4add] hover:underline transition-colors">
              Faça login
            </button>
          </p>
      </div>
    </div>
  );
};

export default Register;
