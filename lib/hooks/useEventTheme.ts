import { useEffect } from 'react'

interface EventTheme {
  primaryColor: string
  secondaryColor: string
  background: string
  fontFamily: string
  heroImage?: string | null
}

const fontMap: Record<string, string> = {
  'Playfair Display': 'var(--font-playfair)',
  'Montserrat': 'var(--font-montserrat)',
  'Dancing Script': 'var(--font-dancing)',
  'Roboto': 'var(--font-roboto)',
  'Great Vibes': 'var(--font-great-vibes)',
}

export function useEventTheme(theme?: EventTheme | null) {
  useEffect(() => {
    if (!theme) return

    // Aplicar variables CSS personalizadas
    const root = document.documentElement
    
    root.style.setProperty('--color-primary', theme.primaryColor)
    root.style.setProperty('--color-secondary', theme.secondaryColor)
    
    // Mapear nombre de fuente a variable CSS
    const fontVariable = fontMap[theme.fontFamily] || fontMap['Playfair Display']
    root.style.setProperty('--font-heading', fontVariable)
    
    // Aplicar clase de background
    document.body.className = `theme-${theme.background}`
    
    return () => {
      // Limpiar al desmontar
      root.style.removeProperty('--color-primary')
      root.style.removeProperty('--color-secondary')
      root.style.removeProperty('--font-heading')
      document.body.className = ''
    }
  }, [theme])
}

// Utilidad para generar clases Tailwind dinámicas
export function getThemeClasses(primaryColor: string) {
  // Mapeo de colores hex a clases Tailwind
  const colorMap: Record<string, string> = {
    '#f43f5e': 'rose',    // rose-600
    '#ec4899': 'pink',    // pink-600
    '#a855f7': 'purple',  // purple-600
    '#3b82f6': 'blue',    // blue-600
    '#10b981': 'emerald', // emerald-600
    '#f59e0b': 'amber',   // amber-600
  }
  
  const colorName = colorMap[primaryColor] || 'rose'
  
  return {
    button: `bg-${colorName}-600 hover:bg-${colorName}-700 text-white`,
    text: `text-${colorName}-600`,
    bg: `bg-${colorName}-50`,
    border: `border-${colorName}-600`,
    gradient: `from-${colorName}-50 via-white to-${colorName}-50`
  }
}
