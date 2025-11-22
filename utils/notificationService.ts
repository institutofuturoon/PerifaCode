import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  updateDoc,
  doc,
  getDocs,
} from 'firebase/firestore';

export interface MentorNotification {
  id: string;
  mentorId: string;
  escalationId: string;
  studentName: string;
  message: string;
  courseId: string;
  type: 'new_escalation' | 'new_response' | 'reminder';
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

/**
 * Criar notificação para mentor
 * ZERO-COST: Usa apenas Firestore
 */
export const createMentorNotification = async (
  mentorId: string,
  escalationId: string,
  studentName: string,
  message: string,
  courseId: string
) => {
  try {
    await addDoc(collection(db, 'mentorNotifications'), {
      mentorId,
      escalationId,
      studentName,
      message: message.substring(0, 100), // Preview
      courseId,
      type: 'new_escalation',
      isRead: false,
      createdAt: serverTimestamp(),
    });
    console.log('✅ Notificação criada');
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
  }
};

/**
 * Marcar notificação como lida
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    await updateDoc(doc(db, 'mentorNotifications', notificationId), {
      isRead: true,
      readAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao marcar como lido:', error);
  }
};

/**
 * Enviar email via EmailJS (ZERO-COST)
 * Requer: npm install @emailjs/browser
 * Setup: https://www.emailjs.com/
 */
export const sendEmailNotification = async (
  mentorEmail: string,
  mentorName: string,
  studentName: string,
  message: string,
  courseId: string
) => {
  try {
    // Verificar se EmailJS está inicializado
    const emailjs = (window as any).emailjs;
    
    if (!emailjs) {
      console.log('⚠️ EmailJS não disponível');
      return;
    }

    // Enviar email usando os dados do ambiente
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      console.log('⚠️ EmailJS keys not configured - email disabled');
      return;
    }

    await emailjs.send(serviceId, templateId, {
      mentor_name: mentorName,
      mentor_email: mentorEmail,
      student_name: studentName,
      student_message: message.substring(0, 200),
      course_id: courseId,
      timestamp: new Date().toLocaleString('pt-BR'),
      dashboard_link: `${window.location.origin}/mentor-dashboard`,
    });

    console.log('✅ Email enviado para', mentorEmail);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
};

/**
 * Obter todas notificações não lidas do mentor
 */
export const getUnreadNotificationCount = async (mentorId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'mentorNotifications'),
      where('mentorId', '==', mentorId),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
    return 0;
  }
};
