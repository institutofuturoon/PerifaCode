import React from 'react';

interface UploadProgressProps {
    progress: number;
    size?: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, size = 120 }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg className="transform -rotate-90" width={size} height={size}>
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#333"
                        strokeWidth="8"
                        fill="none"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                    />
                    {/* Gradient Definition */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8a4add" />
                            <stop offset="100%" stopColor="#f27983" />
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* Percentage Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{Math.round(progress)}%</span>
                </div>
            </div>
            
            <p className="text-white font-semibold mt-4">Enviando imagem...</p>
            <p className="text-gray-400 text-xs mt-1">Aguarde um momento</p>
        </div>
    );
};

export default UploadProgress;
