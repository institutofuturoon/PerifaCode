/**
 * Cloud Function: Processar mensagens do Chat Bot
 * Disparada quando um usuário envia uma mensagem no chat
 * 
 * Fluxo:
 * 1. Extrair keywords da mensagem
 * 2. Buscar FAQs similares
 * 3. Se match > 85%: Responder direto
 * 4. Se match 60-85%: Responder + pedir confirmação
 * 5. Se match < 60%: Escalar para mentor
 * 
 * NOTA: Este é um exemplo de Cloud Function
 * Em produção, usar Firebase Functions CLI para deploy
 */

// Para usar localmente, descomentar e instalar:
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import Levenshtein from 'levenshtein';

// const db = admin.firestore();

// export const processChatMessage = functions.firestore
//   .document('chatMessages/{messageId}')
//   .onCreate(async (snap, context) => {
//     const message = snap.data();
    
//     if (message.sender !== 'user') return;
    
//     const { userId, courseId, lessonId, message: userMessage } = message;
    
//     try {
//       // 1. Extrair keywords
//       const keywords = extractKeywords(userMessage);
      
//       // 2. Buscar FAQs
//       const snapshot = await db
//         .collection('faqBase')
//         .where('courseId', '==', courseId)
//         .get();
      
//       const faqs = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));
      
//       const matches = searchSimilarFAQs(keywords, faqs);
//       const bestMatch = matches[0];
//       const confidence = calculateConfidence(bestMatch, keywords, userMessage);
      
//       let botResponse = '';
      
//       if (confidence > 85) {
//         // Responder direto
//         botResponse = formatFaqResponse(bestMatch, userMessage);
        
//         await db.collection('chatMessages').add({
//           userId: 'bot',
//           courseId,
//           lessonId,
//           message: botResponse,
//           sender: 'bot',
//           timestamp: admin.firestore.FieldValue.serverTimestamp(),
//           botResponse: {
//             type: 'faq_match',
//             faqId: bestMatch.id,
//             confidence,
//           },
//         });
        
//         // Atualizar uso do FAQ
//         await db.collection('faqBase').doc(bestMatch.id).update({
//           usageCount: admin.firestore.FieldValue.increment(1),
//         });
        
//       } else if (confidence > 60) {
//         // Responder + pedir confirmação
//         botResponse = formatPartialResponse(bestMatch, userMessage);
        
//         await db.collection('chatMessages').add({
//           userId: 'bot',
//           courseId,
//           lessonId,
//           message: botResponse,
//           sender: 'bot',
//           timestamp: admin.firestore.FieldValue.serverTimestamp(),
//           botResponse: {
//             type: 'faq_match_uncertain',
//             faqId: bestMatch.id,
//             confidence,
//           },
//         });
        
//       } else {
//         // Escalar para mentor
//         botResponse = formatEscalationResponse();
        
//         // Encontrar mentor do aluno
//         const userDoc = await db.collection('users').doc(userId).get();
//         const mentorId = userDoc.data()?.mentorId;
        
//         await db.collection('chatMessages').add({
//           userId: 'bot',
//           courseId,
//           lessonId,
//           message: botResponse,
//           sender: 'bot',
//           timestamp: admin.firestore.FieldValue.serverTimestamp(),
//           botResponse: {
//             type: 'escalated',
//             mentorId,
//           },
//         });
        
//         // Notificar mentor
//         if (mentorId) {
//           await db.collection('mentorNotifications').add({
//             mentorId,
//             userId,
//             courseId,
//             message: userMessage,
//             type: 'urgent_question',
//             timestamp: admin.firestore.FieldValue.serverTimestamp(),
//             status: 'pending',
//           });
//         }
//       }
      
//     } catch (error) {
//       console.error('Erro ao processar mensagem:', error);
//       // Fallback: Escalar para mentor
//       await db.collection('chatMessages').add({
//         userId: 'bot',
//         courseId,
//         message: 'Desculpe, tive um problema. Vou chamar seu mentor agora! 👤',
//         sender: 'bot',
//         timestamp: admin.firestore.FieldValue.serverTimestamp(),
//         botResponse: {
//           type: 'escalated',
//         },
//       });
//     }
//   });

// Funções auxiliares...
// (Copiar de utils/chatBotUtils.ts)

console.log('Cloud Function: processChatMessage loaded');
console.log('Para usar em produção, deploy com Firebase CLI:');
console.log('firebase deploy --only functions:processChatMessage');
