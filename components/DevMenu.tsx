
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { User } from '../types';

export const DevMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const testAccounts = [
    { label: 'Admin', email: 'admin@futuroon.org', pass: '123456', role: '👑 Admin', roleType: 'admin' as const },
    { label: 'Instrutor', email: 'instrutor@futuroon.org', pass: '123456', role: '🎓 Professor', roleType: 'instructor' as const },
    { label: 'Aluno', email: 'aluno@teste.com', pass: '123456', role: '📚 Estudante', roleType: 'student' as const },
  ];

  const handleDevLogin = async (account: typeof testAccounts[0]) => {
      setLoading(true);
      setStatusMsg("Autenticando...");

      try {
          // 1. Tenta fazer login
          await signInWithEmailAndPassword(auth, account.email, account.pass);
          setIsOpen(false);
          navigate('/dashboard');
      } catch (error: any) {
          // 2. Se falhar (usuário não existe ou erro de credencial), tenta criar a conta
          // Nota: 'invalid-credential' é o erro genérico moderno para proteger enumeração de email
          if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
              try {
                  setStatusMsg("Criando conta...");
                  
                  // Tenta criar o usuário
                  const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.pass);
                  const firebaseUser = userCredential.user;

                  // Cria o perfil no Firestore com o papel correto
                  const newUser: User = {
                      id: firebaseUser.uid,
                      name: account.label,
                      email: account.email,
                      avatarUrl: `https://ui-avatars.com/api/?name=${account.label}&background=random`,
                      bio: `Conta de teste para perfil de ${account.label}`,
                      role: account.roleType,
                      profileStatus: 'complete',
                      completedLessonIds: [], 
                      xp: 0, 
                      achievements: [], 
                      streak: 0, 
                      lastCompletionDate: '',
                      hasCompletedOnboardingTour: true,
                      accountStatus: 'active',
                  };

                  await setDoc(doc(db, "users", firebaseUser.uid), newUser);
                  setIsOpen(false);
                  navigate('/dashboard');

              } catch (createError: any) {
                  // Se a criação falhar com email-already-in-use, significa que:
                  // 1. O login falhou (provavelmente senha incorreta, já que o email existe).
                  // 2. A criação falhou (email existe).
                  // Conclusão: A conta existe mas a senha do array testAccounts não bate com a do banco.
                  if (createError.code === 'auth/email-already-in-use') {
                      setStatusMsg("Senha incorreta p/ conta existente.");
                  } else {
                      console.error("Erro ao criar conta de teste:", createError);
                      setStatusMsg(`Erro: ${createError.message}`);
                  }
              }
          } else {
              console.error("DevMenu login error:", error);
              setStatusMsg(`Erro: ${error.message}`);
          }
      } finally {
          setLoading(false);
          // Limpa mensagem após 3s
          setTimeout(() => setStatusMsg(null), 3000);
      }
  };

  return (
    <div className="relative z-[60]">
        <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Menu de Teste (Dev)"
        >
            🛠️
        </button>

        {isOpen && (
            <>
                <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-64 bg-[#18181B] border border-white/10 rounded-xl shadow-2xl p-4 z-50 animate-fade-in">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 border-b border-white/5 pb-2">
                        Ambiente de Teste
                    </h3>
                    
                    {statusMsg && (
                        <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-300">
                            {statusMsg}
                        </div>
                    )}

                    <div className="space-y-2">
                        {testAccounts.map((acc) => (
                            <button 
                                key={acc.label}
                                onClick={() => handleDevLogin(acc)}
                                disabled={loading}
                                className="w-full text-left px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#8a4add]/30 text-gray-300 hover:text-white transition-all flex justify-between items-center group disabled:opacity-50"
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-xs">{acc.role}</span>
                                    <span className="text-[9px] text-gray-500 group-hover:text-[#8a4add]">{acc.email}</span>
                                </div>
                                <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                        ))}
                    </div>
                    <p className="mt-3 text-[9px] text-gray-600 text-center">
                        Cria a conta automaticamente se não existir.
                    </p>
                </div>
            </>
        )}
    </div>
  );
};
