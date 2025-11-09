import React from 'react';

interface ActionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    buttonOnClick: () => void;
    buttonVariant: 'primary' | 'secondary';
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description, buttonText, buttonOnClick, buttonVariant }) => {
    
    const primaryButtonClasses = "bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-all duration-300";
    const secondaryButtonClasses = "bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300";

    return (
        <button 
            onClick={buttonOnClick}
            className="bg-white/5 p-10 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center space-y-4 transition-all duration-300 hover:border-[#8a4add]/50 hover:shadow-2xl hover:shadow-[#8a4add]/10 hover:-translate-y-2 w-full h-full"
        >
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] text-white mb-4 shadow-lg shadow-[#8a4add]/20">
                {icon}
            </div>
            <h3 className="text-3xl font-bold text-white">{title}</h3>
            <p className="text-gray-300 flex-grow">{description}</p>
            <div 
                className={`mt-4 ${buttonVariant === 'primary' ? primaryButtonClasses : secondaryButtonClasses}`}
            >
                {buttonText}
            </div>
        </button>
    );
};

export default ActionCard;