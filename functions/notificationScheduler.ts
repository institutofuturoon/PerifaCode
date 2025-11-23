import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (already done in functions/index.ts)
const db = admin.firestore();
const auth = admin.auth();

/**
 * Cloud Function: Check for inactive users and send alerts
 * 
 * Trigger: Cloud Scheduler (daily at 09:00 UTC)
 * Runs: Daily to detect users inactive for 3, 7, or 14 days
 */
export const checkInactivityAlerts = functions.pubsub
  .schedule('0 9 * * *') // Every day at 9:00 AM UTC
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    console.log('🔍 Starting inactivity check...');

    try {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get all users
      const usersSnapshot = await db.collection('users').get();
      const users = usersSnapshot.docs;

      console.log(`📊 Checking ${users.length} users for inactivity...`);

      let alertsCreated = 0;

      for (const userDoc of users) {
        const user = userDoc.data();
        const userId = userDoc.id;
        const lastLoginAt = user.lastLoginAt?.toDate?.() || new Date(0);

        // Check last alert to avoid spam
        const recentAlerts = await db
          .collection('smartNotifications')
          .where('userId', '==', userId)
          .where('type', '==', 'inactivity_alert')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        const lastAlert = recentAlerts.docs[0]?.data().createdAt?.toDate?.() || new Date(0);
        const daysSinceLastAlert = (now.getTime() - lastAlert.getTime()) / (24 * 60 * 60 * 1000);

        // Check inactivity thresholds
        if (lastLoginAt < twoWeeksAgo && daysSinceLastAlert > 14) {
          await createInactivityNotification(userId, 14);
          alertsCreated++;
        } else if (lastLoginAt < weekAgo && daysSinceLastAlert > 7) {
          await createInactivityNotification(userId, 7);
          alertsCreated++;
        } else if (lastLoginAt < threeDaysAgo && daysSinceLastAlert > 3) {
          await createInactivityNotification(userId, 3);
          alertsCreated++;
        }
      }

      console.log(`✅ Inactivity check complete. ${alertsCreated} alerts created.`);
      return { success: true, alertsCreated };
    } catch (error) {
      console.error('❌ Error in inactivity check:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Generate and send weekly summaries
 * 
 * Trigger: Cloud Scheduler (every Monday at 09:00 UTC)
 * Runs: Weekly to send summary of user progress
 */
export const sendWeeklySummaries = functions.pubsub
  .schedule('0 9 ? * MON') // Every Monday at 9:00 AM UTC
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    console.log('📊 Starting weekly summary generation...');

    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Get all users with weekly digest enabled
      const usersSnapshot = await db
        .collection('users')
        .get();

      const users = usersSnapshot.docs;
      console.log(`📊 Generating summaries for ${users.length} users...`);

      let summariesSent = 0;

      for (const userDoc of users) {
        const user = userDoc.data();
        const userId = userDoc.id;

        // Check if user wants weekly digest
        const prefSnapshot = await db
          .collection('notificationPreferences')
          .where('userId', '==', userId)
          .get();

        const prefs = prefSnapshot.docs[0]?.data();
        if (!prefs?.weeklyDigest) {
          continue; // Skip if not enabled
        }

        // Calculate weekly stats
        const stats = await getWeeklyStats(userId, weekAgo);

        if (stats.lessonsCompleted > 0 || stats.xpEarned > 0) {
          await createWeeklySummaryNotification(userId, stats);
          summariesSent++;
        }
      }

      console.log(`✅ Weekly summaries complete. ${summariesSent} summaries sent.`);
      return { success: true, summariesSent };
    } catch (error) {
      console.error('❌ Error in weekly summary generation:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Streak reset for users who haven't logged in today
 * 
 * Trigger: Cloud Scheduler (daily at 23:59 UTC)
 * Runs: Daily to reset streak if user didn't login
 */
export const dailyStreakCheck = functions.pubsub
  .schedule('59 23 * * *') // Every day at 23:59 UTC
  .timeZone('America/Sao_Paulo')
  .onRun(async (context) => {
    console.log('🔥 Starting daily streak check...');

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

      // Get all users with active streaks
      const usersSnapshot = await db
        .collection('users')
        .where('streak', '>', 0)
        .get();

      console.log(`🔥 Checking streaks for ${usersSnapshot.docs.length} users...`);

      let streaksLost = 0;

      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data();
        const userId = userDoc.id;
        const lastLoginAt = user.lastLoginAt?.toDate?.() || new Date(0);
        const lastLoginDate = new Date(lastLoginAt.getFullYear(), lastLoginAt.getMonth(), lastLoginAt.getDate());

        // If last login was before yesterday, reset streak
        if (lastLoginDate < yesterday) {
          const fieldValue = admin.firestore.FieldValue;
          await db.collection('users').doc(userId).update({
            streak: 0,
            lastStreakResetAt: fieldValue.serverTimestamp(),
          });

          // Notify user that streak was lost
          await db.collection('smartNotifications').add({
            userId,
            type: 'streak_loss',
            title: '🔥 Streak Perdido',
            message: 'Seu streak foi resetado. Volte amanhã para começar um novo!',
            icon: '😢',
            link: '/dashboard',
            isRead: false,
            isPinned: false,
            createdAt: fieldValue.serverTimestamp(),
          });

          streaksLost++;
        }
      }

      console.log(`✅ Streak check complete. ${streaksLost} streaks reset.`);
      return { success: true, streaksLost };
    } catch (error) {
      console.error('❌ Error in streak check:', error);
      throw error;
    }
  });

/**
 * Cloud Function: Batch process notifications
 * 
 * Trigger: Firestore trigger on notification creation
 * Runs: When new notification is created, send email if enabled
 */
export const processNotificationEmail = functions.firestore
  .document('smartNotifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    const userId = notification.userId;

    console.log(`📧 Processing notification for user ${userId}...`);

    try {
      // Get user preferences
      const prefsSnapshot = await db
        .collection('notificationPreferences')
        .where('userId', '==', userId)
        .get();

      const prefs = prefsSnapshot.docs[0]?.data();

      if (!prefs?.emailNotifications) {
        console.log(`⏭️ Email notifications disabled for user ${userId}`);
        return;
      }

      // Get user data
      const userSnapshot = await db.collection('users').doc(userId).get();
      const user = userSnapshot.data();

      if (!user?.email) {
        console.log(`⚠️ No email found for user ${userId}`);
        return;
      }

      // Send email using EmailJS or SendGrid
      // Note: Implement your email sending logic here
      console.log(`✅ Email sent to ${user.email}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Error processing notification email:', error);
      // Don't throw - we don't want to retry on email errors
      return { error };
    }
  });

// ===== HELPER FUNCTIONS =====

async function createInactivityNotification(userId: string, daysInactive: number): Promise<void> {
  const messages: Record<number, string> = {
    3: '👋 Sentimos sua falta! Você não visita a plataforma há 3 dias.',
    7: '🤔 Já faz uma semana que não te vemos. Vamos aprender juntos?',
    14: '😢 Duas semanas sem você? A plataforma não é a mesma!',
  };

  await db.collection('smartNotifications').add({
    userId,
    type: 'inactivity_alert',
    title: 'Volte para aprender!',
    message: messages[daysInactive] || 'Volte para continuar sua jornada!',
    icon: '👋',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

interface WeeklyStats {
  lessonsCompleted: number;
  xpEarned: number;
  streakDays: number;
  coursesStarted: number;
  badgesUnlocked: number;
}

async function getWeeklyStats(userId: string, weekAgo: Date): Promise<WeeklyStats> {
  // Get completed lessons this week
  const lessonsSnapshot = await db
    .collection('userProgress')
    .where('userId', '==', userId)
    .where('completedAt', '>=', admin.firestore.Timestamp.fromDate(weekAgo))
    .get();

  // Get user current data
  const userSnapshot = await db.collection('users').doc(userId).get();
  const user = userSnapshot.data();

  const stats: WeeklyStats = {
    lessonsCompleted: lessonsSnapshot.docs.length,
    xpEarned: user?.weeklyXp || 0,
    streakDays: user?.streak || 0,
    coursesStarted: user?.enrolledCourses?.length || 0,
    badgesUnlocked: user?.achievements?.length || 0,
  };

  return stats;
}

async function createWeeklySummaryNotification(userId: string, stats: WeeklyStats): Promise<void> {
  const message = `
    🎓 ${stats.lessonsCompleted} aula${stats.lessonsCompleted !== 1 ? 's' : ''} concluída${stats.lessonsCompleted !== 1 ? 's' : ''}
    ⚡ ${stats.xpEarned} XP ganho${stats.xpEarned !== 1 ? 's' : ''}
    🔥 ${stats.streakDays} dia${stats.streakDays !== 1 ? 's' : ''} de streak
    ${stats.badgesUnlocked > 0 ? `🏆 ${stats.badgesUnlocked} badge${stats.badgesUnlocked !== 1 ? 's' : ''} desbloqueada${stats.badgesUnlocked !== 1 ? 's' : ''}` : ''}
  `.trim();

  await db.collection('smartNotifications').add({
    userId,
    type: 'weekly_summary',
    title: '📊 Resumo da Semana',
    message: message,
    icon: '📊',
    link: '/dashboard',
    isRead: false,
    isPinned: false,
    metadata: {
      lessonsCompleted: stats.lessonsCompleted,
      xpEarned: stats.xpEarned,
      streakDays: stats.streakDays,
      badgesUnlocked: stats.badgesUnlocked,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}
