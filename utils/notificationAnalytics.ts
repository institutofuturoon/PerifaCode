/**
 * Notification Analytics & CTR Tracking
 * 
 * Tracks impressions (views) and clicks for each notification type
 * Calculates CTR = (clicks / impressions) * 100
 */

import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';

export interface NotificationAnalyticsEvent {
  id?: string;
  userId: string;
  notificationId: string;
  notificationType: string;
  eventType: 'impression' | 'click' | 'dismiss';
  timestamp?: Timestamp;
  metadata?: {
    timeToClick?: number; // milliseconds from impression to click
    screenView?: string; // which page was shown
  };
}

export interface NotificationCTRMetrics {
  type: string;
  totalImpressions: number;
  totalClicks: number;
  totalDismisses: number;
  ctr: number; // Click-Through Rate percentage
  dismissRate: number; // Dismiss Rate percentage
  avgTimeToClick: number; // milliseconds
  lastUpdated: Date;
}

// ===== TRACK IMPRESSION (WHEN NOTIFICATION SHOWN) =====
export const trackNotificationImpression = async (
  userId: string,
  notificationId: string,
  notificationType: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'notificationAnalytics'), {
      userId,
      notificationId,
      notificationType,
      eventType: 'impression',
      timestamp: serverTimestamp(),
      metadata: {
        screenView: window.location.pathname,
      },
    });
    console.log(`📊 Impression tracked: ${notificationType}`);
  } catch (error) {
    console.error('❌ Error tracking impression:', error);
  }
};

// ===== TRACK CLICK (WHEN USER CLICKS NOTIFICATION) =====
export const trackNotificationClick = async (
  userId: string,
  notificationId: string,
  notificationType: string,
  timeToClickMs?: number
): Promise<void> => {
  try {
    await addDoc(collection(db, 'notificationAnalytics'), {
      userId,
      notificationId,
      notificationType,
      eventType: 'click',
      timestamp: serverTimestamp(),
      metadata: {
        timeToClick: timeToClickMs || 0,
        screenView: window.location.pathname,
      },
    });
    console.log(`📊 Click tracked: ${notificationType}`);
  } catch (error) {
    console.error('❌ Error tracking click:', error);
  }
};

// ===== TRACK DISMISS (WHEN USER DISMISSES NOTIFICATION) =====
export const trackNotificationDismiss = async (
  userId: string,
  notificationId: string,
  notificationType: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'notificationAnalytics'), {
      userId,
      notificationId,
      notificationType,
      eventType: 'dismiss',
      timestamp: serverTimestamp(),
      metadata: {
        screenView: window.location.pathname,
      },
    });
    console.log(`📊 Dismiss tracked: ${notificationType}`);
  } catch (error) {
    console.error('❌ Error tracking dismiss:', error);
  }
};

// ===== GET CTR FOR ALL NOTIFICATION TYPES =====
export const getNotificationCTRMetrics = async (): Promise<NotificationCTRMetrics[]> => {
  try {
    const analyticsSnapshot = await getDocs(collection(db, 'notificationAnalytics'));
    const events = analyticsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NotificationAnalyticsEvent[];

    // Group by notification type
    const typeStats: Record<string, any> = {};

    for (const event of events) {
      const type = event.notificationType;

      if (!typeStats[type]) {
        typeStats[type] = {
          type,
          impressions: 0,
          clicks: 0,
          dismisses: 0,
          clickTimes: [],
        };
      }

      if (event.eventType === 'impression') {
        typeStats[type].impressions++;
      } else if (event.eventType === 'click') {
        typeStats[type].clicks++;
        if (event.metadata?.timeToClick) {
          typeStats[type].clickTimes.push(event.metadata.timeToClick);
        }
      } else if (event.eventType === 'dismiss') {
        typeStats[type].dismisses++;
      }
    }

    // Calculate metrics
    const metrics: NotificationCTRMetrics[] = Object.values(typeStats).map(
      (stat: any) => ({
        type: stat.type,
        totalImpressions: stat.impressions,
        totalClicks: stat.clicks,
        totalDismisses: stat.dismisses,
        ctr:
          stat.impressions > 0
            ? parseFloat(((stat.clicks / stat.impressions) * 100).toFixed(2))
            : 0,
        dismissRate:
          stat.impressions > 0
            ? parseFloat(((stat.dismisses / stat.impressions) * 100).toFixed(2))
            : 0,
        avgTimeToClick:
          stat.clickTimes.length > 0
            ? Math.round(
                stat.clickTimes.reduce((a: number, b: number) => a + b, 0) /
                  stat.clickTimes.length
              )
            : 0,
        lastUpdated: new Date(),
      })
    );

    // Sort by CTR descending
    return metrics.sort((a, b) => b.ctr - a.ctr);
  } catch (error) {
    console.error('❌ Error getting CTR metrics:', error);
    return [];
  }
};

