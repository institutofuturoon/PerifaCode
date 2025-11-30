
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// Substitua pelo seu ID de medição do Google Analytics
// Para testes, você pode manter este placeholder ou usar um ID de teste.
const MEASUREMENT_ID = 'G-SEU-CODIGO-AQUI'; 

const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializa o GA apenas uma vez quando o componente é montado
    // Verificação para evitar inicialização múltipla se o componente remontar
    if (!window.window.ga4_initialized) {
        ReactGA.initialize(MEASUREMENT_ID);
        window.window.ga4_initialized = true;
    }
  }, []);

  useEffect(() => {
    // Envia um evento de visualização de página sempre que a rota muda
    ReactGA.send({ 
        hitType: "pageview", 
        page: location.pathname + location.search 
    });
  }, [location]);

  return null; // Este componente não renderiza nada visualmente
};

// Adiciona a propriedade ao objeto window para evitar erros de TS
declare global {
    interface Window {
        ga4_initialized?: boolean;
    }
}

export default AnalyticsTracker;
