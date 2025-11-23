/**
 * Scheduled Notification Triggers
 * 
 * These functions are called by Cloud Functions to manage scheduled notifications.
 * They can also be called manually for testing purposes.
 */

import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Trigger: Create inactivity notification for a user
 * Called by: Cloud Function (checkInactivityAlerts)
 */
export const triggerInactivityNotificationScheduled = async (
  userId: string,
  daysInactive: number
): Promise<void> => {
  const messages: Record<number, string> = {
    3: '👋 Sentimos sua falta! Você não visita há 3 dias.',
    7: '🤔 Já faz uma semana que não te vemos. Vamos aprender?',
    14: '😢 Duas semanas sem você? A plataforma não é a mesma!',
  };

  try {
    await addDoc(collection(db, 'smartNotifications'), {
      userId,
      type: 'inactivity_alert',
      title: 'Volte para aprender!',
      message: messages[daysInactive] || 'Volte para continuar sua jornada!',
      icon: '👋',
      link: '/dashboard',
      isRead: false,
      isPinned: false,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Inactivity notification created for ${userId} (${daysInactive}d)`);
  } catch (error) {
    console.error(`❌ Error creating inactivity notification:`, error);
    throw error;
  }
};

/**
 * Trigger: Create weekly summary notification
 * Called by: Cloud Function (sendWeeklySummaries)
 */
export const triggerWeeklySummaryScheduled = async (
  userId: string,
  stats: {
    lessonsCompleted: number;
    xpEarned: number;
    streakDays: number;
    badgesUnlocked: number;
  }
): Promise<void> => {
  const message = `
📚 ${stats.lessonsCompleted} aula${stats.lessonsCompleted !== 1 ? 's' : ''}
⚡ ${stats.xpEarned} XP
🔥 ${stats.streakDays} dia${stats.streakDays !== 1 ? 's' : ''} de streak
${stats.badgesUnlocked > 0 ? `🏆 ${stats.badgesUnlocked} badge(s)` : ''}
  `.trim();

  try {
    await addDoc(collection(db, 'smartNotifications'), {
      userId,
      type: 'weekly_summary',
      title: '📊 Resumo da Semana',
      message,
      icon: '📊',
      link: '/dashboard',
      isRead: false,
      isPinned: false,
      metadata: stats,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Weekly summary created for ${userId}`);
  } catch (error) {
    console.error(`❌ Error creating weekly summary:`, error);
    throw error;
  }
};

/**
 * Trigger: Create streak loss notification
 * Called by: Cloud Function (dailyStreakCheck)
 */
export const triggerStreakLossScheduled = async (userId: string): Promise<void> => {
  try {
    await addDoc(collection(db, 'smartNotifications'), {
      userId,
      type: 'streak_loss',
      title: '🔥 Seu Streak foi Resetado',
      message: 'Não se preocupe! Volte amanhã para começar um novo streak.',
      icon: '😢',
      link: '/dashboard',
      isRead: false,
      isPinned: false,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ Streak loss notification created for ${userId}`);
  } catch (error) {
    console.error(`❌ Error creating streak loss notification:`, error);
    throw error;
  }
};

/**
 * Check if a user should receive inactivity notification
 * Used to prevent notification spam
 */
export const shouldSendInactivityNotification = async (
  userId: string,
  daysThreshold: number
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'smartNotifications'),
      where('userId', '==', userId),
      where('type', '==', 'inactivity_alert')
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) return true; // No previous alerts

    // Check if latest alert is from same threshold
    const latest = snapshot.docs
      .sort((a, b) => {
        const timeA = a.data().createdAt?.toMillis?.() || 0;
        const timeB = b.data().createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      })[0];

    const lastAlertTime = latest.data().createdAt?.toMillis?.() || 0;
    const daysSinceAlert = (Date.now() - lastAlertTime) / (24 * 60 * 60 * 1000);

    // Allow new alert if different threshold or enough time passed
    return daysSinceAlert > (daysThreshold === 14 ? 14 : 7);
  } catch (error) {
    console.error(`❌ Error checking inactivity notification:`, error);
    return false;
  }
};

/**
 * Get weekly stats for a user
 * Used by: Cloud Function (sendWeeklySummaries)
 */
export const getWeeklyStatsForUser = async (userId: string): Promise<{
  lessonsCompleted: number;
  xpEarned: number;
  streakDays: number;
  badgesUnlocked: number;
}> => {
  try {
    // This would be called from Cloud Functions context
    // In browser context, return mock data for demo
    return {
      lessonsCompleted: 0,
      xpEarned: 0,
      streakDays: 0,
      badgesUnlocked: 0,
    };
  } catch (error) {
    console.error(`❌ Error getting weekly stats:`, error);
    return {
      lessonsCompleted: 0,
      xpEarned: 0,
      streakDays: 0,
      badgesUnlocked: 0,
    };
  }
};

/**
 * Manual test function: Simulate inactivity check
 * Usage: Call from Firebase Console or CLI
 * 
 * Example:
 * firebase functions:call checkInactivityAlerts
 */
export const testInactivityCheck = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log('🧪 Testing inactivity check...');

  try {
    // Simulate checking 5 test users
    const testUsers = ['test-user-1', 'test-user-2', 'test-user-3'];

    for (const userId of testUsers) {
      const shouldSend = await shouldSendInactivityNotification(userId, 7);
      if (shouldSend) {
        await triggerInactivityNotificationScheduled(userId, 7);
      }
    }

    return {
      success: true,
      message: `✅ Test complete. Checked ${testUsers.length} users.`,
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      message: `❌ Test failed: ${error}`,
    };
  }
};

/**
 * Manual test function: Simulate weekly summary
 * Usage: Call from Firebase Console or CLI
 */
export const testWeeklySummary = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  console.log('🧪 Testing weekly summary...');

  try {
    const testUserId = 'test-user-1';
    const stats = {
      lessonsCompleted: 5,
      xpEarned: 250,
      streakDays: 7,
      badgesUnlocked: 2,
    };

    await triggerWeeklySummaryScheduled(testUserId, stats);

    return {
      success: true,
      message: `✅ Weekly summary test complete for ${testUserId}`,
    };
  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      message: `❌ Test failed: ${error}`,
    };
  }
};
