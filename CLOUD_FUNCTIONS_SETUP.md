# ☁️ Cloud Functions Setup Guide

## Overview
Deploy scheduled Cloud Functions to Firebase for automatic inactivity detection and weekly summaries.

## Prerequisites
- Firebase project with Blaze plan (required for Cloud Functions)
- Firebase CLI installed: `npm install -g firebase-tools`
- Service account credentials

## Installation

### Step 1: Initialize Firebase Functions

```bash
firebase init functions
# Choose TypeScript
# Choose "Overwrite" for existing files if prompted
```

### Step 2: Install Dependencies

```bash
cd functions
npm install firebase-admin firebase-functions
```

### Step 3: Set Up Environment Variables

Create `functions/.env` (or use Firebase env configuration):

```bash
firebase functions:config:set gmail.email="your-email@gmail.com"
firebase functions:config:set gmail.password="your-app-password"
```

### Step 4: Deploy Cloud Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:checkInactivityAlerts

# View logs
firebase functions:log
```

## Available Cloud Functions

### 1. **checkInactivityAlerts** ⏰
- **Trigger:** Daily at 9:00 AM (São Paulo timezone)
- **What it does:** Detects users inactive for 3, 7, or 14 days and sends notifications
- **Firestore reads:** ~1-2 per user (optimized queries)
- **Cost:** ~$0.00 (included in free tier if under 125k invocations/month)

```typescript
// Runs: Every day at 09:00
// Checks:
// - Users inactive 3+ days → Send first alert
// - Users inactive 7+ days → Send second alert
// - Users inactive 14+ days → Send final alert
```

### 2. **sendWeeklySummaries** 📊
- **Trigger:** Every Monday at 9:00 AM (São Paulo timezone)
- **What it does:** Sends weekly progress report to users who opted in
- **Firestore reads:** ~2-3 per user
- **Cost:** ~$0.00 (included in free tier)

```typescript
// Runs: Every Monday at 09:00
// Calculates:
// - Lessons completed this week
// - XP earned this week
// - Current streak
// - Badges unlocked
// - Creates summary notification
```

### 3. **dailyStreakCheck** 🔥
- **Trigger:** Daily at 23:59 UTC (end of day check)
- **What it does:** Resets streak if user didn't login today
- **Firestore writes:** 1 per user with active streak
- **Cost:** ~$0.00 (included in free tier)

```typescript
// Runs: Every day at 23:59 UTC
// Checks:
// - Compare lastLoginAt with today's date
// - If before yesterday: Reset streak to 0
// - Send "Streak Lost" notification
```

### 4. **processNotificationEmail** 📧
- **Trigger:** Firestore trigger (on notification creation)
- **What it does:** Sends email when notification created
- **Firestore reads:** 1-2 per notification
- **Cost:** ~$0.00 (included in free tier)

```typescript
// Runs: Whenever new notification created
// Checks:
// - User email preference enabled?
// - Get user email from users collection
// - Send email notification
// - Log success
```

## Firestore Costs Estimate

| Operation | Frequency | Monthly | Cost |
|-----------|-----------|---------|------|
| Inactivity check | Daily | ~1000 | $0.05 |
| Weekly summaries | Weekly | ~500 | $0.02 |
| Streak check | Daily | ~2000 | $0.10 |
| Email processor | Per notification | ~3000 | $0.15 |
| **TOTAL** | | | **~$0.32/month** |

*Within Firebase free tier (1M reads/month)*

## Testing Locally

### Emulator Setup

```bash
# Start Firebase emulator
firebase emulators:start --only functions,firestore

# In another terminal, run tests
npm run test
```

### Manual Testing

```typescript
// Test inactivity detection
const testUser = {
  id: 'test-user-1',
  lastLoginAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
  streak: 0
};

// Should trigger 14-day inactivity alert
```

## Monitoring & Debugging

### View Function Logs

```bash
# Real-time logs
firebase functions:log --follow

# Specific function logs
firebase functions:log --follow checkInactivityAlerts

# Last 50 lines
firebase functions:log --limit 50
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Function not triggering | Check Cloud Scheduler is enabled in Firebase Console |
| Auth errors | Verify service account has required Firestore permissions |
| Email not sending | Check email preferences in database |
| Timeout errors | Increase function timeout: `functions.config().firebase.runtimeOptions` |

## Customization

### Change Schedule Times

Edit `notificationScheduler.ts`:

```typescript
// Change from "0 9 * * *" to your timezone/time
export const checkInactivityAlerts = functions.pubsub
  .schedule('30 8 * * *')  // 8:30 AM
  .timeZone('America/Sao_Paulo')
  .onRun(...)
```

### Add More Inactivity Thresholds

```typescript
// Add 30-day check
if (lastLoginAt < thirtyDaysAgo && daysSinceLastAlert > 30) {
  await createInactivityNotification(userId, 30);
}
```

### Customize Email Template

Implement in `processNotificationEmail`:

```typescript
const emailTemplate = {
  subject: `Notificação: ${notification.title}`,
  body: `${notification.message} - Clique para saber mais`
};
```

## Deployment Checklist

- [ ] Firebase Functions initialized
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Functions tested locally
- [ ] Firestore rules updated (allow functions to read/write)
- [ ] Cloud Scheduler enabled
- [ ] Functions deployed
- [ ] Logs monitored for errors
- [ ] Email service configured (optional)

## Related Documentation

- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Cloud Scheduler](https://cloud.google.com/scheduler/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite)

## Support

For issues:
1. Check Firebase Console → Functions → Logs
2. Review Firestore database for data consistency
3. Verify Cloud Scheduler jobs are active
4. Check service account permissions

## Next Steps

1. ✅ Deploy functions
2. ⏳ Monitor logs for 24 hours
3. ⏳ Test inactivity detection
4. ⏳ Verify weekly summary generation
5. ⏳ Implement email sending
6. ⏳ Add custom alerts (e.g., on badge unlock)

---

**Status: Ready to Deploy** 🚀
