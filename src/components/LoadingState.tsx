import React from 'react';

interface LoadingStateProps {
    type?: 'spinner' | 'skeleton' | 'overlay' | 'dots' | 'inline';
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
    type = 'spinner', 
    message = 'Carregando...',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'h-6 w-6 border-2',
        md: 'h-12 w-12 border-4',
        lg: 'h-16 w-16 border-4'
    };

    // Overlay completo (para transições de página)
    if (type === 'overlay') {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
                <div className="bg-gradient-to-br from-[#18181B] to-[#09090B] p-8 rounded-2xl border border-white/10 shadow-2xl text-center">
                    <div className={`animate-spin ${sizeClasses.lg} border-[#8a4add] border-t-transparent rounded-full mx-auto mb-4`}></div>
                    <p className="text-white font-semibold text-lg">{message}</p>
                    <p className="text-gray-500 text-xs mt-2">Aguarde um momento...</p>
                </div>
            </div>
        );
    }

    // Skeleton (para cards de curso)
    if (type === 'skeleton') {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-48 bg-white/5 rounded-xl"></div>
                <div className="h-4 bg-white/5 rounded w-3/4"></div>
                <div className="h-4 bg-white/5 rounded w-1/2"></div>
                <div className="h-8 bg-white/5 rounded w-full mt-4"></div>
            </div>
        );
    }

    // Dots animation (para ações rápidas)
    if (type === 'dots') {
        return (
            <div className="flex items-center gap-2">
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#8a4add] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#8a4add] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-[#8a4add] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                {message && <span className="text-gray-400 text-sm ml-2">{message}</span>}
            </div>
        );
    }

    // Inline (para botões)
    if (type === 'inline') {
        return (
            <div className="flex items-center gap-2">
                <div className={`animate-spin ${sizeClasses[size]} border-white border-t-transparent rounded-full`}></div>
                {message && <span className="text-sm">{message}</span>}
            </div>
        );
    }

    // Spinner padrão (centralizado)
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`animate-spin ${sizeClasses[size]} border-[#8a4add] border-t-transparent rounded-full mb-4`}></div>
            <p className="text-gray-400 text-sm font-medium">{message}</p>
        </div>
    );
};

export default LoadingState;
