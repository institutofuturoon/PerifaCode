import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  deleteDoc,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';

export type NotificationType =
  | 'streak_milestone'
  | 'lesson_reminder'
  | 'inactivity_alert'
  | 'badge_unlocked'
  | 'level_up'
  | 'course_suggestion'
  | 'course_completed'
  | 'weekly_summary'
  | 'friend_activity'
  | 'custom';

export interface SmartNotification {
  id?: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  link?: string;
  isRead: boolean;
  isPinned: boolean;
  createdAt?: Timestamp;
  scheduledFor?: Timestamp;
  dismissedAt?: Timestamp;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  streakReminders: boolean;
  lessonReminders: boolean;
  inactivityAlerts: boolean;
  badgeNotifications: boolean;
  levelUpNotifications: boolean;
  weeklyDigest: boolean;
  reminderTime: string; // HH:mm format
  timezone: string;
  mutedUntil?: Timestamp;
}

// ===== CRIAR NOTIFICAÇÃO =====
export const createNotification = async (
  notification: Omit<SmartNotification, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'smartNotifications'), {
      ...notification,
      createdAt: serverTimestamp(),
    });
    console.log('✅ Notificação criada:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Erro ao criar notificação:', error);
    throw error;
  }
};

// ===== BUSCAR NOTIFICAÇÕES NÃO LIDAS =====
export const getUnreadNotifications = async (userId: string): Promise<SmartNotification[]> => {
  try {
    const q = query(
      collection(db, 'smartNotifications'),
      where('userId', '==', userId),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    // Filter out dismissed notifications in the client
    return snapshot.docs
      .filter((doc) => !doc.data().dismissedAt)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as SmartNotification));
  } catch (error) {
    console.error('❌ Erro ao buscar notificações não lidas:', error);
    return [];
  }
};

// ===== REAL-TIME LISTENER PARA NOTIFICAÇÕES NÃO LIDAS =====
export const listenToUnreadNotifications = (
  userId: string,
  onUpdate: (notifications: SmartNotification[]) => void,
  onError?: (error: Error) => void
): Unsubscribe => {
  try {
    const q = query(
      collection(db, 'smartNotifications'),
      where('userId', '==', userId),
      where('isRead', '==', false),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        // Filter out dismissed notifications in the client
        const notifs = snapshot.docs
          .filter((doc) => !doc.data().dismissedAt)
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as SmartNotification));
        onUpdate(notifs);
      },
      (error) => {
        console.error('❌ Erro no listener de notificações:', error);
        onError?.(error as Error);
      }
    );
  } catch (error) {
    console.error('❌ Erro ao configurar listener:', error);
    return () => {}; // Return empty unsubscribe function
  }
};

// ===== BUSCAR TODAS AS NOTIFICAÇÕES =====
export const getAllNotifications = async (userId: string, limit = 50): Promise<SmartNotification[]> => {
  try {
    const q = query(
      collection(db, 'smartNotifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as SmartNotification));
  } catch (error) {
    console.error('❌ Erro ao buscar notificações:', error);
    return [];
  }
};

// ===== MARCAR COMO LIDA =====
export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'smartNotifications', notificationId), {
      isRead: true,
    });
  } catch (error) {
    console.error('❌ Erro ao marcar como lida:', error);
  }
};

// ===== MARCAR TUDO COMO LIDO =====
export const markAllAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'smartNotifications'),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);
    const batch = await Promise.all(
      snapshot.docs.map((doc) =>
        updateDoc(doc.ref, { isRead: true })
      )
    );
    console.log('✅ Todas as notificações marcadas como lidas');
  } catch (error) {
    console.error('❌ Erro ao marcar tudo como lido:', error);
  }
};

// ===== DESCARTAR NOTIFICAÇÃO =====
export const dismissNotification = async (notificationId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'smartNotifications', notificationId), {
      dismissedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Erro ao descartar notificação:', error);
  }
};

// ===== FIXAR/DESAFIXAR NOTIFICAÇÃO =====
export const togglePinNotification = async (notificationId: string, isPinned: boolean): Promise<void> => {
  try {
    await updateDoc(doc(db, 'smartNotifications', notificationId), {
      isPinned: !isPinned,
    });
  } catch (error) {
    console.error('❌ Erro ao fixar notificação:', error);
  }
};

// ===== DELETAR NOTIFICAÇÃO =====
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'smartNotifications', notificationId));
  } catch (error) {
    console.error('❌ Erro ao deletar notificação:', error);
  }
};

// ===== OBTER/CRIAR PREFERÊNCIAS =====
export const getOrCreatePreferences = async (
  userId: string
): Promise<NotificationPreferences> => {
  try {
    const q = query(
      collection(db, 'notificationPreferences'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Criar preferências padrão
      const defaults: Omit<NotificationPreferences, 'id'> = {
        userId,
        emailNotifications: true,
        inAppNotifications: true,
        streakReminders: true,
        lessonReminders: true,
        inactivityAlerts: true,
        badgeNotifications: true,
        levelUpNotifications: true,
        weeklyDigest: true,
        reminderTime: '09:00',
        timezone: 'America/Sao_Paulo',
      };
      await addDoc(collection(db, 'notificationPreferences'), defaults);
      return defaults;
    }

    return snapshot.docs[0].data() as NotificationPreferences;
  } catch (error) {
    console.error('❌ Erro ao obter preferências:', error);
    throw error;
  }
};

// ===== ATUALIZAR PREFERÊNCIAS =====
export const updatePreferences = async (
  userId: string,
  preferences: Partial<NotificationPreferences>
): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notificationPreferences'),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(collection(db, 'notificationPreferences'), {
        userId,
        ...preferences,
      });
    } else {
      await updateDoc(snapshot.docs[0].ref, preferences);
    }
    console.log('✅ Preferências atualizadas');
  } catch (error) {
    console.error('❌ Erro ao atualizar preferências:', error);
  }
};

