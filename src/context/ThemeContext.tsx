
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type AccentColor = 
  | 'sage' 
  | 'blue' 
  | 'green' 
  | 'orange' 
  | 'purple' 
  | 'pink' 
  | 'red' 
  | 'yellow';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const accentColorMap: Record<AccentColor, string> = {
  sage: '120 25% 35%',
  blue: '221 83% 53%',
  green: '142 76% 36%',
  orange: '25 95% 53%',
  purple: '262 83% 58%',
  pink: '330 81% 60%',
  red: '0 84% 60%',
  yellow: '48 96% 53%'
};

const generateColorVariants = (hsl: string) => {
  const [h, s, lRaw] = hsl.split(' ');
  const l = parseInt(lRaw);
  return {
    default: `${h} ${s} ${l}%`,
    lighter: `${h} ${s} ${Math.min(l + 10, 95)}%`,
    darker: `${h} ${s} ${Math.max(l - 10, 0)}%`,
    hover: `${h} ${s} ${Math.max(l - 5, 0)}%`,
    ghost: `${h} ${s} ${l}% / 0.1`,
    ghostHover: `${h} ${s} ${l}% / 0.2`,
    muted: `${h} calc(${s} * 0.5) ${l}% / 0.5`,
  };
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [accentColor, setAccentColor] = useState<AccentColor>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('accent-color') as AccentColor) || 'sage';
    }
    return 'sage';
  });

useEffect(() => {
  const root = document.documentElement;

  // Theme
  root.classList.remove("light", "dark");
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }

  const colors = generateColorVariants(accentColorMap[accentColor]);

  // Core accent variables
  root.style.setProperty("--primary", colors.default);
  root.style.setProperty("--primary-foreground", "0 0% 98%");
  root.style.setProperty("--primary-hover", colors.hover);
  root.style.setProperty("--primary-ghost", colors.ghost);
  root.style.setProperty("--primary-ghost-hover", colors.ghostHover);
  root.style.setProperty("--primary-muted", colors.muted);
  root.style.setProperty("--ring", colors.default);

  // Glow effect
  root.style.setProperty("--primary-glow", `hsl(${colors.default}) 0 0 20px`);
  root.style.setProperty("--primary-glow-strong", `hsl(${colors.default}) 0 0 30px`);

  localStorage.setItem("theme", theme);
  localStorage.setItem("accent-color", accentColor);
}, [theme, accentColor]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