// ===== GET CTR FOR SPECIFIC NOTIFICATION TYPE =====
export const getNotificationCTRByType = async (
  notificationType: string
): Promise<NotificationCTRMetrics | null> => {
  try {
    const metrics = await getNotificationCTRMetrics();
    return metrics.find((m) => m.type === notificationType) || null;
  } catch (error) {
    console.error('❌ Error getting CTR by type:', error);
    return null;
  }
};

// ===== GET CTR TRENDS (LAST 7 DAYS, 30 DAYS) =====
export const getNotificationCTRTrends = async (
  days: number = 7
): Promise<NotificationCTRMetrics[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      collection(db, 'notificationAnalytics'),
      where('timestamp', '>=', Timestamp.fromDate(startDate))
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NotificationAnalyticsEvent[];

    // Group by notification type
    const typeStats: Record<string, any> = {};

    for (const event of events) {
      const type = event.notificationType;

      if (!typeStats[type]) {
        typeStats[type] = {
          type,
          impressions: 0,
          clicks: 0,
          dismisses: 0,
          clickTimes: [],
        };
      }

      if (event.eventType === 'impression') {
        typeStats[type].impressions++;
      } else if (event.eventType === 'click') {
        typeStats[type].clicks++;
        if (event.metadata?.timeToClick) {
          typeStats[type].clickTimes.push(event.metadata.timeToClick);
        }
      } else if (event.eventType === 'dismiss') {
        typeStats[type].dismisses++;
      }
    }

    // Calculate metrics
    const metrics: NotificationCTRMetrics[] = Object.values(typeStats).map(
      (stat: any) => ({
        type: stat.type,
        totalImpressions: stat.impressions,
        totalClicks: stat.clicks,
        totalDismisses: stat.dismisses,
        ctr:
          stat.impressions > 0
            ? parseFloat(((stat.clicks / stat.impressions) * 100).toFixed(2))
            : 0,
        dismissRate:
          stat.impressions > 0
            ? parseFloat(((stat.dismisses / stat.impressions) * 100).toFixed(2))
            : 0,
        avgTimeToClick:
          stat.clickTimes.length > 0
            ? Math.round(
                stat.clickTimes.reduce((a: number, b: number) => a + b, 0) /
                  stat.clickTimes.length
              )
            : 0,
        lastUpdated: new Date(),
      })
    );

    return metrics.sort((a, b) => b.ctr - a.ctr);
  } catch (error) {
    console.error('❌ Error getting CTR trends:', error);
    return [];
  }
};

// ===== GET BEST & WORST PERFORMING NOTIFICATIONS =====
export const getNotificationPerformanceRanking = async (): Promise<{
  best: NotificationCTRMetrics[];
  worst: NotificationCTRMetrics[];
}> => {
  try {
    const metrics = await getNotificationCTRMetrics();

    // Filter notifications with at least 10 impressions for meaningful data
    const significantMetrics = metrics.filter((m) => m.totalImpressions >= 10);

    return {
      best: significantMetrics.slice(0, 3),
      worst: significantMetrics.reverse().slice(0, 3),
    };
  } catch (error) {
    console.error('❌ Error getting performance ranking:', error);
    return { best: [], worst: [] };
  }
};

// ===== GET USER-SPECIFIC NOTIFICATION ENGAGEMENT =====
export const getUserNotificationEngagement = async (
  userId: string
): Promise<{
  totalImpressions: number;
  totalClicks: number;
  overallCTR: number;
  favorites: string[]; // Most clicked types
}> => {
  try {
    const q = query(
      collection(db, 'notificationAnalytics'),
      where('userId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as NotificationAnalyticsEvent[];

    let totalImpressions = 0;
    let totalClicks = 0;
    const typeClicks: Record<string, number> = {};

    for (const event of events) {
      if (event.eventType === 'impression') {
        totalImpressions++;
      } else if (event.eventType === 'click') {
        totalClicks++;
        typeClicks[event.notificationType] =
          (typeClicks[event.notificationType] || 0) + 1;
      }
    }

    // Get top clicked types
    const favorites = Object.entries(typeClicks)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0]);

    return {
      totalImpressions,
      totalClicks,
      overallCTR:
        totalImpressions > 0
          ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2))
          : 0,
      favorites,
    };
  } catch (error) {
    console.error('❌ Error getting user engagement:', error);
    return {
      totalImpressions: 0,
      totalClicks: 0,
      overallCTR: 0,
      favorites: [],
    };
  }
};
