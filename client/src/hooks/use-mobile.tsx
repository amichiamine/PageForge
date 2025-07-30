import React, { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setIsMobile(width < MOBILE_BREAKPOINT);
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT && isTouchDevice);
    };

    // Vérifier au montage
    checkDeviceType();

    // Écouter les changements de taille d'écran
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  return { isMobile, isTablet, isMobileOrTablet: isMobile || isTablet };
}

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }

    checkTouch()
    window.addEventListener('touchstart', checkTouch, { once: true })

    return () => {
      window.removeEventListener('touchstart', checkTouch)
    }
  }, [])

  return isTouch
}