import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface LessonHistory {
  lessonId: string;
  timestamp: string;
  courseName: string;
  courseId: string;
  duration?: string;
}

/**
 * 💾 Sincroniza histórico de aulas com Firestore
 * Salva localmente + Backend
 */
export const syncLessonHistory = async (
  userId: string,
  courseId: string,
  lessonId: string,
  courseName: string
) => {
  try {
    // 1️⃣ SALVAR LOCALMENTE (localStorage)
    const history = JSON.parse(localStorage.getItem('futuroon_lesson_history') || '{}');
    history[courseId] = {
      lessonId,
      timestamp: new Date().toISOString(),
      courseName,
    };
    localStorage.setItem('futuroon_lesson_history', JSON.stringify(history));

    // 2️⃣ SINCRONIZAR COM FIREBASE
    if (userId) {
      const userHistoryRef = doc(db, 'users', userId, 'lessonHistory', courseId);
      await setDoc(
        userHistoryRef,
        {
          lessonId,
          timestamp: new Date().toISOString(),
          courseName,
          courseId,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      // 3️⃣ SALVAR GLOBAL NO USER DOC (para "Continuar Parei")
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        lastLessonHistory: {
          courseId,
          lessonId,
          timestamp: new Date().toISOString(),
          courseName,
        },
        lastLessonUpdatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Erro ao sincronizar histórico:', error);
    // Fallback: continua usando localStorage se Firebase falhar
  }
};

/**
 * 🔄 Busca histórico do Firebase (para sincronizar entre dispositivos)
 */
export const getLessonHistoryFromFirebase = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists() && userDoc.data().lastLessonHistory) {
      return userDoc.data().lastLessonHistory as LessonHistory;
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar histórico do Firebase:', error);
    return null;
  }
};

/**
 * 📱 Sincroniza localStorage com Firebase
 * Útil quando usuário troca dispositivo
 */
export const syncLocalToFirebase = async (userId: string) => {
  try {
    const localHistory = JSON.parse(localStorage.getItem('futuroon_lesson_history') || '{}');
    
    Object.entries(localHistory).forEach(async ([courseId, data]: [string, any]) => {
      const userHistoryRef = doc(db, 'users', userId, 'lessonHistory', courseId);
      await setDoc(userHistoryRef, {
        ...data,
        courseId,
        syncedAt: new Date().toISOString(),
      }, { merge: true });
    });
  } catch (error) {
    console.error('Erro ao sincronizar local para Firebase:', error);
  }
};
