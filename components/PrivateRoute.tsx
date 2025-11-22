import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../App';

/**
 * PrivateRoute: Protege rotas do SISTEMA
 * Redireciona para /login se não estiver autenticado
 */

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#8a4add]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
