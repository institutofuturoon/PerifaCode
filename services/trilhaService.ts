/**
 * Serviço de Trilhas - Firebase Integration
 * CRUD operations para trilhas de aprendizado
 */

import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { Trilha } from '../TIPOS_CURSO_ROCKETSEAT';
import firebaseCache from '../utils/firebaseCache';

const COLLECTION_NAME = 'trilhas';
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

export const trilhaService = {
  /**
   * Busca todas as trilhas com cache
   */
  async fetchTrilhas(): Promise<Trilha[]> {
    // Tentar cache primeiro
    const cached = firebaseCache.get('trilhas');
    if (cached) {
      console.log('✅ Trilhas do cache');
      return cached;
    }

    try {
      const collRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(collRef);
      const trilhas = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Trilha[];

      // Salvar no cache
      firebaseCache.set('trilhas', trilhas);
      console.log(`✅ Carregou ${trilhas.length} trilhas do Firebase`);
      
      return trilhas;
    } catch (error) {
      console.error('❌ Erro ao buscar trilhas:', error);
      throw error;
    }
  },

  /**
   * Busca trilha por ID
   */
  async fetchTrilhaById(trilhaId: string): Promise<Trilha | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, trilhaId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const trilha = {
          ...docSnap.data(),
          id: docSnap.id,
        } as Trilha;
        return trilha;
      }
      return null;
    } catch (error) {
      console.error(`❌ Erro ao buscar trilha ${trilhaId}:`, error);
      throw error;
    }
  },

  /**
   * Busca trilhas por nível
   */
  async fetchTrilhasByNivel(nivel: 'iniciante' | 'intermediario' | 'avancado'): Promise<Trilha[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), where('nivel', '==', nivel));
      const snapshot = await getDocs(q);
      const trilhas = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Trilha[];

      return trilhas;
    } catch (error) {
      console.error(`❌ Erro ao buscar trilhas por nível ${nivel}:`, error);
      throw error;
    }
  },

  /**
   * Salva/atualiza trilha
   */
  async saveTrilha(trilha: Trilha): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, trilha.id);
      await setDoc(docRef, trilha, { merge: true });
      
      // Limpar cache
      firebaseCache.clear('trilhas');
      
      console.log(`✅ Trilha ${trilha.id} salva com sucesso`);
    } catch (error) {
      console.error('❌ Erro ao salvar trilha:', error);
      throw error;
    }
  },

  /**
   * Limpar cache
   */
  clearCache(): void {
    firebaseCache.clear('trilhas');
    console.log('🗑️ Cache de trilhas limpo');
  },
};

export default trilhaService;
