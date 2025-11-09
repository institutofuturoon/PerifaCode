import React from 'react';

// The props now extend ImgHTMLAttributes for better compatibility with the <img> tag.
interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Logo: React.FC<LogoProps> = (props) => {
  // Use the direct URL for the SVG logo
  const logoSrc = "https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg";
  
  return (
    <img 
      src={logoSrc}
      alt="FuturoOn Logo"
      width={114}
      height={31}
      {...props} // Spread the rest of the props
    />
  );
};
