import React, { useEffect, useRef } from 'react';

/**
 * Adsterra Ad Component 1
 */
export const AdsterraBannerOne: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if script is already present
    if (document.querySelector('script[src*="badb03646466de44447bfdadb827cac1"]')) {
      return;
    }

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl29391858.profitablecpmratenetwork.com/badb03646466de44447bfdadb827cac1/invoke.js';
    
    document.body.appendChild(script);

    return () => {
      // Optional: Cleanup if needed, though usually external ad scripts handle their own state
    };
  }, []);

  return (
    <div className="flex justify-center my-8">
      <div id="container-badb03646466de44447bfdadb827cac1" ref={containerRef}></div>
    </div>
  );
};

/**
 * Adsterra Ad Component 2
 */
export const AdsterraBannerTwo: React.FC = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    // Set global options required by the script
    (window as any).atOptions = {
      'key' : '848dbffab0a73f37b09bb7384e57f0d7',
      'format' : 'iframe',
      'height' : 60,
      'width' : 468,
      'params' : {}
    };

    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/848dbffab0a73f37b09bb7384e57f0d7/invoke.js';
    script.async = true;

    adRef.current.appendChild(script);

    return () => {
      if (adRef.current) {
        adRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="flex justify-center my-8 overflow-hidden">
      <div ref={adRef}></div>
    </div>
  );
};
