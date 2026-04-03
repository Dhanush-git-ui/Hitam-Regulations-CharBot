import React from 'react';

function LogoIcon({ className = "w-8 h-8" }) {
  return (
    <img 
      src="/logo.png" 
      alt="HITAM Logo" 
      className={`${className} object-contain rounded-lg`}
    />
  );
}

export default LogoIcon;

