/**
 * Serviço de Projetos - Firebase Integration
 * CRUD operations para projetos práticos
 */

import { db } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, query, where, increment } from 'firebase/firestore';
import { Projeto, ProjectSubmission } from '../TIPOS_CURSO_ROCKETSEAT';
import firebaseCache from '../utils/firebaseCache';

const PROJETOS_COLLECTION = 'projetos';
const SUBMISSIONS_COLLECTION = 'projectSubmissions';

export const projetoService = {
  /**
   * Busca todos os projetos com cache
   */
  async fetchProjetos(): Promise<Projeto[]> {
    const cached = firebaseCache.get('projetos');
    if (cached) {
      console.log('✅ Projetos do cache');
      return cached;
    }

    try {
      const collRef = collection(db, PROJETOS_COLLECTION);
      const snapshot = await getDocs(collRef);
      const projetos = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Projeto[];

      firebaseCache.set('projetos', projetos);
      console.log(`✅ Carregou ${projetos.length} projetos do Firebase`);
      
      return projetos;
    } catch (error) {
      console.error('❌ Erro ao buscar projetos:', error);
      throw error;
    }
  },

  /**
   * Busca projetos por trilha
   */
  async fetchProjetosByTrilha(trilhaId: string): Promise<Projeto[]> {
    try {
      const q = query(collection(db, PROJETOS_COLLECTION), where('trilhaId', '==', trilhaId));
      const snapshot = await getDocs(q);
      const projetos = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Projeto[];

      return projetos;
    } catch (error) {
      console.error(`❌ Erro ao buscar projetos da trilha ${trilhaId}:`, error);
      throw error;
    }
  },

  /**
   * Busca projeto por ID
   */
  async fetchProjetoById(projetoId: string): Promise<Projeto | null> {
    try {
      const docRef = doc(db, PROJETOS_COLLECTION, projetoId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        } as Projeto;
      }
      return null;
    } catch (error) {
      console.error(`❌ Erro ao buscar projeto ${projetoId}:`, error);
      throw error;
    }
  },

  /**
   * Salva projeto
   */
  async saveProjeto(projeto: Projeto): Promise<void> {
    try {
      const docRef = doc(db, PROJETOS_COLLECTION, projeto.id);
      await setDoc(docRef, projeto, { merge: true });
      firebaseCache.clear('projetos');
      console.log(`✅ Projeto ${projeto.id} salvo`);
    } catch (error) {
      console.error('❌ Erro ao salvar projeto:', error);
      throw error;
    }
  },

  /**
   * Salva submission de projeto
   */
  async saveSubmission(submission: ProjectSubmission): Promise<void> {
    try {
      const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
      await setDoc(docRef, submission, { merge: true });

      // Incrementar submissions count do projeto
      const projetoRef = doc(db, PROJETOS_COLLECTION, submission.projetoId);
      await updateDoc(projetoRef, {
        numSubmissoes: increment(1),
      });

      console.log(`✅ Submission ${submission.id} salva`);
    } catch (error) {
      console.error('❌ Erro ao salvar submission:', error);
      throw error;
    }
  },

  /**
   * Busca submissions do usuário
   */
  async fetchUserSubmissions(userId: string): Promise<ProjectSubmission[]> {
    try {
      const q = query(collection(db, SUBMISSIONS_COLLECTION), where('usuarioId', '==', userId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as ProjectSubmission[];
    } catch (error) {
      console.error(`❌ Erro ao buscar submissions do usuário ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Limpar cache
   */
  clearCache(): void {
    firebaseCache.clear('projetos');
    console.log('🗑️ Cache de projetos limpo');
  },
};

export default projetoService;
