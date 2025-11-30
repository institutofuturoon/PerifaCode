import { useMemo } from 'react';
import ongDataJson from '../data/ongData.json';

/**
 * Hook para acessar dados centralizados da ONG
 * 
 * Uso:
 * const { organization, statistics, partners } = useOngData();
 */
export const useOngData = () => {
  return useMemo(() => ongDataJson, []);
};

/**
 * Hook para estatísticas formatadas
 */
export const useStatistics = () => {
  const data = useOngData();
  return useMemo(() => data.statistics, [data]);
};

/**
 * Hook para parceiros ativos
 */
export const useActivePartners = () => {
  const data = useOngData();
  return useMemo(() => 
    data.partners.filter(p => p.status === 'ativo'),
    [data]
  );
};

/**
 * Hook para depoimentos em destaque
 */
export const useFeaturedTestimonials = () => {
  const data = useOngData();
  return useMemo(() => ({
    students: data.testimonials.students.filter(t => t.featured),
    partners: data.testimonials.partners.filter(t => t.featured)
  }), [data]);
};

/**
 * Hook para cases de sucesso em destaque
 */
export const useFeaturedCases = () => {
  const data = useOngData();
  return useMemo(() => 
    data.successCases.filter(c => c.featured),
    [data]
  );
};

/**
 * Hook para informações de contato
 */
export const useContactInfo = () => {
  const data = useOngData();
  return useMemo(() => data.contact, [data]);
};

/**
 * Hook para equipe
 */
export const useTeam = () => {
  const data = useOngData();
  return useMemo(() => ({
    founder: data.founder,
    team: data.team
  }), [data]);
};

/**
 * Hook para FAQ por categoria
 */
export const useFAQ = (category?: string) => {
  const data = useOngData();
  return useMemo(() => {
    if (!category) return data.faq;
    return data.faq.filter(item => item.category === category);
  }, [data, category]);
};

export default useOngData;
