
import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <div className="flex items-center space-x-2">
        <svg
            {...props}
            viewBox="0 0 220 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M25 0 L0 15 V 35 L25 50 L50 35 V 15 Z" fill="url(#logo-gradient)"/>
            <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="50" y2="50">
                    <stop offset="0%" stopColor="#A855F7"/>
                    <stop offset="100%" stopColor="#7C3AED"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="text-2xl font-black tracking-tighter text-white">
            Perifa<span className="text-purple-400">Code</span>
        </span>
    </div>
);