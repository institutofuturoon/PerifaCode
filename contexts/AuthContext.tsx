import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  handleLogout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        let userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await new Promise(resolve => setTimeout(resolve, 1500));
          userDoc = await getDoc(userDocRef);
        }

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          if (userData.accountStatus === 'inactive') {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(userData);
          }
        } else {
          const newUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Novo Aluno',
            email: firebaseUser.email || '',
            avatarUrl: firebaseUser.photoURL || `https://picsum.photos/seed/${firebaseUser.uid}/200`,
            bio: 'Entusiasta de tecnologia pronto para aprender!',
            role: 'student',
            profileStatus: 'incomplete',
            completedLessonIds: [],
            xp: 0,
            achievements: [],
            streak: 0,
            lastCompletionDate: '',
            hasCompletedOnboardingTour: false,
            accountStatus: 'active',
          };
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser);
          } catch (error) {
            console.error('Erro ao criar perfil:', error);
            await signOut(auth);
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, handleLogout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve estar dentro de AuthProvider');
  return context;
};
