
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { Logo } from '../assets/Logo';
import { User } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    setError(null);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in successfully
        const firebaseUser = userCredential.user;
        
        // Update Firebase Auth profile
        await updateProfile(firebaseUser, {
          displayName: name,
          photoURL: `https://picsum.photos/seed/${firebaseUser.uid}/200`,
        });

        // Create user document in Firestore with 'incomplete' status
        const newUser: User = {
          id: firebaseUser.uid,
          name: name,
          email: firebaseUser.email || "",
          avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
          bio: 'Entusiasta de tecnologia pronto para aprender!',
          role: 'student',
          profileStatus: 'incomplete', // Key field for progressive onboarding
          completedLessonIds: [], xp: 0, achievements: [], streak: 0, lastCompletionDate: '',
          hasCompletedOnboardingTour: false,
        };

        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        
        // The onAuthStateChanged listener will pick up the user and App.tsx router logic will handle redirection.
        // We can navigate to a temporary loading or straight to dashboard and let the router redirect.
        navigate('/dashboard');
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === 'auth/email-already-in-use') {
          setError('Este email já está em uso.');
        } else if (errorCode === 'auth/weak-password') {
          setError('A senha deve ter pelo menos 6 caracteres.');
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
    <div className="flex items-center justify-center min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 aurora-background md:pt-32">
      <div className="max-w-md w-full space-y-8 bg-black/20 backdrop-blur-xl p-10 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <div className="flex justify-center">
          <Logo />
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
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Nome Completo</label>
              <input id="name" name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Seu nome completo" />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Seu melhor email" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Crie uma senha" />
            </div>
             <div>
              <label htmlFor="confirm-password" className="sr-only">Confirme a Senha</label>
              <input id="confirm-password" name="confirm-password" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all"
                placeholder="Confirme sua senha" />
            </div>
          </div>

          {error && (
            <div className="text-center text-sm text-red-300 bg-red-500/10 p-3 rounded-md border border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-gradient-to-r from-[#6d28d9] to-[#8a4add] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8a4add] disabled:opacity-50 transition-all shadow-lg shadow-[#8a4add]/30">
              {loading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </div>
        </form>
         <p className="mt-2 text-center text-sm text-gray-400">
            Já tem uma conta?{' '}
            <button onClick={() => navigate('/login')} className="font-medium text-[#c4b5fd] hover:text-[#8a4add] hover:underline">
              Faça login
            </button>
          </p>
      </div>
    </div>
  );
};

export default Register;
