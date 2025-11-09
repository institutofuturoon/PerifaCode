import React from 'react';

// The props now extend ImgHTMLAttributes for better compatibility with the <img> tag.
interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Logo: React.FC<LogoProps> = (props) => {
  // Updated logo URL as requested.
  const logoSrc = "https://institutofuturoon.vercel.app/assets/futuroon.svg";

  return (
    <img src={logoSrc} alt="FuturoOn Logo" className="h-8 w-auto" {...props} />
  );
};
