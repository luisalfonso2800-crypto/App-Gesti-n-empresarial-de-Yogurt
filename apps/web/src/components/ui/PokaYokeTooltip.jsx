/**
 * @file PokaYokeTooltip.jsx
 * @module components/ui
 * @description Tooltip explicativo para brindar contexto y ayuda en la interfaz.
 */

import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function PokaYokeTooltip({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
    >
      {children || <Info size={16} className="text-stone-400 hover:text-stone-700 cursor-help ml-1" />}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-stone-800 text-stone-100 text-xs rounded-md p-2 shadow-lg text-center leading-relaxed">
            {text}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-stone-800" />
        </div>
      )}
    </div>
  );
}