// ===== NOTIFICAÇÕES INTELIGENTES POR EVENTOS =====

export const triggerStreakMilestone = async (
  userId: string,
  streak: number,
  userName: string
): Promise<void> => {
  const isMilestone = [7, 14, 30, 60, 90, 365].includes(streak);
  if (!isMilestone) return;

  const messages = {
    7: '🔥 Você conseguiu 7 dias de streak! Continue assim!',
    14: '🔥🔥 Parabéns! 14 dias de consistência. Você é incrível!',
    30: '⭐ 30 dias de streak! Você é um campeão!',
    60: '⭐⭐ Incrível! 60 dias de consistência. O mundo está em seus pés!',
    90: '👑 90 DIAS! Você é uma lenda!',
    365: '👑👑 UM ANO INTEIRO! Você é IMORTAL! 🎉',
  };

  await createNotification({
    userId,
    type: 'streak_milestone',
    title: `${streak} dias de Streak!`,
    message: messages[streak as keyof typeof messages] || `${streak} dias de streak!`,
    icon: '🔥',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

export const triggerBadgeUnlocked = async (
  userId: string,
  badgeTitle: string,
  badgeIcon: string
): Promise<void> => {
  await createNotification({
    userId,
    type: 'badge_unlocked',
    title: `Badge Desbloqueada!`,
    message: `🏆 Parabéns! Você desbloqueou a badge "${badgeTitle}"!`,
    icon: badgeIcon,
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

export const triggerLevelUp = async (
  userId: string,
  newLevel: string,
  newLevelEmoji: string
): Promise<void> => {
  await createNotification({
    userId,
    type: 'level_up',
    title: `Você subiu de nível!`,
    message: `🎉 Parabéns! Você alcançou ${newLevelEmoji} ${newLevel}!`,
    icon: '⬆️',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

export const triggerLessonReminder = async (
  userId: string,
  lessonTitle: string,
  courseTitle: string
): Promise<void> => {
  await createNotification({
    userId,
    type: 'lesson_reminder',
    title: `📚 Aula pendente`,
    message: `Não esqueça: "${lessonTitle}" aguarda você em ${courseTitle}!`,
    icon: '📚',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

export const triggerInactivityAlert = async (
  userId: string,
  daysInactive: number
): Promise<void> => {
  const messages = {
    3: '👋 Sentimos sua falta! Volte em 3 dias sem visitas.',
    7: '🤔 Já faz uma semana que não te vemos. Vamos aprender?',
    14: '😢 Duas semanas sem você? A plataforma não é a mesma sem seu esforço!',
  };

  await createNotification({
    userId,
    type: 'inactivity_alert',
    title: `Volte para aprender!`,
    message: messages[daysInactive as keyof typeof messages] || `Volte para continuar sua jornada!`,
    icon: '👋',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

export const triggerCourseCompletion = async (
  userId: string,
  courseTitle: string,
  xpEarned: number
): Promise<void> => {
  await createNotification({
    userId,
    type: 'course_completed',
    title: `🎓 Parabéns!`,
    message: `Você completou "${courseTitle}" e ganhou ${xpEarned} XP! Excelente trabalho!`,
    icon: '🎓',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

export const triggerCourseSuggestion = async (
  userId: string,
  courseTitle: string,
  courseId: string
): Promise<void> => {
  await createNotification({
    userId,
    type: 'course_suggestion',
    title: `📖 Próximo passo`,
    message: `Baseado no seu progresso, recomendamos "${courseTitle}"!`,
    icon: '📖',
    link: `/course/${courseId}`,
    isRead: false,
    isPinned: false,
  });
};

export const triggerWeeklySummary = async (
  userId: string,
  lessonsCompleted: number,
  xpEarned: number,
  streakDays: number
): Promise<void> => {
  await createNotification({
    userId,
    type: 'weekly_summary',
    title: `📊 Resumo da Semana`,
    message: `${lessonsCompleted} aulas, ${xpEarned} XP, ${streakDays} dias de streak! Você está no caminho certo!`,
    icon: '📊',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
  });
};

// ===== VERIFICAR INATIVIDADE =====
export const checkAndCreateInactivityAlerts = async (users: any[]): Promise<void> => {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  for (const user of users) {
    const lastLogin = user.lastLoginAt?.toDate?.() || new Date(0);

    // Só criar alerta se não existir notificação recente do mesmo tipo
    const recentAlerts = await getDocs(
      query(
        collection(db, 'smartNotifications'),
        where('userId', '==', user.id),
        where('type', '==', 'inactivity_alert'),
        orderBy('createdAt', 'desc')
      )
    );

    const lastAlert = recentAlerts.docs[0]?.data().createdAt?.toDate?.() || new Date(0);
    const daysSinceLastAlert = (now.getTime() - lastAlert.getTime()) / (24 * 60 * 60 * 1000);

    if (lastLogin < twoWeeksAgo && daysSinceLastAlert > 14) {
      await triggerInactivityAlert(user.id, 14);
    } else if (lastLogin < weekAgo && daysSinceLastAlert > 7) {
      await triggerInactivityAlert(user.id, 7);
    } else if (lastLogin < threeDaysAgo && daysSinceLastAlert > 3) {
      await triggerInactivityAlert(user.id, 3);
    }
  }
};
