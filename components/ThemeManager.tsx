import React, { useEffect } from 'react';

interface ThemeManagerProps {
  color: string;
}

// Helper to darken a hex color
const darkenColor = (hex: string, percent: number): string => {
  try {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    r = Math.floor(r * (100 - percent) / 100);
    g = Math.floor(g * (100 - percent) / 100);
    b = Math.floor(b * (100 - percent) / 100);
    
    r = (r < 0) ? 0 : r;
    g = (g < 0) ? 0 : g;
    b = (b < 0) ? 0 : b;

    const toHex = (c: number) => ('00' + c.toString(16)).slice(-2);
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  } catch (error) {
    console.error("Invalid color for darken:", hex);
    return '#8ade59'; // Fallback
  }
};


const ThemeManager: React.FC<ThemeManagerProps> = ({ color }) => {
  useEffect(() => {
    if (color && /^#[0-9A-F]{6}$/i.test(color)) {
      const darkColor = darkenColor(color, 10);
      document.documentElement.style.setProperty('--color-brand', color);
      document.documentElement.style.setProperty('--color-brand-dark', darkColor);
    }
  }, [color]);

  return null; // This component does not render anything
};

export default ThemeManager;
