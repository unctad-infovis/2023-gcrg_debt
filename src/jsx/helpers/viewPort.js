import { useEffect, useState } from 'react';

function getWindowDimensions() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    hidePanelWidth: window.innerWidth <= 1024,
    smScreen: window.innerWidth <= 800,
    mobile: window.innerWidth <= 400,
  };
}

export default function ViewPort() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const resize = () => {
    setWindowDimensions(getWindowDimensions());
  };

  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return windowDimensions;
}
