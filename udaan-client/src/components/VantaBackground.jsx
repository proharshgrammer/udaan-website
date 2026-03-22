import React, { useEffect, useRef } from 'react';

export default function VantaBackground({ children, className = "" }) {
  const vantaRef = useRef(null);

  useEffect(() => {
    let vantaEffect = null;
    if (!vantaEffect && window.VANTA && window.VANTA.TOPOLOGY) {
      vantaEffect = window.VANTA.TOPOLOGY({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4a72a8,
        backgroundColor: 0x0
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <section ref={vantaRef} className={className}>
      {children}
    </section>
  );
}
