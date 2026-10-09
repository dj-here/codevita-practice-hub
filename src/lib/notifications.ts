import prisma from './prisma';

export interface NotificationPayload {
  userId: string;
  type: 'BOOKING_UPDATE' | 'PAYMENT' | 'SYSTEM' | 'REMINDER';
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  /**
   * Dispatches a notification to the user.
   * Persists to internal notification inbox and logs to dev console.
   */
  async send(payload: NotificationPayload): Promise<void> {
    try {
      // 1. Store in database
      await prisma.notification.create({
        data: {
          userId: payload.userId,
          type: payload.type,
          title: payload.title,
          message: payload.message,
          metadata: payload.metadata ? JSON.stringify(payload.metadata) : null,
        },
      });

      // 2. In dev/sandbox environment, log the simulated communication
      console.log(`[SIMULATED NOTIFICATION] To User ${payload.userId}: [${payload.type}] ${payload.title} - ${payload.message}`);
    } catch (err) {
      console.error('Failed to dispatch notification:', err);
      // Notification errors must not break main transaction flow
    }
  }

  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { read: true },
      });
      return true;
    } catch {
      return false;
    }
  }

  async getUserNotifications(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
